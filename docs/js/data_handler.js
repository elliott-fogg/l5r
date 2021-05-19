class DataLoader {
	constructor(delay_ms=0, test_fail=false) {
		this.paths = {
			"skills": "/json/skills.json",
			"schools": "/json/base_schools.json",
			"families": "/json/base_families.json",
			"advantages": "/json/advantages.json",
			"disadvantages": "/json/disadvantages.json",
			"spells": "/json/spells.json",
			"universal_spells": "/json/universal_spells.json",
			"kata": "/json/kata.json"
		}
		
		this.times = {}
		this.data = {}

		this.loaded = false;
		this.callbacks = [this.check_for_html_templates.bind(this)];
		this.start_time = performance.now();
		console.log(`window.location: '${window.location}'`);
		console.log(`window.location.hostname: '${window.location.hostname}'`);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";
		this.get_all_data(delay_ms, test_fail);
	}

	execute_on_load(func) {
		if (this.loaded) {
			func();
		} else {
			this.callbacks.push(func);
		}
	}

	complete_function() {
		console.groupCollapsed("Loading Data Complete!");

		for (let data_name in this.data) {
			console.log(`${data_name.toUpperCase()}:`, this.data[data_name]);
		}

		console.groupEnd();

		this.loaded = true;

		if (this.callbacks.length > 0) {
			console.log("Executing Callbacks!");
			for (let callback of this.callbacks) {
				console.group("Callback");
				console.group("Callback function");
				console.log(callback);
				console.groupEnd();

				callback();

				console.groupEnd();
			}
		}
	}

	check_for_data(max_s=10, i=0) {
		if (this.loaded || i > 10) {
			this.calculate_time_taken();
			console.log(this.data);
			return;
		} else {
			console.log("Pinging for loading data...");
			i += 1;
			setTimeout(function(){this.check_for_data(max_s, i)}.bind(this), 1000);
		}
	}

	async delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(function(){resolve()}, ms);
		})
	}

	calculate_time_taken() {
		for (let dn in this.data) {
			let t = this.data[dn]["end_time"] - this.data[dn]["start_time"];
			console.log(`${dn}, ${Math.round(t)}ms`);
		}
	}

	async get_all_data(delay_ms=0, test_fail=false) {
		var start = performance.now();
		var myPromises = [];

		console.groupCollapsed("Checking for Data...");

		for (let data_name in this.paths) {
			let url = this.hostname + this.paths[data_name];
			myPromises.push(this.get_load_data_promise(url, data_name));
		}

		console.groupEnd();

		// Optionally add fail cases for testing.
		if (test_fail) {
			myPromises.push(this.get_load_data_promise(
			                	"/json/second_dud_file.json", "dud_file"));
		}

		// Optionally add a Promise that will take time to complete, to 
		// test if the other Promises complete asynchronously.
		if (delay_ms > 0) {
			myPromises.push(this.delay(delay_ms))
		}

		await Promise.all(myPromises)
		.then(x => {
			for (let y of x) {
				if (y) {
					if (y[1] == false) {
						alert(`WARNING: Failed to load data for '${y[0]}'.`);
					}
				}
			}
		})
		.catch(function(err) {
			console.log("Hello", err);
		});

		this.complete_function();
	}

	async get_load_data_promise(url, data_name) {
		return new Promise((resolve) => {
			this.load_data(resolve, url, data_name);
		});
	}

	async load_data(resolve, url, data_name) {
		console.log(`Received request for ${data_name}:\n${url}`);
		this.times["start"] = performance.now();
		var json_data = await this.get_data(url);
		this.data[data_name] = json_data;
		this.times["end"] = performance.now();

		if (json_data) {
			resolve([data_name, true]);
		} else {
			resolve([data_name, false]);
		}
	}

	async get_data(url) {
		return fetch(url).then(function(response) {
			if (response.status !== 200) {
				console.log(`Fetch request for url '${url}' failed. ` + 
				            `Status Code: ${response.status}.`);
				return;
			}
			return response.json();
		})
		.catch(function(err) {
			console.log("Error with url " + url + "\nFetch Error :-S", err);
		});
	}

	// Load HTML Templates /////////////////////////////////////////////////////

	check_for_html_templates() {
		var elements_to_replace = document.querySelectorAll('[include-html]');
		for (let i=0; i < elements_to_replace.length; i++) {
			console.log(this);
			var element = elements_to_replace[i];
			var file_name = element.getAttribute("include-html");
			element.removeAttribute("include-html");
			this.load_html_template_from_website(element, file_name);
		}
	}

	load_html_template_from_website(element, file_name) {
		fetch("https://elliott-fogg.github.io/l5r/html/" + file_name)
		.then(response => {
	    	console.log(response.url, response.status);
	    	if (response.status == 200) {
	    		return response.text();
	    	} else {
	    		this.element_failed_load(element, file_name);
	    		return null;
	    	}
		}).then(html => {
			if (html) {
				element.innerHTML = html;
				this.check_for_html_templates();
			}
	    }).catch(err => {
	    	console.warn("Could not load HTML template.", err);
	    	this.element_failed_load(element, file_name);
		});
	}

	element_failed_load(element, message=null) {
		element.innerHTML = "Failed to load element";
		if (message) {
			element.innerHTML += ` - ${message}`;
		}
	}

