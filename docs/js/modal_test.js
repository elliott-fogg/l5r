// TODO:
// * Add in CustomDropdown for Skill Selection - Make it work
// * Add in Textbox Input Option

function load_data(files) {
	for (file of files) {
		let reader = new FileReader();

		if (file["name"] == "advantages.json") {
			reader.addEventListener('load', load_advantages_data);
		} else if (file["name"] == "disadvantages.json") {
			reader.addEventListener('load', load_disadvantages_data);
		} else {
			alert(`File '${file["name"]}' not recognised.`);
		}
		reader.readAsText(file);
	}
}

function load_advantages_data(file) {
	// Get output from FileReader
	let text = event.target.result;
	// If output is null, abort
	if (text == null) {return};
	// Delete all currently existing test buttons
	var btn_list = document.querySelectorAll(
	                            "input[type='button'].testbutton.advantage");
	for (btn of btn_list) {
		btn.remove();
	}
	// Change the page title to reflect that we're using the local file
	var title_dom = document.querySelector("h2");
	title_dom.innerHTML = "Test Page - Using local Advantages";
	// Create new test buttons
	add_all_modal_tests(JSON.parse(text), true);
}

function load_disadvantages_data(event) {
	// Get output from FileReader
	let text = event.target.result;
	// If output is null, abort
	if (text == null) {return};
	// Delete all currently existing test buttons
	var btn_list = document.querySelectorAll(
	                            "input[type='button'].testbutton.disadvantage");
	for (btn of btn_list) {
		btn.remove();
	}
	// Change the page title to reflect that we're using the local file
	var title_dom = document.querySelector("h2");
	title_dom.innerHTML = "Test Page - Using local Disadvantages";
	// Create new test buttons
	add_all_modal_tests(JSON.parse(text), false)
}

function add_test_button(button_text, data, advantage=true) {
	var btn = document.createElement("input");
	btn.type = "button";
	btn.value = button_text;
	if (advantage) {
		btn.classList = "testbutton advantage";
	} else {
		btn.classList = "testbutton disadvantage";
	}
	btn.onclick = async function() {
		console.log("TESTING: " + button_text);

		console.log("MODAL NEEDED")
		var modal = new AdvantagesModal(data);
		var input_data = await modal.get_user_input();
		if (input_data) {
			if (advantage) {
				create_advantage(input_data);
			} else {
				create_disadvantage(input_data);
			}
			
		} else {
			console.log("TEST cancelled.");
		}
	}

	if (advantage) {
		if (data["input"]) {
			var dropdown = false;
			for (let i of data["input"]) {
				if (i['type'] == "dropdown") {
					dropdown = true;
					break;
				}
			}
			if (dropdown) {
				document.getElementById("dropdown_advs").appendChild(btn);
			} else {
				document.getElementById("input_advs").appendChild(btn);
			}

		} else {
			document.getElementById("no_input_advs").appendChild(btn);
		}		
	} else {
		if (data["cost"] == -1) {
			// Disadvantage is not finished
			document.getElementById("unfinished_disadvs").appendChild(btn);
		} else {
			document.getElementById("finished_disadvs").appendChild(btn);
		}
	}
}

function add_all_modal_tests(data, advantage=true) {
	for (var adv_name in data) {
		add_test_button(adv_name, data[adv_name], advantage)
	}
}

