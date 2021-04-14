class ModalWindow {
	constructor() {
		this.generate_modal_window();
		this.data = {};
		this.data_params = {};
		this.modal_params = {};
	}

	// Top Level Function //////////////////////////////////////////////////////

	generate_modal_window() {
		var modal_div = document.createElement("div");
		modal_div.className = "modal";

		var modal_content = document.createElement("div");
		modal_content.className = "modal_content";
		modal_div.appendChild(modal_content);

		var title_div = document.createElement("div");
		title_div.className = "modal_div modal_title";
		modal_content.appendChild(title_div);

		var description_div = document.createElement("div");
		description_div.className = "modal_div modal_description";
		modal_content.appendChild(description_div);

		var main_input_div = document.createElement("div");
		main_input_div.className = "modal_div modal_input";
		modal_content.appendChild(main_input_div);

		var button_div = document.createElement("div");
		button_div.className = "modal_div modal_buttons";
		modal_content.appendChild(button_div);

		var confirm_button = document.createElement("input");
		confirm_button.type = "button";
		confirm_button.value = "Confirm";
		button_div.appendChild(confirm_button);

		var cancel_button = document.createElement("input");
		cancel_button.type = "button";
		cancel_button.value = "Cancel";
		cancel_button.className = "modal_close";
		button_div.appendChild(cancel_button);

		this.main_div = modal_div;
		this.content = modal_content;
		this.title_div = title_div;
		this.description_div = description_div;
		this.main_input_div = main_input_div;
		this.button_div = button_div;
		this.confirm_button = confirm_button;
		this.cancel_button = cancel_button;
	}

	// Add Elements ////////////////////////////////////////////////////////////

	add_title(title_text) {
		var title = document.createElement("h1");
		title.innerHTML = title_text;
		this.title_div.appendChild(title);
	}

	add_subtitle(subtitle_text) {
		var subtitle = document.createElement("h4");
		subtitle.innerHTML = subtitle_text;
		this.title_div.appendChild(subtitle);
	}

	add_description(description_text) {
		var description = document.createElement("p");
		description.innerHTML = description_text;
		this.description_div.appendChild(description);
	}

	// Input Handling //////////////////////////////////////////////////////////

	add_input(id, label_text, input_element, type, 
	          			optional=null, dependency=null) {
		console.group("Creating Input");
		var input_div = document.createElement("div");
		input_div.dataset.modal_div = id;
		input_div.className = "modal_input_div";

		if (label_text != null) {
			var lbl = document.createElement("label");
			lbl.innerHTML = label_text;
			if (!(":?".includes(lbl.innerHTML.slice(-1)))) {
				lbl.innerHTML += ":";
			}
			lbl.style = "vertical-align: top";
			input_div.appendChild(lbl);
		}

		input_element.dataset.modal_input = id;
		input_element.onchange = function() {
			this.get_current_value(id);
			this.check_dependencies();
		}.bind(this);
		input_div.appendChild(input_element);

		this.main_input_div.appendChild(input_div);
		this.data[id] = null;
		this.data_params[id] = {"optional": optional,
								"dependency": dependency,
								"label_text": label_text,
								"type": type};
		console.groupEnd();
	}

	set_input_constraints(id, constraints_dict) {
		for (let constraint in constraints_dict) {
			this.data_params[id][constraint] = constraints_dict[constraint];
		}
	}

	add_input_from_dict(input) {
		switch (input["type"]) {
			case "text":
				this.add_text_input(input["id"], input["label_text"],
				                    input["placeholder"], input["default_value"],
				                    input["textbox"], input["optional"],
				                    input["dependency"]);
				break;

			case "int":
				this.add_int_input(input["id"], input["label_text"],
				                   input["max"], input["min"],
				                   input["default_value"], input["optional"],
				                   input["dependency"]);
				break;

			case "select":
				this.add_select_input(input["id"], input["label_text"],
				                                input["options"],
				                                input["default_option"],
				                                input["optional"],
				                                input["dependency"]);
				break;

			case "checkbox":
				this.add_checkbox_input(input["id"], input["label_text"],
				                             input["start_checked"],
				                             input["optional"],
				                             input["dependency"]);
				break;

			case "multicheckbox":
				this.add_multicheckbox_input(input["id"], input["label_text"],
				                        input["options"], input["optional"],
				                        input["dependency"]);
				break;

			case "dropdown":
				this.add_dropdown_input(input["id"], input["label_text"],
				                        input["dropdown_type"],
				                        input["optional"], input["dependency"]);
				break;

			case "wordlist":
				this.add_wordlist_input(input["id"], input["label_text"],
				                        input["placeholder"], input["optional"],
				                        input["dependency"]);

			default:
				console.log(`NO MODAL OPTION FOR INPUT OF TYPE '${input["type"]}'`);
		}
	}

	get_current_value(id) {
		// console.log("TRIGGERED get_current_value");
		// console.log("PARAMS:", id, this.data_params);
		var data_type = this.data_params[id]["type"];
		var data_element = this.content.querySelector(`[data-modal_input=${id}]`);

		switch (data_type) {
			case "text":
			case "int":
			case "select":
				this.data[id] = data_element.value;
				break;
			case "checkbox":
				this.data[id] = data_element.checked;
				break;
			case "dropdown":
				this.data[id] = data_element.dataset.value;
				break;
			case "multicheckbox":
				let checked_boxes = [];
				for (let lbl of data_element.querySelectorAll("label")) {
					if (lbl.querySelector("input").checked) {
						checked_boxes.push(lbl.querySelector("p").textContent);
					}
				}
				this.data[id] = checked_boxes;
				break;
			case "wordlist":
				let words = [];
				var btn_div = data_element.querySelector("div");
				for (let btn of btn_div.querySelectorAll("input")) {
					words.push(btn.value);
				}
				this.data[id] = words;
				break;
			case "file":
				var data = data_element;
				if (data.files[0] != null) {
					this.data[id] = data.files[0];
				} else {
					this.data[id] = null;
				}
				break;

			default:
				console.error(`No Modal Input of type '${data_type}' found.`);
		}
	}

	check_dependencies(data) {
		var input_divs = this.content.querySelectorAll(`div[data-modal_div]`);
		for (let div of input_divs) {
			let data_id = div.dataset.modal_div;

			if (this.validate_dependency(data_id)) {
				div.style.display = "block";
			} else {
				div.style.display = "none";
			}
		}
	}

	validate_dependency(data_id) {
		var dependency_string = this.data_params[data_id]["dependency"];

		// If input has no dependency, always evaluate to true
		if (dependency_string == null) {
			return true;
		}

		// {string} in the Dependency String represents the value of a different
		// input. Replace the substrings within the Dependency_String.
		let matches = [...dependency_string.matchAll(/{([a-zA-Z_]+)}/g)];
		for (let match of matches) {
			let string_to_replace = match[0];
			let new_value = this.data[match[1]];
			dependency_string = dependency_string.replace(string_to_replace,
			                                              new_value);
		}

		console.log("REPLACED DEPENDENCY STRING", dependency_string, eval(dependency_string));

		return eval(dependency_string);
	}

	verify_data() {
		console.groupCollapsed("Validating Modal");

		var failed_inputs = [];

		for (let data_id in this.data_params) {
			this.get_current_value(data_id);
			let constraints = this.data_params[data_id];
			let data = this.data[data_id];

			console.log(data);

			// If data is Optional, check is irrelevant
			if (constraints["optional"]) {
				// Ignores constraints["optional"] == null, as intended
				console.log(`${data_id}: Optional`);
				continue
			}

			// If the data has an unfulfilled dependency, check is irrelevant
			if (constraints["dependency"] && 
			    	!(this.validate_dependency(data_id))) {
				console.log(`${data_id}: Unfulfilled dependency`)
				continue;
			}

			// At this point, data is not optional and either does not have a 
			// dependency or the dependency is fulfilled, so it must NOT be
			// empty / undefined.
			if (data == null || data.length == 0) {
				let field_name = `'${this.data_params[data_id]["label_text"]}'`;
				failed_inputs.push(field_name);
				console.log(`Label: ${field_name}, id: '${data_id}'; FAILED`);
			}
		}

		console.groupEnd();

		// If any required fields have not been filled in, alert and reject
		if (failed_inputs.length > 0) {
			var alert_text = "Error: Please fill in the " + failed_inputs.join(", ") + 
				" fields."
			alert(alert_text);
			return false
		}

		// All required fields are filled in => accept
		return true;
	}

	// Input Types /////////////////////////////////////////////////////////////

	add_text_input(id, label_text, placeholder=null, default_value=null,
	               textbox=null, optional=false, dependency=null) {

		placeholder = (placeholder == null) ? "" : placeholder;
		default_value = (default_value == null) ? "" : default_value;

		if (placeholder == null) {
			placeholder = "";
		}

		var elem;
		if (textbox) {
			elem = document.createElement("textarea");
		} else {
			elem = document.createElement("input");
			elem.type = "text";
		}
		elem.value = default_value;
		elem.placeholder = placeholder;
		this.add_input(id, label_text, elem, "text", optional, dependency);
	}

	add_int_input(id, label_text, max=null, min=null, default_value=null,
	              optional=null, dependency=null) {

		// If missing Default_value, set to Min, or 0 if there is no Min
		if (default_value == null) {
			if (min == null) {
				default_value = 0;
			} else {
				default_value = min;
			}
		}

		var elem = document.createElement("input");
		elem.type = "number";
		elem.max = max;
		elem.min = min;
		elem.value = default_value;
		this.add_input(id, label_text, elem, "int", optional, dependency);
		this.set_input_constraints(id, {"max": max, "min": min});
	}

	add_select_input(id, label_text, options, default_text=null,
	                 optional=null, dependency=null) {

		default_text = (default_text == null) ? "Select..." : default_text;

		var elem = document.createElement("select");
		for (let opt_text in options) {
			let option = document.createElement("option");
			option.innerHTML = opt_text;
			option.value = opt_text;
			elem.appendChild(option);
		}

		var def_opt = document.createElement("option");
		def_opt.style.display = "none";
		def_opt.innerHTML = default_text;
		def_opt.value = "";
		def_opt.selected = true;
		elem.appendChild(def_opt);
		this.add_input(id, label_text, elem, "select", optional, dependency);
		this.set_input_constraints(id, {"options": options});
	}

	add_checkbox_input(id, label_text, start_checked=null,
	                   optional=null, dependency=null) {
		var elem = document.createElement("input");
		elem.type = "checkbox";
		elem.checked = start_checked; // here, null == undefined == false
		this.add_input(id, label_text, elem, "checkbox", optional, dependency);
	}

	// NEEDS WORK FOR CREATING DROPDOWN_TYPES
	add_dropdown_input(id, label_text, dropdown_type,
	                   optional=null, dependency=null) {
		var item_list = window.DH.get_list(dropdown_type);
		let dropdown = new CustomDropdown("Choice...", item_list, false);
		var elem = dropdown.dropdown;
		this.add_input(id, label_text, elem, "dropdown", optional, dependency);
	}

	add_multicheckbox_input(id, label_text, options,
	                        optional=null, dependency=null) {
		var elem = document.createElement("div");
		for (let opt of options) {
			let opt_label = document.createElement("label");

			let checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.onchange = function() {
				elem.onchange();
			}

			let text = document.createElement("p");
			text.innerHTML = opt;
			text.style = "user-select: none";

			opt_label.appendChild(checkbox);
			opt_label.appendChild(text);
			elem.appendChild(opt_label);
		}
		this.add_input(id, label_text, elem, "multicheckbox", optional, 
		               dependency);
	}

	add_wordlist_input(id, label_text, placeholder=null, optional=null,
	                   dependency=null) {
		
		console.log("WORDLIST INPUT");

		if (placeholder == null) {placeholder = ""};

		var elem = document.createElement("div");

		var keywords = document.createElement("div");
		keywords.style.display = "inline";

		var text_input = document.createElement("input");
		text_input.type = "text";
		text_input.placeholder = placeholder;

		var btn_add = document.createElement("input");
		btn_add.type = "button";
		btn_add.value = "Add Keyword";
		btn_add.onclick = function() {
			console.log("Add Keyword");
			if (text_input.value.length == 0) {
				return;
			}
			console.log(text_input.value.length);
			var new_word = document.createElement("input");
			new_word.type = "button";
			new_word.value = text_input.value;
			new_word.onclick = function() {
				new_word.remove();
			}
			keywords.appendChild(new_word);
			text_input.value = "";
			elem.onchange();
		}

		elem.appendChild(keywords);
		elem.appendChild(document.createElement("br"));
		elem.appendChild(text_input);
		elem.appendChild(btn_add);
		elem.style.display = "inline";

		this.add_input(id, label_text, elem, "wordlist", optional, dependency);
	}

	add_file_input(id, label_text, file_types=null, optional=null,
	               dependency=null) {
		var elem = document.createElement("input");
		elem.type = "file";
		elem.accept = file_types;
		this.add_input(id, label_text, elem, "file", optional, dependency);
	}

	// Interaction Functions ///////////////////////////////////////////////////

	set_button_functions(confirm_func) {
		// Bind the confirm_func to the Confirm Button
		this.confirm_button.onclick = function() {
			for (let data_id in this.data_params) {
				this.get_current_value(data_id);
			}
			var data_valid = this.verify_data();
			if (data_valid) {
				this.close();
				confirm_func(true);
			}
		}.bind(this);

		// Bind a null confirm_func to the Cancel Button
		this.cancel_button.onclick = function() {
			this.close();
			confirm_func(false);
		}.bind(this);
	}

	async show() {
		return new Promise((confirm_func, reject_func) => {
			this.set_button_functions(confirm_func);
			document.body.appendChild(this.main_div);
		});
	}

	close() {
		this.main_div.remove();
	}

	async get_user_input() {
		var success = await this.show();
		if (success) {
			return this.data;
		} else {
			return null;
		}
	}

	////////////////////////////////////////////////////////////////////////////

// End Class
}