// End Class
}

class DataHandler extends DataLoader {

	// Spells //////////////////////////////////////////////////////////////////
	group_spells(spell_list) {
		var all_elements = ["Air", "Earth", "Fire", "Water", "Void", "Other"];
		var spells = {};
		for (let e of all_elements) {
			spells[e] = {};
			for (let i=1; i<=6; i++) {
				spells[e][i] = {};
			}
		}

		for (let spell_name of spell_list) {
			var spell = this.data.spells[spell_name];
			var element = spell.element;
			if (!(element in spells)) {
				element = "Other"
			}
			spells[element][spell.mastery_level][spell_name] = spell_name;
		}

		// Delete empty options
		for (let e in spells) {
			for (let r in spells[e]) {
				if (Object.keys(spells[e][r]).length == 0) {
					delete spells[e][r];
				}
			}
			if (Object.keys(spells[e]).length == 0) {
				delete spells[e];
			}
		}

		return spells;
	}

	// Clan functions //////////////////////////////////////////////////////////
	get_clans() {
		var all_clans = new Set();
		for (let school in this.data.schools) {
			all_clans.add(this.data.schools[school].clan);
		}
		for (let family in this.data.families) {
			all_clans.add(this.data.families[family].clan);
		}
		return Array(all_clans);
	}

	get_clan_families(chosen_clan=null) {
		var families = this.data.families;

		if (chosen_clan) {
			var clan_families = [];
			for (let family in families) {
				if (families[family].clan == chosen_clan) {
					clan_families.push(family);
				}
			}

			if (clan_families.length == 0) {
				console.warn(`Clan '${chosen_clan}' has no families.`);
			} else {
				return clan_families;
			}
		} else {
			var family_dict = {};
			for (let family in families) {
				let family_clan = families[family].clan;
				if (family_clan in family_dict) {
					family_dict[family_clan].push(family);
				} else {
					family_dict[family_clan] = [family];
				}
			}
			return family_dict;
		}
	}

	get_clan_schools(chosen_clan=null) {
		var schools = this.data.schools;

		if (chosen_clan) {
			var clan_schools = [];
			for (let school in schools) {
				if (school.clan == chosen_clan) {
					clan_schools.push(school);
				}
			}

			if (clan_schools.length == 0) {
				console.warn(`Clan '${chosen_clan}' has no schools.`);
			} else {
				return clan_schools;
			}

		} else {
			var school_dict = {};
			for (let school in schools) {
				let clan = schools[school].clan;
				if (clan in school_dict) {
					school_dict[clan].push(school);
				} else {
					school_dict[clan] = [school];
				}
			}
			return school_dict;
		}
	}

	// Family functions ////////////////////////////////////////////////////////
	get_family_clan(family) {
		return this.data.families[family].clan;
	}

	get_family_trait(family) {
		return this.data.families[family].attribute;
	}

	// School functions ////////////////////////////////////////////////////////
	get_school_info(school, key=null) {
		console.log(school);
		if (key) {
			if (key in this.data.schools[school]) {
				if (key == "skills") {
					return this._get_school_skills(school);
				} else {
					return this.data.schools[school][key]
				}
			} else {
				console.error("School Key not recognised - ", key);
				return;
			}
		} else {
			var school_info = {};
			Object.assign(school_info, this.data.schools[school]);
			school_info.skills = this._get_school_skills(school);
			return school_info;
		}
	}

	_get_school_skills(school) {
		var starting_skills = {};
		for (let skill_string of this.data.schools[school].skills) {
			var extracted_info = this.extract_skill_info(skill_string);
			starting_skills[extracted_info.name] = extracted_info;
		}
		return starting_skills;
	}

	get_spell_choices_table(school) {
		var spell_choices = this.data.schools[school].spells;
		var spell_limits = {
			"Air": 0,
			"Earth": 0,
			"Fire": 0,
			"Water": 0,
			"Void": 0
		};

        var re = /(\d) (\w+)/;
        for (let choice of spell_choices) {
            let matches = choice.match(re);
            if (matches) {
                let element = matches[2];
                let number = matches[1]
                spell_limits[element] = number;
            }
        }
        return spell_limits
	}

	get_school_clan(school) {
		return this.data.schools[school].clan;
	}

