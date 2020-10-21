const skills = [
	{name: 'Acting', trait: ['Awareness'], class: ['High']},
	{name: 'Calligraphy', trait: ['Intelligence'], class: ['High']},
	{name: 'Courtier', trait: ['Awareness'], class: ['High']},
	{name: 'Divination', trait: ['Intelligence'], class: ['High']},
	{name: 'Etiquette', trait: ['Awareness'], class: ['High']},
	{name: 'Investigation', trait: ['Perception'], class: ['High']},
	{name: 'Medicine', trait: ['Intelligence'], class: ['High']},
	{name: 'Meditation', trait: ['Void'], class: ['High']},
	{name: 'Sincerity', trait: ['Awareness'], class: ['High']},
	{name: 'Spellcraft', trait: ['Intelligence'], class: ['High']},
	{name: 'Tea Ceremony', trait: ['Void'], class: ['High']},
	{name: 'Athletics', trait: ['Strength'], class: ['Bugei']},
	{name: 'Battle', trait: ['Perception'], class: ['Bugei']},
	{name: 'Defense', trait: ['Reflexes'], class: ['Bugei']},
	{name: 'Horsemanship', trait: ['Agility'], class: ['Bugei']},
	{name: 'Hunting', trait: ['Perception'], class: ['Bugei']},
	{name: 'Iaijutsu', trait: ['Reflexes'], class: ['Bugei']},
	{name: 'Jiujutsu', trait: ['Agility'], class: ['Bugei']},
	{name: 'Chain Weapons', trait: ['Agility'], class: ['Bugei']},
	{name: 'Heavy Weapons', trait: ['Agility'], class: ['Bugei']},
	{name: 'Kenjutsu', trait: ['Agility'], class: ['Bugei']},
	{name: 'Knives', trait: ['Agility'], class: ['Bugei']},
	{name: 'Kyujutsu', trait: ['Reflexes'], class: ['Bugei']},
	{name: 'Ninjutsu', trait: ['Agility','Reflexes'], class: ['Bugei']},
	{name: 'Polearms', trait: ['Agility'], class: ['Bugei']},
	{name: 'Spears', trait: ['Agility'], class: ['Bugei']},
	{name: 'Staves', trait: ['Agility'], class: ['Bugei']},
	{name: 'War Fan', trait: ['Agility'], class: ['Bugei']},
	{name: 'Animal Handling', trait: ['Awareness'], class: ['Merchant']},
	{name: 'Commerce', trait: ['Intelligence'], class: ['Merchant']},
	{name: 'Engineering', trait: ['Intelligence'], class: ['Merchant']},
	{name: 'Sailing', trait: ['Agility','Intelligence'], class: ['Merchant']},
	{name: 'Forgery', trait: ['Agility'], class: ['Low']},
	{name: 'Intimidation', trait: ['Awareness'], class: ['Low']},
	{name: 'Sleight Of Hand', trait: ['Agility'], class: ['Low']},
	{name: 'Stealth', trait: ['Agility'], class: ['Low']},
	{name: 'Temptation', trait: ['Awareness'], class: ['Low']},
	{name: 'Artisan', trait: ['Awareness'], class: ['High', ' Macro']},
	{name: 'Games', trait: ['Various'], class: ['High', ' Macro']},
	{name: 'Lore', trait: ['Intelligence'], class: ['High', ' Macro']},
	{name: 'Perform', trait: ['Various'], class: ['High', ' Macro']},
	{name: 'Weapons', trait: ['Various'], class: ['Bugei', ' Macro']},
	{name: 'Craft', trait: ['Various'], class: ['Merchant', ' Macro']}
	]

const rings = [
    {name: "Air", traits: ["Awareness", "Reflexes"]},
    {name: "Earth", traits: ["Stamina", "Willpower"]},
    {name: "Fire", traits: ["Agility", "Intelligence"]},
    {name: "Water", traits: ["Perception", "Strength"]},
    {name: "Void", traits: ["Void"]}
]

function get_skills() {
	return skills;
}

function get_skill_names() {
	let skill;
	let skill_list = [];
	for (skill in skills) {
		skill_list.push(skill.name);
	}
	return skill_list;
}