const default_skills = {
	'Acting': {trait: ['Awareness'], class: ['High'], emphases: ["Clan", "Gender", "Profession"]},
	'Calligraphy': {trait: ['Intelligence'], class: ['High'], emphases: ["Cipher", "High Rokugani"]},
	'Courtier': {trait: ['Awareness'], class: ['High'], emphases: ["Gossip", "Manipulation", "Rhetoric"]},
	'Divination': {trait: ['Intelligence'], class: ['High'], emphases: ["Astrology", "Kawaru"]},
	'Etiquette': {trait: ['Awareness'], class: ['High'], emphases: ["Bureaucracy", "Conversation", "Courtesy"]},
	'Investigation': {trait: ['Perception'], class: ['High'], emphases: ["Interrogation", "Notice", "Search"]},
	'Medicine': {trait: ['Intelligence'], class: ['High'], emphases: []},
	'Meditation': {trait: ['Void'], class: ['High'], emphases: []},
	'Sincerity': {trait: ['Awareness'], class: ['High'], emphases: []},
	'Spellcraft': {trait: ['Intelligence'], class: ['High'], emphases: []},
	'Tea Ceremony': {trait: ['Void'], class: ['High'], emphases: []},
	'Athletics': {trait: ['Strength'], class: ['Bugei'], emphases: []},
	'Battle': {trait: ['Perception'], class: ['Bugei'], emphases: []},
	'Defense': {trait: ['Reflexes'], class: ['Bugei'], emphases: []},
	'Horsemanship': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Hunting': {trait: ['Perception'], class: ['Bugei'], emphases: []},
	'Iaijutsu': {trait: ['Reflexes'], class: ['Bugei'], emphases: []},
	'Jiujutsu': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Chain Weapons': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Heavy Weapons': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Kenjutsu': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Knives': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Kyujutsu': {trait: ['Reflexes'], class: ['Bugei'], emphases: []},
	'Ninjutsu': {trait: ['Agility','Reflexes'], class: ['Bugei'], emphases: []},
	'Polearms': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Spears': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Staves': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'War Fan': {trait: ['Agility'], class: ['Bugei'], emphases: []},
	'Animal Handling': {trait: ['Awareness'], class: ['Merchant'], emphases: []},
	'Commerce': {trait: ['Intelligence'], class: ['Merchant'], emphases: []},
	'Engineering': {trait: ['Intelligence'], class: ['Merchant'], emphases: []},
	'Sailing': {trait: ['Agility','Intelligence'], class: ['Merchant'], emphases: []},
	'Forgery': {trait: ['Agility'], class: ['Low'], emphases: []},
	'Intimidation': {trait: ['Awareness'], class: ['Low'], emphases: []},
	'Sleight Of Hand': {trait: ['Agility'], class: ['Low'], emphases: []},
	'Stealth': {trait: ['Agility'], class: ['Low'], emphases: []},
	'Temptation': {trait: ['Awareness'], class: ['Low'], emphases: []},
}

const default_skill_names = Object.keys(default_skills);

let msnl = 0;
default_skill_names.forEach(n => {
	if (n.length > msnl) {
		msnl = n.length;
	};
})

const max_skill_name_length = msnl;
console.log("MAX SKILL NAME LENGTH: ", max_skill_name_length);


const rings = [
    {name: "Air", traits: ["Awareness", "Reflexes"]},
    {name: "Earth", traits: ["Stamina", "Willpower"]},
    {name: "Fire", traits: ["Agility", "Intelligence"]},
    {name: "Water", traits: ["Perception", "Strength"]},
    {name: "Void", traits: ["Void"]}
]

function maxmin(value, min_val, max_val) {
	var result = Math.max(min_val, Math.min(max_val, value));
	console.log(value, min_val, max_val, result);
	return result;
}