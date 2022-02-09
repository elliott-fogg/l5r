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

		this.saved_spells = {};
		for (let spell_name of window.DH.data.universal_spells) {
			this.saved_spells[spell_name] = false;
		}

		this.showing_saved = false;
		this.check_saved_spells();

		this.bind_functions_to_element();
		this.refresh_display();
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

	// Save/Load Spells ////////////////////////////////////////////////////////

	check_saved_spells() {
		this.load_saved_spells();
		if (Object.keys(this.saved_spells).length > 0) {
			this.showing_saved = true;
		}
	}

	update_saved_spells() {
		localStorage["saved_spells"] = JSON.stringify(this.saved_spells);
		this.refresh_display();
	}

	load_saved_spells() {
		var saved_spells_text = localStorage["saved_spells"];
		if (saved_spells_text == null) {
			this.saved_spells = {};
		} else {
			this.saved_spells = JSON.parse(saved_spells_text);
		}
	}

	save_spell(spell_name) {
		this.saved_spells[spell_name] = false;
		this.update_saved_spells();
	}

	unsave_spell(spell_name) {
		delete this.saved_spells[spell_name];
		this.update_saved_spells();
	}

	memorise_spell(spell_name) {
		if (spell_name in this.saved_spells) {
			this.saved_spells[spell_name] = true;
		}
		this.saved_spells[spell_name] = true;
		this.update_saved_spells();
	}

	unmemorise_spell(spell_name) {
		if (spell_name in this.saved_spells) {
			this.saved_spells[spell_name] = false;
		}
		this.update_saved_spells();
	}

	// Refresh Display /////////////////////////////////////////////////////////

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
			document.getElementById("fsl_spell_list").classList.remove("saved");

		} else {

			saved_tab.classList.add("fsl_active");

			for (let node of element_links) {
				node.classList.remove("fsl_active");
			}

			for (let node of rank_links) {
				node.classList.remove("fsl_active");
				node.classList.add("fsl_disabled");
			}

			document.getElementById("fsl_spell_list").classList.add("saved");
		}
	}

	load_spells() {
		var ulist = document.getElementById("fsl_spell_list");
		ulist.innerHTML = "";

		if (this.showing_saved) {
			var spell_list = []
			for (let spell_name in this.saved_spells) {
				spell_list.push(window.DH.data.spells[spell_name]);
			}
			spell_list.sort(this.spell_sort)

			for (let spell of spell_list) {
				let spell_div = this.make_spell_div(spell, true, true);
				ulist.appendChild(spell_div);
			}

		} else {
			var element = this.current;
			var rank = parseInt(this.ranks_dict[element]);
			var all_spells = window.DH.get_all_spells();
			var selected_spells = Object.keys(all_spells[element][rank]);
			selected_spells.sort()

			for (let spell_name of selected_spells) {
				var spell_obj = window.DH.data.spells[spell_name];

				let spell_div = this.make_spell_div(spell_obj, false, false);
				ulist.appendChild(spell_div);
			}
		}
	}

	make_spell_div(spell_obj, showing_saved_spells=false) {
		var spell_div = document.createElement("div");
		var spell_name = spell_obj["title"];
		var saved_spell = (spell_name in this.saved_spells);
		var universal = spell_obj["universal"];

		// var include_element = (showing_saved_spells && !universal)
		var include_element = false;

		var spell_text = document.createElement("label");

		spell_text.innerHTML = this.generate_spell_title(spell_obj, true,
		                                                include_element);
		if (this.current_spell == spell_name) {
			spell_text.classList.add("bold");
		}
		spell_div.appendChild(spell_text);

		if (!universal) {
			// If not Universal, add option to Save/Remove
			var save_div = document.createElement("img");
			save_div.classList.add("fsl_save_button");
			if (showing_saved_spells || saved_spell) {
				save_div.classList.add("saved");
				save_div.src = "images/cross.svg";
				save_div.onclick = this.unsave_spell.bind(this, spell_name);
				save_div.title = "Unsave Spell";
			} else {
				save_div.classList.add("not_saved");
				save_div.src = "images/plus_icon.svg";
				save_div.height = 14;
				save_div.onclick = this.save_spell.bind(this, spell_name);
				save_div.title = "Save Spell";
			}
			spell_div.appendChild(save_div);
		}

		if (showing_saved_spells) {
			// If showing Saved Spells, add option to (un)memorise
			var mem_div = document.createElement("img");
			mem_div.classList.add("fsl_mem_button");
			if (this.saved_spells[spell_name] == true) {
				mem_div.classList.add("mem");
				mem_div.src = "images/ribbon_filled.svg";
				mem_div.height = 14;
				mem_div.onclick = this.unmemorise_spell.bind(this, spell_name);
				mem_div.title = "Unmemorise";
			} else {
				mem_div.classList.add("not_mem");
				mem_div.src = "images/ribbon.svg";
				mem_div.height = 14;
				mem_div.onclick = this.memorise_spell.bind(this, spell_name);
				mem_div.title = "Memorise";
			}
			spell_div.insertBefore(mem_div, spell_text);
		}

		spell_div.style.display = "flex";
		spell_text.dataset.spell_name = spell_name;

		// if (window.current_spell == spell_name) {
		// 	spell_div.classList.add("current");
		// }

		spell_text.onclick = function() {
			this.current_spell = spell_name;
			this.onclick_func(event);
			this.load_spells()
		}.bind(this);
		
		spell_text.classList.add("clickable_spell_name");

		return spell_div;
	}

	generate_spell_title(spell_object, include_keywords=false,
	                     include_element=false) {
		let spell_text = `${spell_object["title"]}`;

		if (include_keywords) {
			if (spell_object["keywords"].length > 0) {
				spell_text += ` (${spell_object["keywords"].join(", ")})`;
			}
		}

		if (include_element) {
			spell_text += ` <i>[${spell_object["element"]} ${spell_object["mastery_level"]}]</i>`;
		}

		return spell_text;
	}

	// Nav / Additional Functions //////////////////////////////////////////////

	change_element(element) {
		this.current = element;
		this.showing_saved = false;
		this.refresh_display();
	}

	change_rank(rank) {
		if (event.target.classList.contains("fsl_disabled")) {
			return;
		}
		this.ranks_dict[this.current] = rank;
		this.showing_saved = false;
		this.refresh_display();
	}

	set_spell_onclick(func) {
		this.onclick_func = func;
		this.load_spells();
	}

	spell_sort(s1, s2) {
		// Universal Spells First
		if (s1["universal"] && !s2["universal"]) {
			return -1;
		} else if(!s1["universal"] && s2["universal"]) {
			return 1;
		}

		if (s1["universal"] > s2["universal"]) {
			return -1;
		} else if (s1["universal"] < s2["universal"]) {
			return 1;
		}

		// Sort by order Air, Earth, Fire, Water, Void
		if (s1["element"] < s2["element"]) {
			return -1;
		} else if (s1["element"] > s2["element"]) {
			return 1;
		}

		// Sort by Mastery Level
		if (s1["mastery_level"] < s2["master_level"]) {
			return -1;
		} else if (s1["mastery_level"] > s2["mastery_level"]) {
			return 1;
		}

		// Sort by Title alphabetically
		if (s1["title"] < s2["title"]) {
			return -1;
		} else {
			return 1;
		}
	}

// Class End
}