class AdvantagesModal extends ModalWindow {
	constructor(dict) {
		super();
		console.log("MODAL DATA:", dict);
		this.construct_from_dict(dict);
	}

	construct_from_dict(data) {
		// Add title and description
		this.add_title(data["title"]);
		this.add_description(data["description"]);

		// Insert the Cost as a subtitle
		var cost_text;
		if (isNaN(parseInt(data["cost"]))) {
			cost_text = "Cost: Varies";
		} else {
			cost_text = "Cost: " + String(data["cost"]);
		};
		this.add_subtitle(cost_text);

		// Add Inputs
		if ("input" in data) {
			for (let input of data["input"]) {
				this.add_input_from_dict(input);
			}
		}

		this.modal_params["title"] = data["title"];
		this.modal_params["description"] = data["description"];
		this.modal_params["cost"] = data["cost"];
		this.modal_params["discount"] = data["discount"] || "";
		this.modal_params["output_text"] = data["output_text"];
		this.modal_params["bonus"] = data["bonus"];
		this.check_dependencies();
	}

	// Replace with Advantage-Specific function
	add_select_input(id, label_text, options, default_text, optional,
	                 dependency) {
		
		console.log("AdvantagesModal add_select_input");
		console.log("Options:", options);

		if (default_text == null) {
			default_text = "Select...";
		}

		console.groupCollapsed("Options");

		var elem = document.createElement("select");
		for (let opt_num in options) {
			let opt_info = options[opt_num];
			console.log(opt_info);

			// Create Option
			var option = document.createElement("option");
			option.innerHTML = opt_info["text"];
			option.value = opt_num;

			// Create Option Suffix for option-specific Cost and Discount
			var suffix = [];
				// Add Cost, if applicable
			if (opt_info["cost"]) {
				suffix.push(`Cost: ${opt_info["cost"]}`);
			}
				// Add Discount, if applicable
			if (opt_info["discount"]) {
				let discount_list = [];
				for (let discount of opt_info["discount"].split(" ")) {
					discount_list.push(discount.split("_")[1]);
				}
				suffix.push(`Discount: ${discount_list.join(", ")}`);
			}
				// Add suffix to option IFF there is one to add
			if (suffix.length > 0) {
				option.innerHTML += ` (${suffix.join(", ")})`;
			}

			// Add Hovertext for option
			if (opt_info["hovertext"]) {
				option.title = opt_info["hovertext"];
			}
			elem.appendChild(option);
		}

		console.groupEnd();

		// Construct the Default Option
		var def = document.createElement("option");
		def.style.display = "none";
		def.innerHTML = default_text;
		def.value = "";
		def.selected = true;
		elem.appendChild(def);

		this.add_input(id, label_text, elem, "select", optional, dependency);
		this.set_input_constraints(id, {"options": options})
	}

