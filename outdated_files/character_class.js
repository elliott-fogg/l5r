class Character {

	constructor() {
		this.setup_traits();
		this.setup_skills();
	}

	setup_traits() {
		this.traits = {
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
	};

	setup_skills() {
		this.skills = {};
		skill_data = get_skills();
		skill_data.forEach(skill => {
			let char_skill = {};
			char_skill.name = skill.name;
			char_skill.rank = 0;
			char_skill.trait = skill.trait;
			char_skill.class = skill.class;
			char_skill.emphases = [];
			this.skills.push(char_skill); 
		})
	};

	display_skills() {
		this.skills.forEach(skill => {
			let cell_list = [];
			// Order is Name, Rank, Trait, Roll, Emphasis, Classes?
			// Add Name and Rank
			cell_list.push(skill.name, skill.rank);
			// Add corresponding trait (or more, if there are multiple)
			if (skill.trait.length > 1) {
				cell_list.push(skill.trait[0])}
			else {
				let trait_text = skill.trait[0];
				for (let i = 1; i < skill.trait.length; i++) {
					trait_text += "\\" + skill.trait[i];
				};};
			// Calculate the roll

		});
	}

	calculate_skill_roll(skill_name) {
		let skill = this.skills[skill_name];
		let rank = skill.rank;

		let trait = skill.trait;
		let max_trait_score = 0;
		trait.forEach(trait => {
			trait_score = this.traits[trait];
			if (trait_score > max_trait_score) {
				max_trait_score = trait_score;
			}
		})

		dice_roll = rank + max_trait_score;
		return String(dice_roll) + "k" + String(max_trait_score);
	}

	calculate_ring(ring) {
		if (ring=="air") {return this.awareness + this.reflexes;}
		else if (ring=="earth") {return this.stamina + this.willpower;}
		else if (ring=="fire") {return this.agility + this.intelligence;}
		else if (ring=="water") {return this.perception + this.strength;}
		else if (ring=="void") {return this.void;};
	};

}

