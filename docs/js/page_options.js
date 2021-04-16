class PageOptions {

	constructor() {
		this.values = {
			"autosave": true,
			"darkmode": false
		}

		if (localStorage["page_options"]) {
			this.load();
		}
	}

	check(key) {
		return this.values[key];
	}

	async modify() {
		console.log("MODIFYING");
		var modal = new ModalWindow();
		modal.add_title("Page Options");

		// Need to make this part more modular, so that I don't have to manually
		// Write out the conditions for each option, as some might not just be
		// checkboxes.
		modal.add_checkbox_input("autosave", "Autosave", this.values["autosave"]);
		modal.add_checkbox_input("darkmode", "Dark Mode", this.values["darkmode"]);

		var new_values = await modal.get_user_input();

		if (new_values) {
			for (let key in new_values) {
				this.values[key] = new_values[key];
			}
			console.log("Options set", this.values);
		}

		this.save();
		this.evaluate_options();
	}

	evaluate_options() {
		this.check_darkmode();
	}

	// Options Functions ///////////////////////////////////////////////////////

	check_darkmode() {
		var node = document.getElementById("darkmode");
		if (this.check("darkmode")) {
			node.rel = "stylesheet";
		} else {
			node.rel = "stylesheet alternate";
		}
	}

	// Save and Load ///////////////////////////////////////////////////////////

	save() {
		localStorage["page_options"] = JSON.stringify(this.values);
	}

	load() {
		var data = JSON.parse(localStorage["page_options"]);
		for (let key in this.values) {
			if (key in data) {
				this.values[key] = data[key];
			}
		}
	}

	////////////////////////////////////////////////////////////////////////////
}

// function darkmode() {
//     console.log("DARKMODE ENGAGE");
//     var node = document.getElementById("darkmode");
//     if (node.rel == "stylesheet") {
//         node.rel = "stylesheet alternate";
//     } else {
//         node.rel = "stylesheet";
//     }
// }

////////////////////////////////////////////////////////////////////////////////

window.options = new PageOptions();