function create_adv_disadv(data, adv) {
	var div = document.createElement("div");
	div.style = "border: solid black 1px;"

	var toggle = document.createElement("label");
	toggle.className = "toggle active";
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = true;
	checkbox.onchange = function() {
		var parent = this.parentNode;
		if (this.checked) {
			parent.classList.add("active");
		} else {
			parent.classList.remove("active");
		}
	}
	toggle.appendChild(checkbox);

	var title = document.createElement("p");
	title.innerHTML = data["title"];
	title.style = "display: inline; margin-right: 30px";
	toggle.appendChild(title);

	var cost_label = document.createElement("p");
	if (adv) {
		cost_label.innerHTML = "Cost: ";
	} else {
		cost_label.innerHTML = "Refund: ";
	}
	cost_label.style = "display: inline; margin-right: 10px";
	toggle.appendChild(cost_label);

	var cost = document.createElement("p");
	cost.dataset.base_cost = data["cost"];
	cost.innerHTML = data["cost"];
	cost.style = "display: inline; margin-right: 10px";
	cost.className = "cost_p";
	toggle.appendChild(cost);

	var discount_label = document.createElement("p");
	if (adv) {
		discount_label.innerHTML = "Discount:";
	} else {
		discount_label.innerHTML = "Bonus:";
	}
	discount_label.style = "display: inline; margin-right: 10px";
	toggle.appendChild(discount_label);

	var discount = document.createElement("p");
	discount.innerHTML = data["discount"];
	discount.style = "display: inline; margin-right: 10px";
	discount.className = "discount";
	toggle.appendChild(discount);

	div.appendChild(toggle);

	var delete_btn = document.createElement("input");
	delete_btn.type = "button";
	delete_btn.value = "Delete";
	delete_btn.style = "margin-left: auto; margin-right: 0;"
	delete_btn.onclick = function() {div.remove();}
	toggle.appendChild(delete_btn);

	var content_div = document.createElement("div");
	var p = document.createElement("p");
	p.innerHTML = data["text"];
	content_div.appendChild(p);
	div.appendChild(content_div);

	if (adv) {
		document.getElementById("advantages_div").appendChild(div);
	} else {
		document.getElementById("disadvantages_div").appendChild(div);
	}
	
	refresh_advantage_costs();
}

function create_advantage(data) {
	console.log("CREATING ADVANTAGE:", data);
	create_adv_disadv(data, true)
}

function create_disadvantage(data) {
	console.log("CREATING DISADVANTAGE:", data);
	create_adv_disadv(data, false)
}

function refresh_advantage_costs() {
	var current_clan = document.getElementById("clan_select").value;
	var current_class = document.getElementById("class_select").value;

	var adv_labels = document.querySelectorAll("#advantages_div > div > label");
	for (let lbl of adv_labels) {
		let discount_value = lbl.getElementsByClassName("discount")[0].innerHTML;
		let new_discount = calculate_discount(discount_value, current_clan,
		                                      current_class);
		let cost_p = lbl.getElementsByClassName("cost_p")[0];
		let base_cost = parseInt(cost_p.dataset.base_cost);
		cost_p.innerHTML = base_cost - new_discount;
	}

	var disadv_labels = document.querySelectorAll(
	                                        "#disadvantages_div > div > label");
	for (let lbl of disadv_labels) {
		let bonus_value = lbl.getElementsByClassName("discount")[0].innerHTML;
		let new_bonus = calculate_discount(bonus_value, current_clan,
		                                   current_class);
		let bonus_p = lbl.getElementsByClassName("cost_p")[0];
		let base_bonus = parseInt(bonus_p.dataset.base_cost);
		bonus_p.innerHTML = base_bonus + new_bonus;
	}
}

function calculate_discount(discount_string, clan_string, class_string) {
	var total_discount = 0;

	var discounts = discount_string.split(" ");
	for (let d of discounts) {
		let [type, value, amount] = d.split("_");

		console.log(amount);

		amount = (amount == undefined) ? 1 : parseInt(amount);

		console.log(type, value, amount);
		if (type == "clan") {
			if (value == clan_string) {
				console.log("CLAN DISCOUNT");
				total_discount += amount;
			}
		} else if (type == "class") {
			if (value == class_string) {
				console.log("CLASS DISCOUNT");
				total_discount += amount;
			}
		}
	}

	var return_value = parseInt(total_discount);
	if (isNaN(return_value)) {
		console.log(`ERROR: Invalid Discount - '${total_discount}'`);
		return 0
	}
	return total_discount;
}