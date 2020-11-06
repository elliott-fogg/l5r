const clan_info = {
	"Crab": {
		"families": {
			"Hida": "Strength",
			"Hiruma": "Agility",
			"Kaiu": "Intelligence",
			"Kuni": "Intelligence",
			"Toritaka": "Perception",
			"Yasuki": "Awareness"
		},
		"schools": {
			"Hida Bushi School": {
				"attribute": "Stamina",
				"skills": ["Athletics", "Defense", "Heavy Weapons_(Tetsubo)", "Intimidation", "Kenjutsu", "Lore[Shadowlands]"],
				"skill_choices": ["Bugei"],
				"honor": 3.5
			},
			"Kuni Shugenja School": {
				"attribute": "Willpower",
				"skills": ["Calligraphy_(Cipher)", "Defense", "Lore[Shadowlands]_2", "Lore[Theology]", "Spellcraft"],
				"skill_choices": ["Weapon"],
				"honor": 2.5
			},
			"Yasuki Courtier School": {
				"attribute": "Perception",
				"skills": ["Commerce_(Appraisal)", "Courtier", "Defense", "Etiquette", "Intimidation", "Sincerity_(Deceit)"],
				"skill_choices": ["Merchant"],
				"honor": 2.5
			},
			"Hiruma Bushi School": {
				"attribute": "Willpower",
				"skills": ["Athletics", "Hunting", "Kenjutsu_(Katana)", "Kyujutsu", "Lore[Shadowlands]", "Stealth"],
				"skill_choices": ["Any"],
				"honor": 4.5
			}
		}
	},

	"Crane": {
		"families": {
			"Asahina": "Intelligence",
			"Daidoji": "Stamina",
			"Doji": "Awareness",
			"Kakita": "Agility"
		},
		"schools": {
			"Kakita Bushi School": {
				"attribute": "Reflexes",
				"skills": ["Etiquette", "Iaijutsu_(Focus)", "Kenjutsu", "Kyujutsu", "Sincerity", "Tea Ceremony"],
				"skill_choices": ["Bugei/High"],
				"honor": 6.5
			},
			"Asahina Shugenja School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy_(Cipher)", "Etiquette", "Lore[Theology]", "Meditation", "Spellcraft"],
				"skill_choices": ["Artisan", "High"],
				"honor": 6.5
			},
			"Doji Courtier School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy", "Courtier_(Manipulation)", "Etiquette_(Courtesy)", "Perform[Storytelling]", "Sincerity", "Tea Ceremony"],
				"skill_choices": ["Artisan/Perform"],
				"honor": 6.5
			},
			"Daidoji Iron Warrior": {
				"attribute": "Agility",
				"skills": ["Battle", "Defense_2", "Iaijutsu", "Kenjutsu_(Katana)", "Kyujutsu"],
				"skill_choices": ["Any"],
				"honor": 6.5
			}
		},
	},

	"Dragon": {
		"families": {
			"Kitsuki": "Awareness",
			"Mirumoto": "Agility",
			"Tamori": "Willpower",
			// "Togashi Order": "Reflexes"
		},
		"schools": {
			"Mirumoto Bushi School": {
				"attribute": "Stamina",
				"skills": ["Defense", "Iaijutsu", "Kenjutsu_(Katana)", "Lore[Shugenja]", "Meditation", "Lore[Theology]"],
				"skill_choices": ["Bugei/High"],
				"honor": 4.5
			},
			"Tamori Shugenja School": {
				"attribute": "Stamina",
				"skills": ["Athletics", "Calligraphy_(Cipher)", "Defense", "Divination", "Lore[Theology]", "Medicine", "Spellcraft"],
				"skill_choices": [],
				"honor": 4.5
			},
			"Kitsuki Investigator School": {
				"attribute": "Perception",
				"skills": ["Courtier", "Etiquette_(Courtesy)", "Investigation_(Interrogation)", "Kenjutsu", "Meditation", "Sincerity"],
				"skill_choices": ["Lore"],
				"honor": 5.5
			},
			"Togashi Tattooed Order": {
				"attribute": "Void",
				"skills": ["Athletics", "Defense", "Craft[Tattooing]", "Jiujutsu", "Meditation"],
				"skill_choices": ["Lore", "!Low"],
				"honor": 4.5
			}
		}
	},

	"Lion": {
		"families": {
			"Akodo": "Agility",
			"Ikoma": "Awareness",
			"Kitsu": "Intelligence",
			"Matsu": "Strength"
		},
		"schools": {
			"Akodo Bushi School": {
				"attribute": "Perception",
				"skills": ["Battle_(Mass Combat)", "Defense", "Kenjutsu", "Kyujutsu", "Lore[History]", "Sincerity"],
				"skill_choices": ["Bugei/High"],
				"honor": 6.5
			},
			"Kitsu Shugenja School": {
				"attribute": "Perception",
				"skills": ["Battle", "Calligraphy_(Cipher)", "Etiquette", "Lore[History]", "Lore[Theology]", "Spellcraft"],
				"skill_choices": ["High/Bugei"],
				"honor": 6.5
			},
			"Ikoma Bard School": {
				"attribute": "Intelligence",
				"skills": ["Courtier", "Etiquette", "Lore[History]_(Lion Clan)", "Perform[Storytelling]", "Sincerity_(Honesty)"],
				"skill_choices": ["High", "Bugei"],
				"honor": 6.5
			},
			"Matsu Berserker School": {
				"attribute": "Strength",
				"skills": ["Battle", "Jiujutsu", "Kenjutsu_(Katana)", "Kyujutsu", "Lore[History]"],
				"skill_choices": ["Bugei", "Bugei"],
				"honor": 6.5
			}
		}
	},

	"Mantis": {
		"families": {
			"Kitsune": "Awareness",
			"Moshi": "Intelligence",
			"Tsuruchi": "Perception",
			"Yoritomo": "Stamina"
		},
		"schools": {
			"Yoritomo Bushi School": {
				"attribute": "Strength",
				"skills": ["Commerce", "Defense", "Jiujutsu_(Improvised Weapons)", "Kenjutsu", "Knives_(Kama)", "Sailing"],
				"skill_choices": ["Any"],
				"honor": 3.5
			},
			"Moshi Shugenja School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy_(Cipher)", "Divination", "Lore[Theology]", "Meditation", "Spellcraft"],
				"skill_choices": ["High/Bugei", "High/Bugei"],
				"honor": 4.5
			},
			"Yoritomo Courtier School": {
				"attribute": "Willpower",
				"skills": ["Commerce_(Appraisal)", "Courtier", "Defense", "Etiquette", "Intimidation_(Control)", "Sincerity"],
				"skill_choices": ["Merchant/Lore"],
				"honor": 2.5
			},
			"Tsuruchi Archer School": {
				"attribute": "Reflexes",
				"skills": ["Athletics", "Defense", "Hunting", "Investigation", "Kyujutsu_(Yumi)_2"],
				"skill_choices": ["Bugei/High"],
				"honor": 3.5
			}
		}
	},

	"Phoenix": {
		"families": {
			"Agasha": "Perception",
			"Asako": "Awareness",
			"Isawa": "Willpower",
			"Shiba": "Perception"
		},
		"schools": {
			"Shiba Bushi School": {
				"attribute": "Agility",
				"skills": ["Defense", "Kenjutsu", "Kyujutsu", "Meditation_(Void Recovery)", "Spears", "Lore[Theology]"],
				"skill_choices": ["Bugei/High"],
				"honor": 5.5
			},
			"Isawa Shugenja School": {
				"attribute": "Intelligence",
				"skills": ["Calligraphy_(Cipher)", "Lore[Theology]", "Medicine", "Meditation", "Spellcraft"],
				"skill_choices": ["Lore", "High"],
				"honor": 4.5
			},
			"Asako Loremaster School": {
				"attribute": "Intelligence",
				"skills": ["Courtier", "Etiquette_(Courtesy)", "Lore[History]", "Lore[Theology]_(Fortunes)", "Meditation", "Sincerity"],
				"skill_choices": ["Lore"],
				"honor": 6.5
			},
			"Agasha Shugenja School": {
				"attribute": "Intelligence",
				"skills": ["Calligraphy_(Cipher)", "Defense", "Etiquette", "Lore[Theology]", "Spellcraft"],
				"skill_choices": ["Craft", "High/Bugei"],
				"honor": 4.5
			}
		}
	},

	"Scorpion": {
		"families": {
			"Bayushi": "Agility",
			"Shosuro": "Awareness",
			"Soshi": "Intelligence",
			"Yogo": "Willpower"
		},
		"schools": {
			"Bayushi Bushi School": {
				"attribute": "Intelligence",
				"skills": ["Courtier_(Manipulation)", "Defense", "Etiquette", "Iaijutsu", "Kenjutsu", "Sincerity"],
				"skill_choices": ["Any"],
				"honor": 2.5
			},
			"Soshi Shugenja School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy_(Cipher)", "Courtier", "Etiquette", "Lore[Theology]", "Spellcraft", "Stealth"],
				"skill_choices": ["Any"],
				"honor": 2.5
			},
			"Bayushi Courtier School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy", "Courtier_(Gossip)", "Etiquette", "Investigation", "Sincerity_(Deceit)", "Temptation"],
				"skill_choices": ["High"],
				"honor": 2.5
			},
			"Shosuro Infiltrator School": {
				"attribute": "Reflexes",
				"skills": ["Acting", "Athletics", "Ninjutsu", "Sincerity", "Stealth_(Sneaking)_2"],
				"skill_choices": ["Any"],
				"honor": 1.5
			}
		}
	},

	"Unicorn": {
		"families": {
			"Horiuchi": "Willpower",
			"Ide": "Perception",
			"Iuchi": "Intelligence",
			"Moto": "Agility",
			"Shinjo": "Reflexes",
			"Utaku": "Stamina"
		},
		"schools": {
			"Moto Bushi School": {
				"attribute": "Strength",
				"skills": ["Athletics", "Defense", "Horsemanship", "Hunting", "Kenjutsu_(Scimitar)"],
				"skill_choices": ["Bugei", "Any"],
				"honor": 3.5
			},
			"Iuchi Shugenja School": {
				"attribute": "Perception",
				"skills": ["Battle", "Calligraphy_(Cipher)", "Horsemanship", "Lore[Theology]", "Meditation", "Spellcraft"],
				"skill_choices": ["High/Bugei"],
				"honor": 5.5
			},
			"Ide Emissary School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy", "Commerce", "Courtier", "Etiquette_(Conversation)", "Horsemanship", "Sincerity_(Honesty)"],
				"skill_choices": ["High/Perform"],
				"honor": 5.5
			},
			"Utaku Battle Maiden": {
				"attribute": "Reflexes",
				"skills": ["Battle", "Defense", "Horsemanship_2", "Kenjutsu", "Sincerity"],
				"skill_choices": ["High/Bugei"],
				"honor": 6.5
			}
		}
	},
	"Placeholder": {
		"families": {
			"Dummy": "Awareness Reflexes"
		},
		"schools": {

		}
	},
	"No Families": {
		"families": {

		},
		"schools": {
			"Orphaned Dummy School": {
				"attribute": "Reflexes",
				"skills": [],
				"skill_choices": ["Any", "Any", "Any"],
				"honor": 1.0
			}
		}
	}
}

