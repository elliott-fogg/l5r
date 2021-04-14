class DataLoader {
	constructor(callback=null, delay_ms=0, test_fail=false) {
		this.paths = {
			"skills": "/json/skills.json",
			"schools": "/json/schools_reduced.json",
			"families": "/json/families.json",
			"advantages": "/json/advantages.json",
			"disadvantages": "/json/disadvantages.json",
			"spells": "/json/spells_full.json",
			"universal_spells": "/json/universal_spells.json"
		}
		
		this.times = {}
		this.data = {}

		this.loaded = false;
		this.callback = callback;
		this.start_time = performance.now();
		console.log(`window.location: '${window.location}'`);
		console.log(`window.location.hostname: '${window.location.hostname}'`);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";
		this.get_all_data(delay_ms, test_fail);
		this.bind_local_upload_button()
	}

	execute_on_load(func) {
		if (this.loaded) {
			func();
		} else {
			this.callback = func;
		}
	}

	complete_function() {
		console.groupCollapsed("Loading Data Complete!");

		for (let data_name in this.data) {
			console.log(`${data_name.toUpperCase()}:`, this.data[data_name]);
		}

		console.groupEnd();

		this.loaded = true;

		if (this.callback != null) {
			console.log(this.callback);
			this.callback();
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

	async delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(function(){resolve()}, ms);
		})
	}

	bind_local_upload_button() {
		var btn = document.getElementById("upload_local");
		if (btn != null) {
			btn.onclick = this.load_local_files.bind(this);
			console.log("Upload Local Files button bound");
		} else {
			console.log("Upload Local Files button not found");
		}
	}

	async load_local_files() {
		console.log("Load local!");
		var modal = new ModalWindow();
		modal.add_title("Use Local File");
		modal.add_subtitle("Upload a local file");
		console.log(Object.keys(this.data));
		var file_names = {}
		for (let data_name in this.data) {
			file_names[data_name] = data_name;
		}
		modal.add_select_input("data_name", "File", file_names);
		modal.add_file_input("new_file", "New File", ".json");
		var deets = await modal.get_user_input();

		console.log(deets);

		var fr = new FileReader()
		fr.addEventListener("load", e => {
			this.update_file_data(deets["data_name"], JSON.parse(fr.result));
			// // this.update_file_data()
			// console.log(e.target.result, JSON.parse(fr.result))
		});
		fr.readAsText(deets["new_file"]);
	}

	update_file_data(file_type, data) {
		console.log(data);
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

		console.log(spells);

		return spells;
	}


	// Family functions ////////////////////////////////////////////////////////
	get_family_trait(family_id) {
		var [clan, family] = family_id.split("_");
		console.log(this.data);
		return this.data.families[clan][family];
	}

	// School functions ////////////////////////////////////////////////////////
	get_school_info(school_id) {
		var [clan, school] = school_id.split("_");
		return this.data.schools[clan][school];
	}

	// Skill functions /////////////////////////////////////////////////////////
	get_skill_list(class_list=[]) {
		var SKILLS = this.data.skills;
		if (typeof class_list != "object") {
			class_list = [class_list];
		}

		console.log(class_list);

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

	// Clan functions //////////////////////////////////////////////////////////

	get_school_info(school_id) {
		var school_info = {};
		let [clan, school] = school_id.split("_");
		Object.assign(school_info, this.data.schools[clan][school]);

		school_info["attribute"] = this.get_attribute_changes(school_info["attribute"]);

		console.log(school_info);

		var starting_skills = {};
		for (let skill_string of school_info["skills"]) {
			var extracted_info = this.extract_skill_info(skill_string);
			starting_skills[extracted_info.name] = extracted_info;
		}

		console.log(starting_skills);

		school_info["skills"] = starting_skills;
		return school_info;
	}

	get_family_traits(family_id) {
		let [clan, family] = family_id.split("_");
		return this.get_attribute_changes(this.data.families[clan][family]);
	}

	get_clans() {
		var family_clans = Object.keys(this.data.families);
		var school_clans = Object.keys(this.data.schools);

		var all_clans = [];
		for (let clan_type of [family_clans, school_clans]) {
			for (let clan_name of clan_type) {
				if (!(all_clans.includes(clan_name))) {
					all_clans.push(clan_name);
				}
			}
		}
		all_clans.sort();

		return all_clans;
	}

	get_clan_families(chosen_clan=null) {
		if (chosen_clan) {
			if (chosen_clan in this.data.families) {
				return Object.keys(this.data[chosen_clan]);
			} else {
				console.warn(`Clan '${chosen_clan}' does not have any families`);
			}
		}

		// No clan specified, return families of all clans
		var family_dict = {}
		for (let clan in this.data.families) {
			family_dict[clan] = Object.keys(this.data.families[clan]);
		}
		return family_dict;
	}

	get_clan_schools(chosen_clan=null) {
		var clan_schools = this.data.schools;

		if (chosen_clan) {
			var clan_name = chosen_clan.split("_")[0];
			if (clan_name in clan_schools) {
				return Object.keys(clan_schools[clan_name]);
			} else {
				console.warn(`No schools exist for the '${clan_name} Clan'`);
			}
		}

		// No clan specified, return schools of all clans in dict;
		var school_dict = {};
		for (let clan in clan_schools) {
			school_dict[clan] = Object.keys(clan_schools[clan]);
		}
		return school_dict;
	}

	get_attribute_changes(attribute_str) {
		var attr_iterator = attribute_str.matchAll(/([a-zA-Z]+(?:_[-\d]+)?)/g);
		var attribute_changes = {};

		for (let group of attr_iterator) {
			var attr_string = group[1];
			var attr_name, attr_change;

			if (attr_string.includes("_")) {
				[attr_name, attr_change] = attr_string.split("_");
			} else {
				attr_name = attr_string;
				attr_change = 1;
			};

			attribute_changes[attr_name] = parseInt(attr_change);
		}
		return attribute_changes;
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

	skill_display_name(skill_id) {
		var skill_match = skill_id.match(/^([\w\s]+)\[([\w\s]+)\]$/);

		if (skill_match == null) {
			return skill_id;
		} else {
			var skill_type = skill_match[1];
			var skill_name = skill_match[2];

			if (skill_type == "Lore") {
				return `Lore: ${skill_name}`;
			} else {
				return skill_name;
			}
		}
	}

	get_techniques(school_id) {
		var [clan, school] = school_id.split("_");
		return this.data.schools[clan][school].techniques;
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
}

class DataTester extends DataLoader {
	constructor() {
		this.callback = this.run_all_tests();
	}

	run_all_tests() {

	}

	test_school_traits() {

	}
}

// Load DataHandler as a Window Variable
window.DH = new DataHandler();