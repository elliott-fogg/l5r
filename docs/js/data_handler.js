class DataHandler extends DataLoader {

	constructor() {
		super();
		this.execute_on_load(function() {
			console.log("DataHandler Working!");
		});
		this.execute_on_load(this.get_universal_spells.bind(this));
	}

	get_universal_spells() {
		console.log("SEARCHING SPELLS");
		var universal_spells = [];
		console.log(this);
		for (let spell_name in this.data.spells) {
			if (this.data.spells[spell_name]["universal"]) {
				universal_spells.push(spell_name);
			}
		}
		this.data.universal_spells = universal_spells;
	}

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

	get_all_spells() {
		var all_elements = ["Air", "Earth", "Fire", "Water", "Void", "Other"];
		var spells = {};
		for (let e of all_elements) {
			spells[e] = {};
			for (let i=1; i<=6; i++) {
				spells[e][i] = {};
			}
		}

		for (let spell_name in this.data.spells) {
			var spell = this.data.spells[spell_name];
			var element = spell.element;
			if (!(element in spells)) {
				element = "Other";
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

	get_all_spell_names() {
		var spell_names = [];
		for (let spell in this.data.spells) {
			spell_names.push(spell);
		}
		return spell_names;
	}

	get_searchable_spell_names() {
		if (this.searchable_spell_names) {
			return this.searchable_spell_names;
		} else {
			var spell_names = this.get_all_spell_names();
			var searchable_spell_names = {}
			for (let name of spell_names) {
				let search_name = name.replace(/[\.'"\(\)’]/g, "").toLowerCase();
				searchable_spell_names[search_name] = name;
			}
			this.searchable_spell_names = searchable_spell_names;
			return searchable_spell_names;
		}
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