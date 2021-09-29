class full_spell_list {
	constructor() {
		this.ranks_dict = {
			"Air": "1",
			"Earth": "1",
			"Fire": "1",
			"Water": "1",
			"Void": "1"
		};
		this.current = "Air";
		this.current_spell = "";
		this.tempval = "Starting val";

		this.onclick_func = function() {console.log("No function assigned.")}

		this.saved_spells = new Set();

		this.showing_saved = false;
		this.check_saved_spells();

		this.bind_functions_to_element();
		this.refresh_display();
	}

	check_saved_spells() {
		var saved_spells_text = localStorage["saved_spells"];
		if (saved_spells_text == null) {
			return;
		}
		this.saved_spells = new Set(JSON.parse(saved_spells_text));
		if (this.saved_spells.size > 0) {
			this.showing_saved = true;
		}
	}

	bind_functions_to_element() {
		var element_nav = document.getElementById("fsl_element_nav");
		for (let node of element_nav.querySelectorAll("a")) {
			var element = node.innerHTML;
			node.onclick = this.change_element.bind(this, element);
		}

		var rank_nav = document.getElementById("fsl_rank_nav");
		for (let node of rank_nav.querySelectorAll("a")) {
			var rank = node.dataset.rank;
			node.onclick = this.change_rank.bind(this, rank);
		}

		var saved_tab = document.getElementById("fsl_saved_tab");
		saved_tab.onclick = function() {
			this.showing_saved = true;
			this.refresh_display();
		}.bind(this);
	}

	refresh_display() {
		this.refresh_nav();
		this.load_spells();
	}

	refresh_nav() {
		var element_links = document.querySelectorAll("#fsl_element_nav>a");
		var rank_links = document.querySelectorAll("#fsl_rank_nav>a");
		var saved_tab = document.getElementById("fsl_saved_tab");

		if (this.showing_saved == false) {
			var element = this.current;
			var rank = this.ranks_dict[element];

			for (let node of element_links) {
				if (node.innerHTML == element) {
					node.classList.add("fsl_active");
				} else {
					node.classList.remove("fsl_active");
				}
			}

			for (let node of rank_links) {
				node.classList.remove("fsl_disabled");
				if (node.dataset.rank == rank) {
					node.classList.add("fsl_active");
				} else {
					node.classList.remove("fsl_active");
				}
			}

			saved_tab.classList.remove("fsl_active");

		} else {

			saved_tab.classList.add("fsl_active");

			for (let node of element_links) {
				node.classList.remove("fsl_active");
			}

			for (let node of rank_links) {
				node.classList.remove("fsl_active");
				node.classList.add("fsl_disabled");
			}
		}
	}

	load_spells() {
		var ulist = document.getElementById("fsl_spell_list");
		ulist.innerHTML = "";

		if (this.showing_saved) {
			var spell_list = []
			for (let spell_name of this.saved_spells) {
				spell_list.push(window.DH.data.spells[spell_name]);
			}
			spell_list.sort(this.spell_sort)

			for (let spell of spell_list) {
				let spell_div = this.make_spell_div(spell["title"], true, true);
				ulist.appendChild(spell_div);
			}

		} else {
			var element = this.current;
			console.log(this.ranks_dict);
			console.log(this.ranks_dict[element]);
			var rank = parseInt(this.ranks_dict[element]);
			var all_spells = window.DH.get_all_spells();
			var selected_spells = Object.keys(all_spells[element][rank]);
			selected_spells.sort()

			for (let spell_name of selected_spells) {
				let spell_div = this.make_spell_div(spell_name, false, false);
				ulist.appendChild(spell_div);
			}
		}
	}

	make_spell_div(spell_name, include_element=false,
	               showing_saved_spells=false) {
		var spell_div = document.createElement("div");

		var saved_spell = this.saved_spells.has(spell_name);

		var spell_text = document.createElement("label");
		spell_text.innerHTML = this.generate_spell_title(spell_name, true,
		                                                include_element);
		if (this.current_spell == spell_name) {
			spell_text.classList.add("bold");
		}
		spell_div.appendChild(spell_text);

		var div = document.createElement("img");
		div.classList.add("fsl_save_button");

		if (showing_saved_spells || saved_spell) {
			div.classList.add("saved");
			div.src = "images/cross.svg";
			div.onclick = this.unsave_spell.bind(this, spell_name);
		} else {
			div.classList.add("not_saved");
			div.src = "images/plus_icon.svg";
			div.height = 14;
			div.onclick = this.save_spell.bind(this, spell_name);
		}

		spell_div.appendChild(div);

		spell_div.style.display = "flex";

		spell_text.dataset.spell_name = spell_name;

		if (window.current_spell == spell_name) {
			spell_div.classList.add("current");
		}

		var self = this;

		spell_text.onclick = function() {
			self.current_spell = this.dataset.spell_name;
			self.onclick_func(event);
			self.load_spells()
		};
		
		spell_text.classList.add("clickable_spell_name");

		return spell_div;
	}

	save_spell(spell_name) {
		this.saved_spells.add(spell_name);
		this.update_saved_spells();
		this.refresh_display();
	}

	unsave_spell(spell_name) {
		this.saved_spells.delete(spell_name);
		this.update_saved_spells();
		this.refresh_display();
	}

	update_saved_spells() {
		localStorage["saved_spells"] = JSON.stringify([...this.saved_spells]);
	}

	generate_spell_title(spell_name, include_keywords=false,
                              include_element=false) {
		let spell_info = window.DH.data.spells[spell_name];
		let spell_text = `${spell_info["title"]}`;
		if (include_keywords) {
			if (spell_info["keywords"].length > 0) {
				spell_text += ` (${spell_info["keywords"].join(", ")})`;
			}
		}
		if (include_element) {
			spell_text += "<i>";
			spell_text += ` [${spell_info["element"]} ${spell_info["mastery_level"]}]`;
			spell_text += "</i>";
		}

		return spell_text;
	}

	change_element(element) {
		this.current = element;
		this.showing_saved = false;
		this.refresh_display();
	}

	change_rank(rank) {
		if (event.target.classList.contains("fsl_disabled")) {
			return;
		}
		console.log(event.target.classList);
		this.ranks_dict[this.current] = rank;
		this.showing_saved = false;
		this.refresh_display();
	}

	set_spell_onclick(func) {
		this.onclick_func = func;
		this.load_spells();
	}

	spell_sort(s1, s2) {
		if (s1["element"] < s2["element"]) {
			return -1;
		} else if (s1["element"] > s2["element"]) {
			return 1;
		} else {
			// Spells of same element
			if (s1["mastery_level"] < s2["mastery_level"]) {
				return -1;
			} else if (s1["mastery_level"] > s2["mastery_level"]) {
				return 1;
			} else {
				// Spells of same rank
				if (s1["title"] < s2["title"]) {
					return -1;
				} else {
					return 1;
				}
			}
		}
	}

}