class ModalWindow {
	constructor() {
		this.generate_modal_window();
		this.data = {};
		this.data_params = {};
		this.modal_params = {};
	}

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

	////////////////////////////////////////////////////////////////////////////

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

	////////////////////////////////////////////////////////////////////////////

	async get_user_input() {
		var success = await this.show();
		if (success) {
			return this.data;
		} else {
			return null;
		}
	}

	////////////////////////////////////////////////////////////////////////////

	get_current_value(id) {
		console.log(id, this.data_params);
		var data_type = this.data_params[id]["type"];
		var data_element = this.content.querySelector(`[data-modal_input=${id}]`);

		switch (data_type) {
			case "text":
			case "int":
			case "select":
			case "dropdown":
				this.data[id] = data_element.value;
				break;
			case "checkbox":
				this.data[id] = data_element.checked;
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
		console.log("VERIFYING DATA");
		console.log(this.data_params);

		var failed_inputs = [];

		for (let data_id in this.data_params) {
			let constraints = this.data_params[data_id];
			let data = this.data[data_id];

			// If data is Optional, check is irrelevant
			if ("optional" in constraints) {
				continue;
			}

			// If the data has an unfulfilled dependency, check is irrelevant
			if ("dependency" in constraints &&
			    !(this.validate_dependency(data_id))) {
				continue;
			}

			// At this point, data is not optional and either does not have a 
			// dependency or the dependency is fulfilled, so it must not be
			// empty / undefined.
			if (data == null || data.length == 0) {
				let field_name = `'${this.data_params[data_id]["label_text"]}'`;
				failed_inputs.push(field_name);
			}
		}

		if (failed_inputs.length > 0) {
			var alert_text = "Error: Please fill in the " + failed_inputs.join(", ") + 
				" fields."
			alert(alert_text);
			return false
		}

		return true;
	}

// End Class
}


class AdvantagesModal extends ModalWindow {
	constructor(dict, advantage=true) {
		super();
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
		this.modal_params["discount"] = data["discount"];
		this.modal_params["output_text"] = data["output_text"];
		this.modal_params["bonus"] = data["bonus"];
		this.check_dependencies();
	}

	add_input_from_dict(input) {
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
				elem = document.createElement("input");
				elem.type = "button";
				elem.value = "DROPDOWN";

				var dropdown_type = input["dropdown_type"]
				if (dropdown_type == null) {
					console.log("ERROR: No dropdown type provided")
					dropdown_type = "skills"
				}
					
				var item_list = DH.get_list(dropdown_type)
				console.log(input['id'], dropdown_type, item_list);
				var dict = {}
				for (let i of item_list) {
					dict[i] = i;
				}
				let dropdown = new dropdown_with_sublists("Choice...", dict);
				elem = dropdown.dropdown;
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

	eval_string(str_input) {
		var string = String(str_input);
		var regex = /£(.+?)£/g;
		let matches = [...string.matchAll(regex)];

		if (matches.length == 0) {
			string = this.replace_with_data(string);
		} else {
			for (let match of matches) {
				let old_substring = match[0];
				let new_substring = this.replace_with_data(match[1]);
				string = string.replace(old_substring, new_substring);
			}
		}
		console.log("EVAL_STRING:", string, eval(string));
		return eval(string);
	}

	replace_with_data(string) {
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
			}
			console.log("REPLACE_WITH_DATA", old_substring, new_value);
			string = string.replace(old_substring, new_value);
		}

		// For some reason, using the £ sign does not work, so we must use its
		// hexadecimal representation, \xA3.
		var new_regex = /\xA3(.+?)\xA3/g
		let evals = [...string.matchAll(new_regex)];
		console.log(evals)
		for (let e of evals) {
			string = string.replace(e[0], eval(e[1]));
		}

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

}