	// Replace with Advantage-Specific function that pre-processes the data
	async get_user_input() {
		var success = await this.show();

		if (success) {
			var output_data = {};
			for (let data_id in this.data) {
				if (this.validate_dependency(data_id)) {
					output_data[data_id] = data_id;
				}
			}

			return {
				"title": this.replace_with_data(this.modal_params["title"]),
				"data": this.data,
				"cost": this.replace_with_data(this.modal_params["cost"]),
				"discount": this.replace_with_data(this.modal_params["discount"]
					 || ""),
				"text": this.replace_with_data(this.modal_params["output_text"])
			}
		} else {
			return null;
		}
	}

	replace_with_data(string) {
		console.groupCollapsed("Replacing Data");
		console.log(string);
		string = String(string);
		var regex = /{([^\[]+?)(?:\[(.+?)\])?}/g;
		var matches = [...string.matchAll(regex)];
		for (let match of matches) {
			let old_substring = match[0];
			let data_id = match[1];
			let aspect = match[2];

			let new_value;

			console.log(data_id, this.data_params[data_id]);
			let data_type = this.data_params[data_id]["type"];
			switch (data_type) {
				case "text":
				case "int":
				case "checkbox":
				case "dropdown":
				case "textbox":
					new_value = this.data[data_id];
					break;
				case "select":
					console.log("SELECT REPLACE:", old_substring, data_id, aspect, "ALL")
					if (aspect == null) {
						new_value = this.data[data_id];
					} else {
						let selection = this.data[data_id];
						new_value = this.replace_with_data(
							this.data_params[data_id]["options"][selection][aspect]);
					}
					break;
				default:
					console.log(`Cannot replace data in string. Input type '${data_type}' unrecognised.`);
			}

			console.log("REPLACE_WITH_DATA", old_substring, new_value);
			string = string.replace(old_substring, new_value);
		}

		// For some reason, using the £ sign does not work, so we must use its
		// hexadecimal representation, \xA3.
		var new_regex = /\xA3(.+?)\xA3/g
		let evals = [...string.matchAll(new_regex)];
		for (let e of evals) {
			string = string.replace(e[0], eval(e[1]));
		}

		console.groupEnd();
		return string
	}

// End Class
}

class AdvantagesModalOriginal extends ModalWindow {
	constructor(dict) {
		super();
		console.log("MODAL DATA:", dict);
		this.data = {};
		this.data_params = {};
		this.modal_params = {};
		this.construct_from_dict(dict);
	}

