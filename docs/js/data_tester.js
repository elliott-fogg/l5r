class DataTester extends DataHandler {

	constructor() {
		super();

		this.callbacks.push(function() {
			this.data_loaded = true;
			this.create_test_buttons_if_ready();
		}.bind(this));

		if (document.readyState === "complete") {
			this.document_ready = true;
			this.create_test_buttons_if_ready();
		} else {
			document.addEventListener('readystatechange', (event) => {
				if (document.readyState === "complete") {
					this.document_ready = true;
					this.create_test_buttons_if_ready();
				}
			});
		}

		this.test_functions = [
			["All Tests", this.run_all_tests],
			["Check Skill Choices", this.check_skill_choices]
		]
	}

	additional_init() {
		this.document_ready = false;
		this.data_loaded = false;
		this.queued_templates = [];
		this.html_query_promises = [];
		this.debounce_ask = false;
	}

	create_test_buttons_if_ready() {
		if (this.document_ready && this.data_loaded) {
			setTimeout(this.create_test_buttons(), 100);
		}
	}

	create_test_buttons() {
		var button_div = document.createElement("div");
		var self = this;

		//

		var load_div = document.createElement("div");

		var file_select = document.createElement("select");
		console.log(this.data);
		for (let data_type in this.data) {
			let option = document.createElement("option");
			option.value = data_type;
			option.innerHTML = data_type;
			file_select.appendChild(option);
		}
		load_div.appendChild(file_select);

		var file_button = document.createElement("input");
		file_button.type = "file";
		load_div.appendChild(file_button);

		var upload_button = document.createElement("input");
		upload_button.type = "button";
		upload_button.value = "Load Local File";
		upload_button.onclick = function() {
			var fr = new FileReader()
			fr.addEventListener("load", e => {
				// console.log(JSON.parse(fr.result))
				var data_to_replace = file_select.value;
				console.log(data_to_replace);
				self.data[data_to_replace] = JSON.parse(fr.result);
			});
			fr.readAsText(file_button.files[0]);
		}
		load_div.appendChild(upload_button);

		//

		var test_div = document.createElement("div");

		var test_select = document.createElement("select");

		for (let pair of this.test_functions) {
			let option = document.createElement("option");
			console.log(pair);
			option.innerHTML = pair[0];
			option.value = pair[0];
			test_select.appendChild(option);
		}
		test_div.appendChild(test_select);

		var test_button = document.createElement("input");
		test_button.type = "button";
		test_button.value = "Run Test";
		test_button.onclick = function() {
			console.log(test_select.value);
			var test_name = test_select.value;
			var func;

			for (let pair of self.test_functions) {
				if (pair[0] == test_name) {
					func = pair[1];
					break;
				}
			}
			func.call(self);
		}
		test_div.appendChild(test_button);

		//

		button_div.appendChild(load_div);
		button_div.appendChild(test_div);

		document.getElementsByTagName("BODY")[0].prepend(button_div);
	}

	// Load local HTML templates ///////////////////////////////////////////////

	// Extend the Promises to include HTML Query Promises
	async await_data() {
		await Promise.all([Promise.all(this.data_promises),
		                   Promise.all(this.html_promises),
		                   Promise.all(this.html_query_promises)]);
		this.complete_function();
	}

	handle_load_html(element, file_name, resolveFunc) {
		this.queued_templates.push( [element, file_name, resolveFunc] );
		this.ask_html_templates();
	}

	async ask_html_templates() {
		if (this.queued_templates.length == 0) {
			return;
		}

		var [element, file_name, resolve] = this.queued_templates.shift();

		console.groupCollapsed("Asking about HTML File: " + file_name);
		console.log(element);
		console.groupEnd();

		var modal = new ModalWindow();
		modal.add_title("Replace with HTML Template?");
		modal.add_subtitle(file_name);
		modal.add_checkbox_input("use_local", "Local File?", false, false);
		modal.add_file_input("local_file", "File Name", ".html", false,
		                     "{use_local} == true");
		modal.check_dependencies();

		var input_data = await modal.get_user_input();

		if (input_data) {
			if (input_data["use_local"]) {
				this.load_local_template(element, input_data["local_file"], resolve);
			} else {
				this.load_html_template_from_website(element, file_name, resolve);
			}
		} else {
			this.element_failed_load(element, `${file_name} (ignored)`);
		}

		this.ask_html_templates();
	}

	load_local_template(element, local_file, resolve) {
		var fr = new FileReader();
		fr.addEventListener("load", e => {
			element.innerHTML = fr.result;
			console.log(local_file);
			console.log(element);
			console.log(element.firstChild);
			console.log(element.firstChild.dataset.objectname);
			console.log(element.firstChild.dataset.objectname);
			var object_to_call = element.firstChild.dataset.objectname;
			if (object_to_call) {
				window.DH.execute_on_load(Function(`new ${object_to_call}()`));
			}
			
			console.log(`${local_file} loaded`);
			resolve();
		})
		fr.readAsText(local_file);
	}

	// Tests ///////////////////////////////////////////////////////////////////

	run_all_tests() {
		this.test_discounts();
		this.check_comments();
		this.check_schools()
	}

	check_schools() {
		var direct_values = {
			"class": new Set(),
			"attribute": new Set(),
			"honor": new Set(),
			"affinity": new Set(),
			"koku": new Set(),
			"special": new Set()
		}

		var list_values = {
			"skills": new Set(),
			"skill_choices": new Set(),
			"gear": new Set(),
			"spells": new Set()
		}

		for (let clan in this.data.schools) {
			for (let school in this.data.schools[clan]) {
				let info = this.data.schools[clan][school];

				for (let key in direct_values) {
					direct_values[key].add(info[key]);
				}

				for (let key in list_values) {
					if (info[key] == null) {
						list_values[key].add(null);
					} else {
						for (let item of info[key]) {
							list_values[key].add(item);
						}
					}
				}
			}
		}

		console.log(direct_values);
		console.log(list_values);
	}

	check_advantages() {
		for (let data of [this.advantages, this.disadvantages]) {
			for (let adv in data) {

			}
		}
	}

	test_discounts() {
		console.group("Advantages Discounts");
		console.group("Advantages");
		for (let adv in this.data.advantages) {
			console.log(adv, this.data.advantages[adv].cost);
		}
		console.groupEnd();
		console.group("Disadvantages");
		for (let dis in this.data.disadvantages) {
			console.log(dis, this.data.disadvantages[dis].cost);
		}
		console.groupEnd();
		console.groupEnd();
	}

	check_comments() {
		console.group("Advantage Comments");
		for (let adv in this.data.advantages) {
			if (this.data.advantages[adv]._COMMENT) {
				console.log(adv, this.data.advantages[adv]._COMMENT);
			}
		}
	}

	check_skill_choices() {
		console.group("Skill Choices");
		for (let adv in this.data.skills) {

		}
	}
}