	// Skill functions /////////////////////////////////////////////////////////
	get_skill_list(class_list=[]) {
		var SKILLS = this.data.skills;
		if (typeof class_list != "object") {
			class_list = [class_list];
		}

		var skill_list = [];
		for (let skill_name in SKILLS) {
			if (class_list.length == 0) {
				skill_list.push(skill_name);
				continue;
			}

			// A class/macro is specified
			let skill = SKILLS[skill_name];
			for (let type of class_list) {
				if (skill["class"] == null) {
					console.log("MISSING CLASS:", skill_name, skill);
				}
				if (skill["macro"].includes(type) ||
				    skill["class"].includes(type)) {
					skill_list.push(skill_name);
					break;
				}
			}
		}
		return skill_list;
	}

	is_skill(skill_name) {
		return (skill_name in this.data.skills);
	}

	get_skill_info(skill_name) {
		if (skill_name in this.data.skills) {
			var output = {};
			Object.assign(output, this.data.skills[skill_name]);
			return output;
		} else {
			console.log(`ERROR - get_skill_info: ${skill_name} not found.`)
		}
	}

	get_new_skill(skill_name) {
		return {
		    "rank": 1,
		    "trait": Object.assign([], this.data.skills[skill_name]["trait"]),
		    "class": Object.assign([], this.data.skills[skill_name]["class"]),
		    "emphases": []
		}
	}

	create_skill_sublists(skill_list) {
		var skill_dict = {};
		for (let skill_name of skill_list) {
			let skill_macro = this.data.skills[skill_name]["macro"][0];

			if (skill_macro) {
				if (!(skill_macro in skill_dict)) {
					skill_dict[skill_macro] = {};
				}
				skill_dict[skill_macro][skill_name] = skill_name;
			} else {
				// Skill has no macro
				skill_dict[skill_name] = skill_name;
			}
		}

		var sorted_skill_dict = {};
		for (let k of Object.keys(skill_dict).sort()) {
			sorted_skill_dict[k] = skill_dict[k];
		}

		return sorted_skill_dict;
	}

	extract_skill_info(skill_string) {
		console.groupCollapsed(`Extracting Skill Info - ${skill_string}`);
		const regex = /^([a-zA-Z-_:\s]+)(?:\(([\w\s,-_]+)\))?( \d+)?$/;
		var [full, name, emphases, rank] = skill_string.match(regex);
		console.log("FULL:", full, "NAME:", name, "EMPHASES:", emphases, "RANK:", rank);

		// Clean Name
		name = name.trim();

		// Clean Emphases
		var stripped_emphases = [];
		if (emphases) {
			emphases = emphases.split(",");
			for (let em of emphases) {
				stripped_emphases.push(em.trim());
			}
		}

		// Clean Rank
		if (rank) {
			rank = parseInt(rank.trim());
		} else {
			rank = 1;
		}

		// Get remaining info
		var skill_info = this.get_skill_info(name);

		console.log(skill_info);

		var output = {
				"name": name,
				"rank": rank,
				"emphases": stripped_emphases,
				"class": skill_info["class"],
				"trait": skill_info["trait"]
		}

		console.groupEnd();
		return output;
	}

	// Kata ////////////////////////////////////////////////////////////////////

	check_kata_restrictions(kata_name, school, traits) {
		kata_info = this.data.kata[kata_name];

		// Check if schools are a limited list
		if (Array.isArray(kata_info.schools)) {
			if (!(kata_info.schools.includes(school))) {
				return false;
			}

		} else if (kata_info.schools.length > 0) {
			let required_clan = kata_info.schools.split("_")[1];
			let clan = this.get_school_info(school, "clan");
			if (clan != required_clan) {
				return false;
			}
		}

		// If we've got to this point, the school is valid for this kata
		if (kata_info["discount"]) {
			if (kata_info.discount.includes(school)) {
				return this.check_kata_traits(kata_info.mastery, traits, true);
			}
		}
		return this.check_kata_traits(kata_info.mastery, traits, false);
	}

	check_traits(trait_string, traits, discounted) {
		// Check the traits to see if they meet the kata requirements. WIP
		return true // placeholder for now;

	}

	// General Functions ///////////////////////////////////////////////////////

	get_list(list_type) {
		var [primary, subset] = list_type.split("_");

		var item_list;

		switch (primary) {
			case "skills":
				switch(subset) {
					case "school":
						console.log("Attempting to load School Skills");
						// Load school skills here
						break;
					case undefined:
						item_list = this.create_skill_sublists(
						                                this.get_skill_list());
						break;
					case "lore":
						item_list = this.create_skill_sublists(this.get_skill_list("Lore"));
						break;
					default:
						item_list = this.get_skill_list();
						break;
				}
				break;
			default:
				console.log(`Unknown Skill Type '${primary}' with subset '${subset}'.`);
				break;
		}

		if (item_list != null) {
			console.log("ITEMS", list_type, item_list);
			return item_list;
		}

		return {
			"Acting": "Acting",
			"Calligraphy": "Calligraphy",
			"Courtier": "Courtier",
			"Lore": {
				"Lore: Architecture": "Lore: Architecture",
				"Lore: Bushido": "Lore: Bushido",
				"Lore: Elements": "Lore: Elements"
			},
			"Commerce": "Commerce",
			"Perform": {
				"Perform: Biwa": "Perform: Biwa"
			}
		}
	}

// End Class
}