function get_school_info(school_name) {
	console.log(school_name);
	var school_info = {};
	let [clan, school] = school_name.split("_");
	console.log(clan, school);
	Object.assign(school_info, clan_info[clan]["schools"][school]);
	school_info["attribute"] = get_attribute_changes(school_info["attribute"]);

	var translated_skills = [];
	for (let skill_string in school_info["skills"]) {
		translated_skills.push(extract_skill_info(skill_string));
	}
	school_info["skills"] = translated_skills;

	return school_info;
}

function get_family_traits(family_name) {
	let [clan, family] = family_name.split("_");
	return get_attribute_changes(clan_info[clan]["families"][family]);
}

// Return Information Lists ////////////////////////////////////////////////////

function get_clans() {
	return Object.keys(clan_info);
}

function get_clan_families(chosen_clan=null) {
	if (chosen_clan) {
		if (chosen_clan in clan_info) {
			return Object.keys(clan_info[chosen_clan]["families"]);
		} else {console.log(`Clan '${chosen_clan}' not found.`)}
	}
	
	// No clan specified, return families of all clans
	family_dict = {};
	for (let clan in clan_info) {
		family_dict[clan] = Object.keys(clan_info[clan]["families"])
	}
	return family_dict;
}

function get_clan_schools(chosen_clan=null) {
	if (chosen_clan) {
		var clan_name = chosen_clan.split("_")[0];
		if (clan_name in clan_info) {
			return Object.keys(clan_info[clan_name]["schools"]);
		} else {console.log(`Clan '${clan_name}' not found.`)}
	}

	// No clan specified, return schools of all clans in dict;
	school_dict = {};
	for (let clan in clan_info) {
		school_dict[clan] = Object.keys(clan_info[clan]["schools"]);
	}
	return family_dict;
}
// Translate Storage Formats ///////////////////////////////////////////////////

