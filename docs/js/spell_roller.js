var sample_spell = {
        "title": "Arrow's Flight",
        "element": "Air",
        "mastery_level": "1",
        "keywords": [
            "Battle"
        ],
        "range": "Touch",
        "aoe": "1 arrow",
        "duration": "3 Rounds",
        "raises": [
            "Duration (+1 Round per Raise)",
            "Special (one additional arrow per Raise)"
        ],
        "special": "SOME SPECIAL TEXT",
        "description": "A prayer used by shugenja to aid bushi when an arrow absolutely must hit its target. The shugenja entreats the Air kami to play a game by guiding the arrow, and if the arrow is fired within the duration of the spell, it will unerringly strike its target. (It must still be fired by someone with a minimal understanding of archery - at least one Rank of Kyujutsu.) However, because it is the kami who ultimately ensure the arrow will hit, the shot cannot benefit from the effects of Raises or Techniques."
    }

window.saved_spells = [];

// Spell Information ///////////////////////////////////////////////////////////

function load_sample_spell() {
	load_spell(sample_spell["title"], sample_spell["keywords"], 
	           sample_spell["element"], sample_spell["mastery_level"],
	           sample_spell["description"], sample_spell["range"],
	           sample_spell["aoe"], sample_spell["duration"],
	           sample_spell["special"], sample_spell["raises"])
}

function load_spell(title, keywords, element, level, description, range, aoe,
                    duration, special, raises) {
	window.current_spell = title;
	document.getElementById("current_spell-name").innerHTML = 
										construct_spell_title(title, keywords);
	document.getElementById("current_spell-element_level").innerHTML = 
										construct_element_level(element, level);
	document.getElementById("current_spell-description").innerHTML = 
		construct_spell_description(description, range, aoe, duration, special);
	document.getElementById("current_spell-raises").innerHTML = "";

	document.getElementById("current_spell-raises").appendChild(
		construct_spell_raises(raises, level));

	load_all_spell_names();
	refresh_saved_spells();
	refresh_spell_search_results();
}

function load_spell_by_name(spell_name) {
	var s = window.DH.data.spells[spell_name]
	load_spell(s["title"], s["keywords"], s["element"], s["mastery_level"],
	           s["description"], s["range"], s["aoe"], s["duration"],
	           s["special"], s["raises"]);
}

function construct_spell_title(title, keywords=null) {
	var output = title;
	if (keywords.length > 0) {
		let kw_text = ` (<i>${keywords.join(", ")}</i>)`;
		output += kw_text;
	}
	return output;
}

function construct_element_level(element, level) {
	return `${element} ${level}`
}

function construct_spell_description(description, range, aoe, duration,
                                     special) {
	output_text = `<b>Range:</b> ${range}<br>`;
	output_text += `<b>Area of Effect:</b> ${aoe}<br>`;
	output_text += `<b>Duration (default):</b> ${duration}<br>`;

	if (special) {
		output_text += `<b>Special:</b> ${special}<br>`;
	}

	output_text += description;

	return output_text;
}

function construct_spell_raises(raises, level) {
	var main_div = document.createElement("div");

	var raises_text = document.createElement("p");
	raises_text.innerHTML = "Total Raises: <span id='total_raises'>0</span>";
	main_div.appendChild(raises_text);
	
	var time_div = document.createElement("div");
	var time_label = document.createElement("label");
	time_label.innerHTML = `Turns to cast: ${level} `;
	var time_raise_button = document.createElement("input");
	time_raise_button.type = "button";
	time_raise_button.value = "Reduce (+1 Raise)";
	time_div.appendChild(time_label);
	time_div.appendChild(time_raise_button);
	main_div.appendChild(time_div);

	return main_div;
}

// Spell Selectors /////////////////////////////////////////////////////////////

function load_all_spell_names() {
	console.log("Loading all spells");
    var spells = {
        "Air": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Earth": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Fire": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Water": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Void": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]}
    };

    for (let spell_name in window.DH.data.spells) {
        let spell_info = window.DH.data.spells[spell_name];
        spells[spell_info.element][spell_info.mastery_level].push(spell_name);
    }

    // Sort spells within each element
    for (let element in spells) {

    	for (let level in spells[element]) {
    		console.log(element, level);
    		console.log(document.getElementById(`Air-1-spells-content`));
    		var content_div = document.getElementById(`${element}-${level}-spells-content`);
    		content_div.innerHTML = "";

    		for (let spell_name of spells[element][level]) {
    			content_div.appendChild(make_spell_div(spell_name, false, false));
    		}
    	}
    }
}