	construct_from_dict(data) {
		this.add_title(data["title"]);
		this.add_description(data["description"]);

		// Insert the Cost and Discounts just below the title
		var subtitle = document.createElement("h4")
		subtitle.style = "display: inline";
		let cost_text;
		if (isNaN(parseInt(data["cost"]))) {
			subtitle.innerHTML = "Cost: Varies";
		} else {
			subtitle.innerHTML = "Cost: " + String(data["cost"]);
		}
		this.title_div.appendChild(subtitle);
		// this.title_div.parentNode.insertBefore(subtitle, this.title_div.nextSibling);


		if ("input" in data) {
		for (let input of data["input"]) {
				this.add_input_from_dict(input);
			}
		}
	
		this.modal_params["title"] = data["title"];
		this.modal_params["description"] = data["description"];
		this.modal_params["cost"] = data["cost"];
		this.modal_params["discount"] = data["discount"] || "";
		this.modal_params["output_text"] = data["output_text"];
		this.modal_params["bonus"] = data["bonus"];
		this.check_dependencies();
	}

	add_input_from_dict(input) {
		console.group("Creating Input");
		var input_div = document.createElement("div");
		input_div.dataset.modal_div = input["id"];
		// input_div.id = "MODAL_DIV_" + input["id"];
		input_div.className = "modal_input_div";

		if (input["label_text"] != null) {
			var lbl = document.createElement("label");
			lbl.innerHTML = input["label_text"];
			if (!(":?".includes(lbl.innerHTML.slice(-1)))) {
				lbl.innerHTML += ":";
			}
			lbl.style="vertical-align: top";
			input_div.appendChild(lbl);
		}

		var elem;
		switch (input["type"]) {
			case "text":
				elem = document.createElement("input");
				elem.type = "text";
				elem.value = (input["default_value"] != null) 
					? input["default_value"] : "";
				elem.placeholder = (input["placeholder"] != null) 
					? input["placeholder"] : "";
				break;

			case "textbox":
				elem = document.createElement("textarea");
				elem.value = input["default_value"] || "";
				elem.placeholder = input["placeholder"] || "";
				break;

			case "int":
				elem = document.createElement("input");
				elem.type = "number";
				elem.max = (input["max"] != null) ? input["max"] : "";
				elem.min = (input["min"] != null) ? input["min"] : "";

				if (input["default_value"] != null) {
					elem.value = input["default_value"];
				} else if (input["min"] != null) {
					elem.value = input["min"];
				}
				break;

			case "select":
				elem = document.createElement("select");
				for (let opt_num in input["options"]) {
					let opt_info = input["options"][opt_num];
					var option = document.createElement("option");
					option.innerHTML = opt_info["text"];
					option.value = opt_num;

					var hovertext = opt_info["hovertext"];
					var hovertext_addition = [];
					if (opt_info["cost"]) {
						hovertext_addition.push(`Cost: ${opt_info["cost"]}`);
					}
					if (opt_info["discount"]) {
						let discount_list = [];
						console.log(opt_info["discount"]);
						for (let discount of opt_info["discount"].split(" ")) {
							console.log(discount);
							discount_list.push(discount.split("_")[1]);
						}
						hovertext_addition.push(`Discount: ${discount_list.join(", ")}`)
					}
					if (hovertext_addition.length > 0) {
						option.innerHTML += ` (${hovertext_addition.join(", ")})`;
					}

					if (hovertext != null) {
						option.title = hovertext;
					}
					elem.appendChild(option);
				}
				if (input["default_option"] != null) {
					var def = document.createElement("option");
					def.style.display = "none";
					def.innerHTML = input["default_option"];
					def.value = "";
					def.selected = true;
					elem.appendChild(def);
				}
				break;

			case "checkbox":
				elem = document.createElement("input");
				elem.type = "checkbox";
				if (input["start_checked"]) {
					elem.checked = true;
				}
				break;

			case "dropdown":
				var dropdown_type = input["dropdown_type"]
				if (dropdown_type == null) {
					console.log("ERROR: No dropdown type provided")
					dropdown_type = "skills"
				}
				
				// var item_dict = DH.get_dropdown_list(dropdown_type);

				var item_list = DH.get_list(dropdown_type);
				console.log(item_list);
				// var dict = {};
				// for (let i of item_list) {
				// 	dict[i] = i;
				// }
				let dropdown = new CustomDropdown("Choice...", item_list, false);
				elem = dropdown.dropdown;

				// if (dropdown_type == "test") {
				// 	let dropdown = new CustomDropdown("Test", test_data_2, false);
				// 	elem = dropdown.dropdown;
				// 	break;
				// }

				// var item_list = DH.get_list(dropdown_type)
				// console.log(input['id'], dropdown_type, item_list);
				// var dict = {}
				// for (let i of item_list) {
				// 	dict[i] = i;
				// }
				// let dropdown = new dropdown_with_sublists("Choice...", dict);
				// elem = dropdown.dropdown;
				break;

			case "multicheckbox":
				elem = document.createElement("div");
				for (let opt of input["options"]) {
					let opt_label = document.createElement("label");

					let checkbox = document.createElement("input");
					checkbox.type = "checkbox";

					let cb_label = document.createElement("p");
					cb_label.innerHTML = opt;
					cb_label.style = "display: inline; user-select: none";

					opt_label.appendChild(checkbox);
					opt_label.appendChild(cb_label);
					elem.appendChild(opt_label);
				}
				break;

			default:
				console.log(`NO MODAL OPTION FOR INPUT OF TYPE '${input["type"]}'`)
		}

		elem.dataset.modal_input = input["id"];
		elem.onchange = function() {
			this.get_current_value(input["id"]);
			this.check_dependencies();
		}.bind(this);
		input_div.appendChild(elem);

		this.main_input_div.appendChild(input_div);
		this.data[input["id"]] = null;
		this.data_params[input["id"]] = input;
		console.groupEnd();
	}

