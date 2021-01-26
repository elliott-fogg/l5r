class DataLoader {
	constructor(callback=null, delay_ms=0, test_fail=false) {
		this.data = {
			"skills": {"path": "/json/skill_info.json"},
			"clans": {"path": "/json/clan_info.json"},
			"advantages": {"path": "/json/advantages.json"},
			"disadvantages": {"path": "/json/disadvantages.json"}
		}
		this.loaded = false;
		this.callback = callback;
		this.start_time = performance.now();
		this.hostname = window.location.hostname;
		console.log("Real hostname: " + this.hostname);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";
		this.get_all_data(delay_ms, test_fail);
	}

	complete_function() {
		for (let data_name in this.data) {
			console.log(`${data_name.toUpperCase()}:`, this[data_name]);
		}

		this.loaded = true;
		console.log("Loading data complete");

		if (this.callback != null) {
			console.log("Testing callback...")
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

		for (let data_name in this.data) {
			let url = this.hostname + this.data[data_name]["path"];
			myPromises.push(this.get_load_data_promise(url, data_name));
		}

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

		console.log("Complete!");
		this.complete_function();
	}

	async get_load_data_promise(url, data_name) {
		console.log(url, data_name);
		return new Promise((resolve) => {
			this.load_data(resolve, url, data_name);
		});
	}

	async load_data(resolve, url, data_name) {
		console.log("Received request for " + data_name);
		this.data[data_name]["start_time"] = performance.now();
		var json_data = await this.get_data(url);
		this[data_name] = json_data;
		this.data[data_name]["end_time"] = performance.now();
		if (json_data) {
			resolve([data_name, true]);
		} else {
			resolve([data_name, false]);
		}

		// resolve([data_name, json_data != null]);
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
			console.log("Fetch Error :-S", err);
		});
	}

	async delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(function(){resolve()}, ms);
		})
	}

// End Class
}

class DataHandler extends DataLoader {

	// Skill functions /////////////////////////////////////////////////////////
	get_skill_list(class_list=[]) {
		if (typeof class_list != "object") {
			class_list = [class_list];
		}

		var skill_list = [];
		for (let skill_name in this.skills) {
			if (class_list.length == 0) {
				skill_list.push(skill_name);
				continue;
			}

			// A class/macro is specified
			let skill = this.skills[skill_name];
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
		return (skill_name in this.skills);
	}

	get_skill_info(skill_name) {
		if (skill_name in this.skills) {
			var output = {};
			Object.assign(output, this.skills[skill_name]);
			return output;
		} else {
			console.log(`ERROR - get_skill_info: ${skill_name} not found.`)
		}
	}

	get_new_skill(skill_name) {
		return {
		    "rank": 1,
		    "trait": Object.assign([], this.skills[skill_name]["trait"]),
		    "class": Object.assign([], this.skills[skill_name]["class"]),
		    "emphases": []
		}
	}

	create_skill_sublists(skill_list) {
		var skill_dict = {};
		for (let skill_name of skill_list) {
			let skill_macro = this.skills[skill_name]["macro"][0];

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
		Object.assign(school_info, this.clans[clan]["schools"][school]);
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
		return this.get_attribute_changes(this.clans[clan]["families"][family]);
	}

	get_clans() {
		return Object.keys(this.clans);
	}

	get_clan_families(chosen_clan=null) {
		if (chosen_clan) {
			if (chosen_clan in this.clans) {
				return Object.keys(this.clans[chosen_clan]["families"]);
			} else {
				console.log(`Clan '${chosen_clan}' not found.`)
			}
		}

		// No clan specified, return families of all clans
		var family_dict = {}
		for (let clan in this.clans) {
			family_dict[clan] = Object.keys(this.clans[clan]["families"]);
		}
		return family_dict;
	}

	get_clan_schools(chosen_clan=null) {
		if (chosen_clan) {
			var clan_name = chosen_clan.split("_")[0];
			if (clan_name in this.clans) {
				return Object.keys(this.clans[clan_name]["schools"]);
			} else {
				console.log(`Clan '${clan_name}' not found.`)
			}
		}

		// No clan specified, return schools of all clans in dict;
		school_dict = {};
		for (let clan in this.clans) {
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
		if (list_type == null) {
			console.log("ERROR: No list_type provided!");
			list_type = "skills_lore";
		}
		var [main_type, sub_type] = list_type.split("_")
		console.log(main_type, sub_type);
		var results;
		switch (main_type) {
			case "skills":
				results = this.get_skill_list(sub_type)
				break
			default:
				console.log(`ERROR: List type does not exist: ${list_type}`)
				results = ["PLACEHOLDER_1", "PLACEHOLDER_2", "PLACEHOLDER_3"];
		}

		console.log(results)
		return results
	}

// End Class
}