function refresh_saved_spells() {
	var saved_spells_div = document.getElementById("saved_spells_div");
	saved_spells_div.innerHTML = "";

	document.getElementById("saved_spells_details").open = true;

	console.log(window.saved_spells);

	for (let spell_name of window.saved_spells) {
		saved_spells_div.appendChild(make_spell_div(spell_name, true, true));
	}
}

function refresh_spell_search_results() {
	var search_term_raw = document.getElementById("spell_search_box").value;
	var search_term = search_term_raw.replace(/[\.'"\(\)’]/g, "").toLowerCase();

	var spell_names = window.DH.get_searchable_spell_names();

	var spell_search_results = document.getElementById("spell_search_results");
	spell_search_results.innerHTML = "";

	if (search_term.length == 0) {
		// TODO: Replace this with a CSS tag
		document.getElementById("all_spells").style.display = "block";
		return;
	}
	document.getElementById("all_spells").style.display = "none";

	var matching_spells = [];
	for (let search_name in spell_names) {
		if (search_name.includes(search_term)) {
			matching_spells.push(window.DH.data.spells[spell_names[search_name]]);
		}
		matching_spells.sort(spell_sort);
	}

	if (matching_spells.length == 0) {
		spell_search_results.innerHTML = "No matching spells found.";
		spell_search_results.classList.add("note");
		return;
	}
	spell_search_results.classList.remove("note");

	for (let spell of matching_spells) {
		spell_search_results.appendChild(make_spell_div(spell["title"], true,
		                                                false))
	}
}

function make_spell_div(spell_name, include_element=false, saved_spell=false) {
	var spell_div = document.createElement("li");
	spell_div.innerHTML = generate_spell_title(spell_name, true,
	                                           include_element);
	spell_div.dataset.spell_name = spell_name;

	if (window.current_spell == spell_name) {
		spell_div.classList.add("current");
	}

	spell_div.onclick = load_spell_by_name.bind(this, spell_name);
	if (saved_spell) {
		spell_div.oncontextmenu = remove_saved_spell;
	} else {
		spell_div.oncontextmenu = save_spell;
	}

	spell_div.classList.add("clickable_spell_name");

	return spell_div;
}

function all_spells_change_page(event) {

	var all_spells_tabs = document.querySelectorAll(".all_spells_tab");
	for (let tab of all_spells_tabs) {
		tab.classList.remove("active");
	}

	event.target.classList.add("active");
	var selected_page = event.target.innerHTML;

	console.log("Selected All Spells page", selected_page);

	for (let page_name of ["Air", "Earth", "Fire", "Water", "Void"]) {
		let elem = document.getElementById(`${page_name}-spells-content`);
		elem.classList.remove("active");
	}
	var select_elem = document.getElementById(`${selected_page}-spells-content`);
	select_elem.classList.add("active");
}

function update_spell_roller() {
	// Get Spell details
	// Get current Ring levels
	// Get affinity and deficiency
	// Get raises
	// Calculate roll
	// Upload to Dice Roller

	// Have a "reset roll" button - disabled unless roll has been modified
	// Have a "reset raises" button - removes added raises, and resets roll
}

function save_spell(event) {
	event.preventDefault();
	let spell_name = this.dataset.spell_name;
	console.log(`Spell Saved: ${spell_name}`);

	if (!(window.saved_spells.includes(spell_name))) {
		window.saved_spells.push(spell_name);
		refresh_saved_spells();
	}

	update_spells_localStorage();
}

function remove_saved_spell(event) {
	event.preventDefault();
	let spell_name = this.dataset.spell_name;
	console.log(`Removed Saved Spell: ${spell_name}`);
	window.saved_spells = window.saved_spells.filter(spell => spell != spell_name);
	refresh_saved_spells();
	update_spells_localStorage();
}

function update_spells_localStorage() {
	localStorage["saved_spells"] = JSON.stringify(window.saved_spells)
}

function load_spells_localStorage() {
	if (localStorage["saved_spells"]) {
		return JSON.parse(localStorage["saved_spells"]);
	} else {
		return [];
	}
}

function spell_sort(s1, s2) {
	if (s1["element"] < s2["element"]) {
		return 0;
	} else if (s1["element"] > s2["element"]) {
		return 1;
	} else {
		// Spells of same element
		if (s1["mastery_level"] < s2["mastery_level"]) {
			return 0;
		} else if (s1["mastery_level"] > s2["mastery_level"]) {
			return 1;
		} else {
			// Spells of same rank
			if (s1["title"] < s2["title"]) {
				return 0;
			} else {
				return 1;
			}
		}
	}
}

function generate_spell_title(spell_name, include_keywords=false,
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

function spell_roller_main() {
	console.log("Executing Spell Roller Main function");
	load_all_spell_names();
	window.saved_spells = load_spells_localStorage();
	refresh_saved_spells();
}