function get_attribute_changes(attribute_str) {
	console.log(attribute_str);
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

function extract_skill_info(skill_string) {
	var skill_match = skill_string.match(/^([a-zA-Z\[\] ]+)_?/);
  	var skill_name = (skill_match !== null) ? skill_match[1] : null;
  
  	var emphases_match = skill_string.match(/\(([\w\s,]+)\)/);
  	var emphases = (emphases_match !== null) ? emphases_match[1].split(",") : [];
  
  	var rank_match = skill_string.match(/_(\d+)$/);
  	var rank = (rank_match !== null) ? parseInt(rank_match[1]) : 1;
  
  	var skill_info = {
  		"name": skill_name,
  		"emphases": emphases,
  		"rank": rank
	}
  	return skill_info;
}

function construct_skillname(skill_str) {
	if (skill_str.includes("[")) {
		var split_str = skill_str.split("[");
		var macro_type = split_str[0];
		var skill_name = split_str[1].slice(0, -1);

		if (macro_type == "Lore") {
			return `Lore: ${skill_name}`;
		}

		// Otherwise (not Lore)
		return skill_name;

	} else {return skill_str;}
}

// Tests ///////////////////////////////////////////////////////////////////////

function test_starting_skills() {

	update_all_skills();

	for (let clan in clan_info) {
		for (let school in clan_info[clan]["schools"]) {
			let skill_list = clan_info[clan]["schools"][school].skills;
			skill_list.forEach(skill_str => {

				var skill_info = extract_skill_info(skill_str);
				var skill = construct_skillname(skill_info["name"]);

				if (!(skill in all_skills)) {
					console.log(`Skill '${skill}' not found. ` +
					            `Clan: ${clan}, School: ${school}.`)
					return;
				}

				var emphases = skill_info["emphases"];
				emphases.forEach(emphasis => {
					if (!(all_skills[skill]["emphases"].includes(emphasis))) {
						console.log(`Emphasis '${emphasis}' for skill '${skill}' ` +
						            `not found. Clan: ${clan}, School: ${school}.`)
						return;
					}
				});

				if (!(1 <= skill_info["rank"] <= 10)) {
					alert(`Invalid rank ${skill_info["rank"]} for skill ${skill}. ` +
					      `Clan: ${clan}, School: ${school}.`)
					return;
}})}}}

function test_starting_attributes() {
	for (let clan in clan_info) {
		for (let family in clan_info[clan]["families"]) {
			var changes = get_attribute_changes(clan_info[clan]["families"][family]);
			for (let c in changes) {
				if (!(trait_names.includes(c))) {
					console.log(`False Attribute: ${c}, ${family}, ${clan}`);
	}}}}

	for (let clan in clan_info) {
		for (let school in clan_info[clan]["schools"]) {
			var changes = get_attribute_changes(clan_info[clan]["schools"][school]["attribute"]);
			for (let c in changes) {
				if (!(trait_names.includes(c))) {
					console.log(`False Attribute: ${c}, ${school}, ${clan}`);
	}}}}
}