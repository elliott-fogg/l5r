class Character {

	constructor() {
		this.rings = {
			air: 2,
			earth: 2,
			fire: 2,
			wind: 2,
			void: 2
		};

		this.attributes = {
			awareness: 2,
			reflexes: 2,
			stamina: 2,
			willpower: 2,
			agility: 2,
			intelligence: 2,
			perception: 2,
			strength: 2,
			void: 2
		};

		skills = this.get_default_skills();

	}

}


	{name: "Air", traits: ["Awareness", "Reflexes"]},
	{name: "Earth", traits: ["Stamina", "Willpower"]},
	{name: "Fire", traits: ["Agility", "Intelligence"]},
	{name: "Water", traits: ["Perception", "Strength"]},
	{name: "Void", traits: ["Void"]}