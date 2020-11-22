// Creating the dropdown menu //////////////////////////////////////////////////

class dropdown_with_sublists {

	constructor(button_text, input_data, callback=null, caller=null) {
		console.log("CREATING NEW DROPDOWN");
		this.button_text = button_text;
		this.input_data = input_data;
		this.callback = callback;
		this.caller = caller;
		console.log("DROPDOWN CALLBACK:", this.callback);
		this.dropdown = this.create_dropdown_menu();
	}

	get_element() {
		return this.dropdown;
	}

	create_dropdown_menu() {
		var container = document.createElement("div");
		container.classList = "dropdown";

		var toggle_btn = document.createElement("input");
		toggle_btn.type = "button";
		toggle_btn.classList = "dropdown-toggle";
		toggle_btn.value = this.button_text;
		toggle_btn.onclick = function(event) {
			toggle_btn.classList.toggle("active");
			event.stopPropagation();
		}
		container.appendChild(toggle_btn);

		var main_list = this.create_sublist(this.input_data);
		container.appendChild(main_list);
		container.dataset.parent_obj = this;
		return container;
	}

	create_sublist(input_data) {
		var ulist = document.createElement("ul");
		ulist.classList = "dropdown-menu";
		for (let option in input_data) {
			let li = document.createElement("li");
			let p = document.createElement("p");
			if (typeof input_data[option] == "object") {
				// Element is a submenu
				li.classList = "dropdown-submenu";
				li.onclick = this.bind_submenu_onclick;
				p.classList = "submenu-option";
				var arrow_symbol = document.createElement("div");
				arrow_symbol.classList = "arrow-right";
				li.appendChild(arrow_symbol);
				var sublist = this.create_sublist(input_data[option]);
				li.appendChild(sublist);
			} else {
				// Element is not submenu
				p.classList = "menu-option";
				let callback_value = input_data[option];
				
				// Set the callback of clicking on an option
				var parent_dropdown = this;
				if (this.callback == null) {
					li.onclick = function(event) {
						event.stopPropagation();
						event.preventDefault();
						parent_dropdown.close_dropdown();
						console.log(callback_value);
					}
				} else {
					var callback = this.callback;
					var caller = this.caller;
					
					li.onclick = function(event) {
						event.stopPropagation();
						event.preventDefault();
						parent_dropdown.close_dropdown();
						callback.apply(caller, [callback_value]);
					};
				}
			}

			p.innerHTML = option;
			li.prepend(p);

			ulist.appendChild(li);
		}
		return ulist;
	}

	bind_submenu_onclick(event) {
		// Close other sublists in parentElement
		var sibling_sublists = this.parentElement.getElementsByClassName("dropdown-submenu");
		for (let sibling of sibling_sublists) {
			if (sibling !== this) {sibling.classList.remove("active");}
		}
		this.classList.toggle("active");
		event.stopPropagation();
		event.preventDefault();
	}

	default_option_onclick(event) {
		console.log(this.dataset.value);
		event.stopPropagation();
		event.preventDefault();
		this.close_dropdown();
	}

	set_option_onclick(f) {

	}

	close_dropdown() {
		var all_children = this.dropdown.getElementsByTagName("*");
		for (let child of all_children) {
			child.classList.remove("active");
		}
	}
// End Class
}

function create_dropdown(button_text, input_data, callback=null) {
	var dropdown = new dropdown_with_sublists(button_text, input_data, callback);
	return dropdown.get_element();
}

// function create_dropdown(button_text, input_data) {
// 	var container = document.createElement("div");
// 	container.classList = "dropdown";

// 	var toggle_btn = document.createElement("input");
// 	toggle_btn.type = "button";
// 	toggle_btn.classList = "dropdown-toggle";
// 	toggle_btn.value = button_text;
// 	toggle_btn.onclick = function(event) {
// 		toggle_btn.classList.toggle("active");
// 		event.stopPropagation();
// 	}
// 	container.appendChild(toggle_btn);

// 	var main_list = create_sublist(input_data);
// 	container.appendChild(main_list);
// 	return container;
// }

function create_sublist(input_data) {
	var ulist = document.createElement("ul");
	ulist.classList = "dropdown-menu";
	for (let option in input_data) {

		let li = document.createElement("li");
		let p = document.createElement("p");
		if (typeof input_data[option] == "object") {
			// Element is a submenu
			li.classList = "dropdown-submenu";
			li.onclick = bind_submenu_onclick;
			p.classList = "submenu-option";
			var arrow_symbol = document.createElement("div");
			arrow_symbol.classList = "arrow-right";
			li.appendChild(arrow_symbol)
			var sublist = create_sublist(input_data[option]);
			li.appendChild(sublist);
		} else {
			// Element is not a submenu
			p.classList = "menu-option";
			p.onclick = menu_option_onclick;
			p.dataset.value = input_data[option];
		}

		p.innerHTML = option;
		li.prepend(p);

		ulist.appendChild(li);
	}
	return ulist
}

function bind_submenu_onclick(event) {
  // Close other sublists in parentElement
  var sibling_sublists = this.parentElement.getElementsByClassName("dropdown-submenu");
  for (let sibling of sibling_sublists) {
    if (sibling !== this) {sibling.classList.remove("active");}
  }
  this.classList.toggle("active");
  event.stopPropagation();
  event.preventDefault();
}

function menu_option_onclick(event) {
	console.log(this.dataset.value);
	event.stopPropagation();
	event.preventDefault();
}

function set_dropdown_onclick() {

}

function close_dropdown(dropdown_div) {
	var all_children = dropdown_div.getElementsByTagName("*");
	for (let child of all_children) {
		child.classList.remove("active");
	}
}

// window.addEventListener('click', function(e){   
//   console.log("GLOBAL CLICK")
//   var dropdown_lists = document.getElementsByClassName("dropdown");
//   for (let dd of dropdown_lists) {
//   	close_dropdown(dd)
//   }
// });

// Test Data ///////////////////////////////////////////////////////////////////

var test_dropdown_data = {
	"Option 1": "val1",
	"Option 2": "val2",
	"Option 3": {
		"Option 3.1": "val3.1",
		"Option 3.2": "val3.2",
	},
	"Option 4": "val4",
	"Option 5": {
		"Option 5.1": "val5.1",
		"Option 5.2": {
			"Option 5.2.1": "val5.2.1",
			"Option 5.2.2": "val5.2.2",
			"Option 5.2.3": "val5.2.3"
		},
		"Option 5.3": "val5.3"
	},
	"Option 6": "val6",
}