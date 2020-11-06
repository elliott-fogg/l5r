const default_skills = {
	'Acting': {trait: ['Awareness'], class: ['High'], macro: [], emphases: ["Clan", "Gender", "Profession"]},
	'Calligraphy': {trait: ['Intelligence'], class: ['High'], macro: ["Artisan"], emphases: ["Cipher", "High Rokugani"]},
	'Courtier': {trait: ['Awareness'], class: ['High'], macro: [], emphases: ["Gossip", "Manipulation", "Rhetoric"]},
	'Divination': {trait: ['Intelligence'], class: ['High'], macro: [], emphases: ["Astrology", "Kawaru"]},
	'Etiquette': {trait: ['Awareness'], class: ['High'], macro: [], emphases: ["Bureaucracy", "Conversation", "Courtesy"]},
	'Investigation': {trait: ['Perception'], class: ['High'], macro: [], emphases: ["Interrogation", "Notice", "Search"]},
	'Medicine': {trait: ['Intelligence'], class: ['High'], macro: [], emphases: ["Antidotes", "Disease", "Herbalism", "Non-Humans", "Wound-Treatment"]},
	'Meditation': {trait: ['Void'], class: ['High'], macro: [], emphases: ["Fasting", "Void Recovery"]},
	'Sincerity': {trait: ['Awareness'], class: ['High'], macro: [], emphases: ["Honesty", "Deceit"]},
	'Spellcraft': {trait: ['Intelligence'], class: ['High'], macro: [], emphases: ["Importune", "Spell Research"]},
	'Tea Ceremony': {trait: ['Void'], class: ['High'], macro: [], emphases: []},
	'Athletics': {trait: ['Strength'], class: ['Bugei'], macro: [], emphases: ["Climbing", "Running", "Swimming", "Throwing"]},
	'Battle': {trait: ['Perception'], class: ['Bugei'], macro: [], emphases: ["Mass Combat", "Skirmish"]},
	'Defense': {trait: ['Reflexes'], class: ['Bugei'], macro: [], emphases: []},
	'Horsemanship': {trait: ['Agility'], class: ['Bugei'], macro: [], emphases: ["Gaijin Riding Horse", "Rokugani Pony", "Utaku Steed"]},
	'Hunting': {trait: ['Perception'], class: ['Bugei'], macro: [], emphases: ["Surviving", "Tracking", "Trailblazing"]},
	'Iaijutsu': {trait: ['Reflexes'], class: ['Bugei'], macro: [], emphases: ["Assessment", "Focus"]},
	'Jiujutsu': {trait: ['Agility'], class: ['Bugei'], macro: [], emphases: ["Grappling", "Improvised Weapons", "Martial Arts"]},
	'Chain Weapons': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Kusarigama", "Kyoketsu-shogi", "Manrikikusari"]},
	'Heavy Weapons': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Dai Tsuchi", "Masakari", "Ono", "Tetsubo"]},
	'Kenjutsu': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Katana", "Ninja-to", "No-Dachi", "Parangu", "Scimitar", "Wakizashi"]},
	'Knives': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Aiguchi", "Jitte", "Kama", "Sai", "Tanto"]},
	'Kyujutsu': {trait: ['Reflexes'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Dai-kyu", "Han-kyu", "Yumi"]},
	'Ninjutsu': {trait: ['Agility','Reflexes'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Blowgun", "Shuriken", "Tsubute"]},
	'Polearms': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Bisento", "Nagamaki", "Naginata", "Sasumata", "Sodegarami"]},
	'Spears': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Mai Chong", "Kumade", "Lance", "Nage-yari", "Yari"]},
	'Staves': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: ["Bo", "Jo", "Machi-kanshisha", "Nunchaku", "Sang Kauw", "Tonfa"]},
	'War Fan': {trait: ['Agility'], class: ['Bugei'], macro: ["Weapons"], emphases: []},
	'Animal Handling': {trait: ['Awareness'], class: ['Merchant'], macro: [], emphases: ["Dogs", "Horses", "Falcons"]},
	'Commerce': {trait: ['Intelligence'], class: ['Merchant'], macro: [], emphases: ["Appraisal", "Mathematics"]},
	'Engineering': {trait: ['Intelligence'], class: ['Merchant'], macro: [], emphases: ["Construction", "Siege"]},
	'Sailing': {trait: ['Agility','Intelligence'], class: ['Merchant'], macro: [], emphases: ["Knot-work", "Navigation"]},
	'Forgery': {trait: ['Agility'], class: ['Low'], macro: [], emphases: []},
	'Intimidation': {trait: ['Awareness'], class: ['Low'], macro: [], emphases: ["Bullying", "Control", "Torture"]},
	'Sleight Of Hand': {trait: ['Agility'], class: ['Low'], macro: [], emphases: ["Conceal", "Escape", "Pickpocket", "Prestidigitation"]},
	'Stealth': {trait: ['Agility'], class: ['Low'], macro: [], emphases: ["Ambush", "Shadowing", "Sneaking", "Spell Casting"]},
	'Temptation': {trait: ['Awareness'], class: ['Low'], macro: [], emphases: ["Bribery", "Seduction"]},
}

function get_skill_list(class_list=[]) {

	if (typeof class_list != "object") {
		class_list = [class_list]
	}

	console.log("Class list", class_list)

	var skill_list = [];
	for (let skill_name in all_skills) {
		let skill = all_skills[skill_name];
		if (class_list.length == 0) {
			skill_list.push(skill_name);
			continue;
		}

		// A class/macro is specified
		for (let type of class_list) {
			console.log(type);
			if (skill["macro"].includes(type) || skill["class"].includes(type)){
				skill_list.push(skill_name);
				break;
			}
		}
	}

	return skill_list;
}

function get_skill_emphases(skill_name) {
	var output = [];
	Object.assign(output, all_skills[skill_name]["emphases"]);
	return output;
}

function get_skill_info(skill_name) {
	var output = [];
	Object.assign(output, all_skills[skill_name]);
	return output;
}

function sort_skills_by_macro(skill_list) {
	var skill_dict = {};
	for (let skill_name of skill_list) {
		let skill_macro = all_skills[skill_name]["macro"][0];

		if (skill_macro) {
			if (skill_macro in skill_dict) {
				skill_dict[skill_macro].push(skill_name);
			} else {
				skill_dict[skill_macro] = [skill_name];
			}
		} else {
			if ("Any" in skill_dict) {
				skill_dict["Any"].push(skill_name);
			} else {
				skill_dict["Any"] = [skill_name];
			}
			
		}
	}
	return skill_dict;
}

function create_skill_sublists(skill_list) {
	var skill_dict = {};
	for (let skill_name of skill_list) {
		let skill_macro = all_skills[skill_name]["macro"][0];

		if (skill_macro) {
			if (!(skill_macro in skill_dict)) { skill_dict[skill_macro] = {}; }
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

// Rings and Traits ////////////////////////////////////////////////////////////

const rings = {
    "Air": ["Awareness", "Reflexes"],
    "Earth": ["Stamina", "Willpower"],
    "Fire": ["Agility", "Intelligence"],
    "Water": ["Perception", "Strength"],
    "Void": ["Void"]
}

const trait_names = (function() {
	var traits = [];
	for (let ring in rings) {
		for (let t of rings[ring]) {
			traits.push(t);
		}
	};
	return traits;
})();

// Macro and Custom Skills /////////////////////////////////////////////////////

var custom_skills = {};

function add_lore_skill(skill_name, lore_class="High", emphases=[]) {
	custom_skills[skill_name] = {
		"trait": ["Intelligence"],
		"emphases": emphases,
		"macro": ["Lore"],
		"class": [lore_class]
}}

function add_artisan_skill(skill_name, emphases=[]) {
	custom_skills[skill_name] = {
		"trait": ["Awareness"],
		"emphases": emphases,
		"macro": ["Artisan"],
		"class": ["High"]
}}

function add_perform_skill(skill_name, skill_traits, emphases=[]) {
	custom_skills[skill_name] = {
		"trait": skill_traits,
		"emphases": emphases,
		"macro": ["Perform"],
		"class": ["High"]
}}

function add_craft_skill(skill_name, skill_traits, skill_class, emphases=[]) {
	custom_skills[skill_name] = {
		"trait": skill_traits,
		"emphases": emphases,
		"macro": ["Craft"],
		"class": [skill_class]
}}

function add_weapon_skill(skill_name, skill_traits, emphases=[]) {
	custom_skills[skill_name] = {
		"trait": skill_traits,
		"emphases": emphases,
		"macro": ["Weapons"],
		"class": ["Bugei"]
}}

function add_custom_skill(skill_name, skill_traits, skill_class, 
                          skill_macro=null, emphases=[]) {
	custom_skills[skill_name] = {
		"trait": skill_traits,
		"emphases": emphases,
		"macro": (skill_macro == null) ? [] : [skill_macro],
		"class": [skill_class]
}}

function add_emphasis_to_skill(skill_name, emphasis) {
	if (skill_name in custom_skills) {
		if (!(custom_skills[skill_name].emphases.includes(emphasis))) {
			custom_skills[skill_name].emphases.push(emphasis);
}}}

// Add remaining sub-skills ////////////////////////////////////////////////////
for (let artisan of ["Bonsai", "Gardening", "Ikebana", "Origami", "Painting", 
     "Poetry", "Sculpture", "Tattooing"]) {
	add_artisan_skill(artisan);
}

for (let high_lore of ["Architecture", "Bushido", "Elements", "Ghosts", 
     "Heraldry", "History", "Nature", "Omens", "Shugenja", "Spirit Realms",
     "Theology", "War"]) {
	add_lore_skill(high_lore)
}

for (let low_lore of ["Anatomy", "Maho", "Shadowlands", "Underworld"]) {
	add_lore_skill(low_lore, "Low");
}

for (let [perform, trait] of [["Biwa", "Agility"], ["Dance", "Agility"], 
     ["Drums", "Agility"], ["Flute", "Agility"], ["Oratory", "Awareness"], 
     ["Puppeteer", "Agility"], ["Samisen", "Agility"], ["Song", "Awareness"],
     ["Storytelling", "Awareness"]]) {
	add_perform_skill(perform, [trait])
}

// Adding Emphases provided by starting Schools ////////////////////////////////
add_emphasis_to_skill("Lore: History", "Lion Clan");
add_emphasis_to_skill("Lore: Theology", "Fortunes");

// Gathering All Skills ////////////////////////////////////////////////////////

var all_skills = {};
var all_skill_names = [];

function update_all_skills() {
	all_skills = {};
	var skills_to_include = [default_skills, custom_skills];

	skills_to_include.forEach(skill_list => {
		for (let skill in skill_list) {
			if (skill in all_skills) {console.log(`Skill duplicate: ${skill} in ${skill_list}`)}
			all_skills[skill] = skill_list[skill];
		}
	});

	all_skill_names = Object.keys(all_skills);
}

update_all_skills();