class CustomData {
	// This might be a good way to store all the User-Added classes and such in 
	// one place, so it can be easily both exported to file, and included in 
	// the DataHandler. Just an idea for now.
	constructor() {
		// Skills, Emphases, etc.
		// Families
		// Schools
		// Spells?
		// Weapons
		// Techniques?
		// Advantages?
	}

    // async add_custom_spell() {
    //     console.groupCollapsed("Adding Custom Spell");

    //     var modal = new ModalWindow();
    //     modal.add_title("Custom Spell");
    //     modal.add_text_input("name", "Name", "Spell Name");
    //     modal.add_wordlist_input("keywords", "Keywords", "Keyword...", true);
    //     // modal.add_text_input("keywords", "Keywords", "(Space separated)", null,
    //     //                     false, true);
    //     modal.add_int_input("mastery_level", "Mastery Level", 6, 1);
    //     modal.add_multicheckbox_input("elements", "Elements",
    //                                 ["Air", "Earth", "Fire", "Water", "Void"]);
    //     modal.add_text_input("range", "Range", "e.g. Personal, 5', etc.");
    //     modal.add_text_input("aoe", "Area of Effect", "30', 10 radius, etc.");
    //     modal.add_text_input("duration", "Duration", "3 rounds, 1 hour, etc.");
    //     modal.add_text_input("info", "Description", "Spell Description...",
    //                          null, true);

    //     var input_data = await modal.get_user_input();

    //     if (input_data == null) {
    //         return;
    //     }

    //     console.log("CUSTOM SPELL", input_data);

    //     this.add_spell({
    //         "title": input_data["name"],
    //         "element": input_data["elements"],
    //         "mastery_level": input_data["mastery_level"],
    //         "keywords": input_data["keywords"],
    //         "range": input_data["range"],
    //         "aoe": input_data["aoe"],
    //         "duration": input_data["duration"],
    //         "raises": input_data["raises"],
    //         "special": input_data["special"],
    //         "description": input_data["description"]
    //     })

    // }

    // next_spell_id() {
    //     let spell_id = `spell_${this.spells.count}`;
    //     this.spells.count += 1;
    //     return spell_id;
    // }
	
}

class DataTester extends DataHandler {

	constructor() {
		super();

		this.document_ready = false;
		this.data_loaded = false;

		this.callbacks.push(function() {
			this.data_loaded = true;
			this.create_test_buttons_if_ready();
		}.bind(this));

		this.templates = [];
		this.debounce_ask = false;

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

	create_test_buttons_if_ready() {
		console.log(this.document_ready, this.data_loaded);
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

	// Overwrite method to give me the option of uploading a local file, using
	// an online one, or just skipping the template.
	check_for_html_templates() {
		var elements_to_replace = document.querySelectorAll('[include-html]');
		console.log("ADDING NODES", elements_to_replace);

		for (let element of elements_to_replace) {
			let file_name = element.getAttribute("include-html");
			this.templates.push( [element, file_name] );
			element.removeAttribute("include-html");
		}
		this.debounce_ask_html_templates();
	}

	debounce_ask_html_templates() {
		var t = `${this.debounce_ask}`;
		console.log("DEBOUNCING", t);
		if (this.debounce_ask == false) {
			console.log("DEBOUNCE SUCCESS");
			this.ask_html_templates();
		}
	}

	async ask_html_templates() {
		this.debounce_ask = true;
		console.log("STARTING ASK");

		if (this.templates.length == 0) {
			console.log("ASK OVER");
			this.debounce_ask = false;
			return;
		}

		var [element, file_name] = this.templates.shift();

		console.log(element);

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
				this.load_local_template(element, input_data["local_file"]);
			} else {
				this.load_html_template_from_website(element, file_name);
			}
		} else {
			this.element_failed_load(element, `${file_name} (ignored)`);
		}

		this.ask_html_templates();
	}

	load_local_template(element, local_file) {
		// console.log(local_file)
		var fr = new FileReader();
		fr.addEventListener("load", e => {
			element.innerHTML = fr.result;
		});
		fr.readAsText(local_file);
		element.removeAttribute("include-html");
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

// Load DataHandler as a Window Variable
window.DH = new DataTester();