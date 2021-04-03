class DataLoader {
	constructor(callback=null, delay_ms=0, test_fail=false) {
		console.warn("Called here");
		this.paths = {
			"skills": "/json/skill_info.json",
			"clans": "/json/clan_info.json",
			"schools": "/json/schools_reduced.json",
			"families": "/json/families.json",
			"advantages": "/json/advantages.json",
			"disadvantages": "/json/disadvantages.json",
			"spells": "/json/spells.json"
		}
		
		this.times = {}
		this.data = {}

		this.loaded = false;
		this.callback = callback;
		this.start_time = performance.now();
		this.hostname = window.location.hostname;
		console.log("Real hostname: " + this.hostname);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";
		this.get_all_data(delay_ms, test_fail);
		this.bind_local_upload_button()
	}

	complete_function() {
		console.groupCollapsed("Loading Data Complete!");

		for (let data_name in this.data) {
			console.log(`${data_name.toUpperCase()}:`, this.data[data_name]);
		}

		console.groupEnd();

		this.loaded = true;

		if (this.callback != null) {
			console.log("Triggering callback...")
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
		Object.assign(school_info, this.data.clans[clan]["schools"][school]);
		school_info["attribute"] = this.get_attribute_changes(school_info["attribute"]);

		var starting_skills = {};
		for (let skill_string of school_info["skills"]) {
			starting_skills = Object.assign({}, starting_skills,
			                            this.extract_skill_info(skill_string));
		}
		school_info["skills"] = starting_skills;
		return school_info;
	}

	get_family_traits(family_id) {
		let [clan, family] = family_id.split("_");
		return this.get_attribute_changes(this.data.clans[clan]["families"][family]);
	}

	get_clans() {
		return Object.keys(this.data.clans);
	}

	get_clan_families(chosen_clan=null) {
		if (chosen_clan) {
			if (chosen_clan in this.data.clans) {
				return Object.keys(this.data.clans[chosen_clan]["families"]);
			} else {
				console.log(`Clan '${chosen_clan}' not found.`)
			}
		}

		// No clan specified, return families of all clans
		var family_dict = {}
		for (let clan in this.data.clans) {
			family_dict[clan] = Object.keys(this.data.clans[clan]["families"]);
		}
		return family_dict;
	}

	get_clan_schools(chosen_clan=null) {
		var clans = this.data.clans;

		if (chosen_clan) {
			var clan_name = chosen_clan.split("_")[0];
			if (clan_name in clans) {
				return Object.keys(clans[clan_name]["schools"]);
			} else {
				console.log(`Clan '${clan_name}' not found.`)
			}
		}

		// No clan specified, return schools of all clans in dict;
		school_dict = {};
		for (let clan in clans) {
			school_dict[clan] = Object.keys(clan_info[clan]["schools"]);
		}
		return family_dict;
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
		
		var skill_match = skill_string.match(/^([a-zA-Z: ]+)_?/);
	  	var skill_name = (skill_match !== null) ? skill_match[1] : null;
	  	
	  	var emphases_match = skill_string.match(/\(([\w\s,]+)\)/);
	  	var emphases = (emphases_match !== null) ? emphases_match[1].split(",") : [];

	  	var rank_match = skill_string.match(/_(\d+)$/);
	  	var rank = (rank_match !== null) ? parseInt(rank_match[1]) : 1;
	  

	  	var skill_info = this.get_skill_info(skill_name);

	  	var output = {};
	  	output[skill_name] = {
	  			"rank": rank,
	  			"emphases": emphases,
	  			"class": skill_info["class"],
	  			"trait": skill_info["trait"]
	  	}
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