	create_subtitle(data) {
		let cost_text;
		if (isNaN(parseInt(data["cost"]))) {
			cost_text = "Cost: Varies";
		} else {
			cost_text = "Cost: " + String(data["cost"]);
		}
		this.add_subtitle(cost_text);
	}

	async get_user_input() {
		var success = await this.show();

		if (success) {
			var output_data = {};
			for (let data_id in this.data) {
				if (this.validate_dependency(data_id)) {
					output_data[data_id] = data_id;
				}
			}

			return {
				"title": this.replace_with_data(this.modal_params["title"]),
				"data": this.data,
				"cost": this.calculate_cost(),
				"discount": this.get_discount(),
				"text": this.get_output_text()
			}
		} else {
			return null;
		}
	}

	replace_with_data(string) {
		console.group("Replacing Data");
		console.log(string);
		string = String(string);
		var regex = /{([^\[]+?)(?:\[(.+?)\])?}/g;
		var matches = [...string.matchAll(regex)];
		for (let match of matches) {
			let old_substring = match[0];
			let data_id = match[1];
			let aspect = match[2];

			let new_value;

			// Reserve PLAYER keyword for fetching values from the character
			// e.g. Status
			if (data_id == "PLAYER") {
				new_value = this.get_character_value(aspect);
			} 

			else {
				console.log(data_id, this.data_params[data_id]);
				let data_type = this.data_params[data_id]["type"];
				switch (data_type) {
					case "text":
					case "int":
					case "checkbox":
					case "dropdown":
					case "textbox":
						new_value = this.data[data_id];
						break;
					case "select":
						console.log("SELECT REPLACE:", old_substring, data_id, aspect, "ALL")
						if (aspect == null) {
							new_value = this.data[data_id];
						} else {
							let selection = this.data[data_id];
							new_value = this.replace_with_data(
								this.data_params[data_id]["options"][selection][aspect]);
						}
						break;
					default:
						console.log(`Cannot replace data in string. Input type '${data_type}' unrecognised.`);
				}
			}

			console.log("REPLACE_WITH_DATA", old_substring, new_value);
			string = string.replace(old_substring, new_value);
		}

		// For some reason, using the £ sign does not work, so we must use its
		// hexadecimal representation, \xA3.
		var new_regex = /\xA3(.+?)\xA3/g
		let evals = [...string.matchAll(new_regex)];
		for (let e of evals) {
			string = string.replace(e[0], eval(e[1]));
		}

		console.groupEnd();
		return string
	}

	calculate_cost() {
		return eval(this.replace_with_data(this.modal_params["cost"]));
	}

	get_discount() {
		if ("discount" in this.modal_params) {
			return this.replace_with_data(this.modal_params["discount"]);
		} else {
			return "";
		}
	}

	get_output_text() {
		return this.replace_with_data(this.modal_params["output_text"]);
	}

	get_character_value(string) {

	}

}

class SpellsModal extends ModalWindow {

}