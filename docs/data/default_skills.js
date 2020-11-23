// Skill Lists /////////////////////////////////////////////////////////////////

const general_skills = {
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

const artisan_skills = {
	"Bonsai": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Gardening": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Ikebana": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Origami": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Painting": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Poetry": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Sculpture": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
	"Tattooing": {trait: ["Awareness"], class: ["High"], macro: ["Artisan"], emphases: []},
}

const lore_skills = {
	"Lore: Architecture": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Bushido": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Elements": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Ghosts": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Heraldry": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: History": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: ["Lion Clan"]},
	"Lore: Nature": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Omens": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Shugenja": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Spirit Realms": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},
	"Lore: Theology": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: ["Fortunes"]},
	"Lore: War": {trait: ["Intelligence"], class: ["High"], macro: ["Lore"], emphases: []},

	"Lore: Anatomy": {trait: ["Intelligence"], class: ["Low"], macro: ["Lore"], emphases: []},
	"Lore: Maho": {trait: ["Intelligence"], class: ["Low"], macro: ["Lore"], emphases: []},
	"Lore: Shadowlands": {trait: ["Intelligence"], class: ["Low"], macro: ["Lore"], emphases: []},
	"Lore: Underworld": {trait: ["Intelligence"], class: ["Low"], macro: ["Lore"], emphases: []}
}

const perform_skills = {
	"Perform: Biwa": {trait: ["Agility"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Dance": {trait: ["Agility"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Drums": {trait: ["Agility"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Flute": {trait: ["Agility"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Oratory": {trait: ["Awareness"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Puppeteer": {trait: ["Agility"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Samisen": {trait: ["Agility"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Song": {trait: ["Awareness"], class: ["High"], macro: ["Perform"], emphases: []},
	"Perform: Storytelling": {trait: ["Awareness"], class: ["High"], macro: ["Perform"], emphases: []},
}

const craft_skills = {
	"Craft: Cartography": {trait: ["Intelligence"], class: ["Merchant"], macro: ["Craft"], emphases: []},
}

var custom_skills = {};

// All Skills //////////////////////////////////////////////////////////////////

var all_skills = {};

function update_all_skills() {
	all_skills = Object.assign({}, general_skills, artisan_skills, craft_skills,
	                           perform_skills, lore_skills, custom_skills);
}
// Note: Because it is last in the .assign() function, custom_skills will 
// override any other skills that are duplicated in it. This could be useful
// for modifying skills, by just duplicating their entry and adding the
// modifications (which I currently presume is only adding an emphasis).

update_all_skills();

// Getters /////////////////////////////////////////////////////////////////////

// Get a list of all skills that fit in the given class constraints.
function get_skill_list(class_list=[]) {

	if (typeof class_list != "object") {
		class_list = [class_list]
	}

	var skill_list = [];
	for (let skill_name in all_skills) {
		if (class_list.length == 0) {
			skill_list.push(skill_name);
			continue;
		}

		// A class/macro is specified
		let skill = all_skills[skill_name];
		for (let type of class_list) {
			if (skill["macro"].includes(type) || skill["class"].includes(type)){
				skill_list.push(skill_name);
				break;
			}
		}
	}
	return skill_list;
}

// Checks if a provided string is a skill
function is_skill(skill_name) {
	return (skill_name in all_skills);
}

// Return the info for a certain skill.
function get_skill_info(skill_name) {
	if (skill_name in all_skills) {
		var output = {};
		Object.assign(output, all_skills[skill_name]);
		return output;
	} else {
		console.log(`ERROR - get_skill_info: ${skill_name} not found.`)
	}
}

// Create information for a new skill
function get_new_skill(skill_name) {
	return {
	    "rank": 1,
	    "trait": Object.assign([], all_skills[skill_name]["trait"]),
	    "class": Object.assign([], all_skills[skill_name]["class"]),
	    "emphases": []
	}
}

// Return a dictionary of skills, with Macro skills put into subgroups
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
    "Void": [],
}

const trait_abbreviations = {
	"Awareness": "AWA",
	"Reflexes": "REF",
	"Stamina": "STA",
	"Willpower": "WIL",
	"Agility": "AGI",
	"Intelligence": "INT",
	"Perception": "PER",
	"Strength": "STR",
	"Void": "VOID"
}

function get_trait_names() {
	var trait_names = [];
	for (let ring in rings) {
		for (let t of rings[ring]) {
			trait_names.push(t);
		}
	}
	return trait_names;
}

function display_trait(skill_name) {
	var skill_info = get_skill_info(skill_name);
	var abbreviation = [];
	for (let trait of skill_info["trait"]) {
		abbreviation.push(trait_abbreviations[trait]);
	}
	return abbreviation.join("/");
}

// Macro and Custom Skills /////////////////////////////////////////////////////

function add_custom_skill(skill_name, skill_traits, skill_class, 
                          skill_macro=null, emphases=[]) {
	// TODO: Add more formatting checks here
	custom_skills[skill_name] = {
		"trait": skill_traits,
		"emphases": emphases,
		"macro": (skill_macro == null) ? [] : [skill_macro],
		"class": [skill_class]
}}

function add_emphasis_to_skill(skill_name, emphasis) {
	if (!(skill_name in custom_skills)) {
		if (skill_name in all_skills) {
			// Skill already exists, just copy it over to Custom Skills
			Object.assign(custom_skills[skill_name], all_skills[skill_name])
		} else {
			// Skill does not exist yet. Needs to be created first.
			console.log(`ERROR - add_emphasis_to_skill: Skill ${skill_name} does not exist.`)
			return;
		}

	} else {
		// Skill already exists in Custom Skills, see if it already has emphasis
		if (custom_skills[skill_name]["emphases"].includes(emphasis)) {
			// Emphasis already exists. Log and abort.
			console.log(`ERROR - add_emphasis_to_skill: ` + 
			            `Emphasis ${emphasis} for skill ${skill_name} already exists.`);
			return;
		} else {

			// Able to add emphasis
			custom_skills[skill_name]["emphases"].push(emphasis);
			update_all_skills();
		}
	}
}

