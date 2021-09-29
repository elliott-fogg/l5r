class SpellRollerController {

	constructor() {
		// Create Objects
		this.FSL = new full_spell_list();
		this.DR = new DiceRollerController();
		this.spell_slots = new SpellSlotsController();
		this.DR.passfail = true;

		// Set onclick for spells
		this.FSL.set_spell_onclick(this.spell_clicked.bind(this));

		// Get Traits DOM elements
		this.air = document.getElementById("trait_air");
		this.earth = document.getElementById("trait_earth");
		this.fire = document.getElementById("trait_fire");
		this.water = document.getElementById("trait_water");
		this.void = document.getElementById("trait_void");
		this.affinity = document.getElementById("affinity_select");
		this.deficiency = document.getElementById("deficiency_select");
		this.school_rank = document.getElementById("school_rank");

		// Add onchange to all Traits DOM elements
		for (let dom_elem of ["air", "earth", "fire", "water", "void",
		     "affinity", "deficiency", "school_rank"]) {
			this[dom_elem].onchange = this.attribute_changed.bind(this);
		}

		// Get Display DOM elements
		this.dom_name = document.getElementById("current_spell-name");
		this.dom_keywords = document.getElementById("current_spell-keywords");
		this.dom_tn = document.getElementById("current_spell-tn");
		this.dom_element_level =
						document.getElementById("current_spell-element_level");
		this.dom_duration = document.getElementById("current_spell-duration");
		this.dom_range = document.getElementById("current_spell-range");
		this.dom_aoe = document.getElementById("current_spell-aoe");
		this.dom_description =
						document.getElementById("current_spell-description");
		this.dom_special = document.getElementById("current_spell-special");
		this.dom_raises = document.getElementById("current_spell-raises");

		// Set onclick for Dice Roller Reset button (not included in Dice Roller)
		this.dice_roller_reset = document.getElementById("reset_dice_roller");
		this.dice_roller_reset.onclick = this.reset_dice_roller.bind(this);

		// Bind enabling of Dice Roller Reset button when Dice Roller modified
		for (let dom_elem of ["roll_select", "keep_select", "explode_select",
		     "raise_select", "bonus_input", "emphasis"]) {
			this.DR[dom_elem].onchange = this.dice_roller_changed.bind(this);
		}

		this.load_attributes();
	}

	// Spell Display Functions /////////////////////////////////////////////////

	update_spell_display(spell_name) {
		var spell_info = window.DH.data.spells[spell_name];
		this.dom_name.innerHTML = spell_info["title"];
		this.dom_keywords.innerHTML = this.create_keywords_html(spell_info["keywords"]);
		this.dom_tn.innerHTML = 5 * parseInt(spell_info["mastery_level"]) + 5;
		this.dom_element_level.innerHTML = `${spell_info["element"]} ${spell_info["mastery_level"]}`;
		this.dom_duration.innerHTML = spell_info["duration"];
		this.dom_range.innerHTML = spell_info["range"];
		this.dom_aoe.innerHTML = spell_info["aoe"];
		this.dom_description.innerHTML = spell_info["description"];
		this.dom_description.scrollTop = 0;
		this.dom_raises.innerHTML = this.create_raises_html(spell_info["raises"]);
		this.dom_special.innerHTML = this.create_special_html(spell_info["special"]);
	}

	create_keywords_html(keywords_array) {
		console.log("KEYWORDS", keywords_array);
		if (keywords_array.length == 0) {
			return "<span class='note'>No Keywords</span>";
		} else {
			return keywords_array.join(", ");
		};
	}

	create_raises_html(raises_array) {
		console.log(raises_array);
		if (raises_array.length == 0) {
			return "<span class='note'>None</span>";
		} else {
			var html = "<ul>";
			for (let raise of raises_array) {
				html += `<li>${raise}</li>`;
			}
			html += "</ul>";
			return html;
		}
	}

	create_special_html(special_text) {
		console.log(special_text);
		if (special_text) {
			return special_text;
		} else {
			return "<span class='note'>None</span>";
		}
	}

	////////////////////////////////////////////////////////////////////////////

	spell_clicked() {
		this.update_spell_display(this.FSL.current_spell);
		this.reset_dice_roller();
	}

	dice_roller_changed() {
		// TODO: Actually calculate what the values are, and check for them.
		if (this.FSL.current_spell) {
			this.dice_roller_reset.disabled = false;
		}
	}

	reset_dice_roller() {
		var spell_info = window.DH.data.spells[this.FSL.current_spell];
		var spell_element = spell_info["element"].toLowerCase();
		var affinity = this.affinity.value;
		var deficiency = this.deficiency.value;
		var trait = parseInt(document.getElementById(`trait_${spell_element}`).value);
		var school_rank = parseInt(this.school_rank.value);
		this.dice_roller_reset.disabled = true;

		var base_tn = spell_info["mastery_level"] * 5 + 5;

		this.DR.base_tn = base_tn;

		console.log(`'${spell_element}', '${affinity}', '${deficiency}', '${trait}', '${school_rank}'`)

		var total_school_rank = school_rank;
		if (affinity == spell_element) {total_school_rank += 1};
		if (deficiency == spell_element) {total_school_rank -= 1};

		var dice_to_roll = total_school_rank + trait;
		var dice_to_keep = trait;

		this.DR.set_values(dice_to_roll, dice_to_keep);
	}

	attribute_changed() {
		this.save_attributes();
		this.update_spell_slots();
		if (this.FSL.current_spell){
			this.reset_dice_roller();
		}
	}

	update_spell_slots() {
		for (let e of ["air", "earth", "fire", "water", "void"]) {
			this.spell_slots.update_spell_slot_number(e, this[e].value);
		}
	}

	save_attributes() {
		var attributes = {};
		for (let name of ["air", "earth", "fire", "water", "void",
		     				"affinity", "deficiency", "school_rank"]) {
			attributes[name] = this[name].value;
		}
		localStorage["spell_roller_attributes"] = JSON.stringify(attributes);
	}

	load_attributes() {
		if (localStorage["spell_roller_attributes"]) {
			var attr = JSON.parse(localStorage["spell_roller_attributes"]);

			for (let elem of ["air", "earth", "fire", "water", "void",
			     				"school_rank"]) {
				this[elem].value = parseInt(attr[elem]);
			}

			for (let val of ["affinity", "deficiency"]) {
				var value = attr[val];
				if (value) {
					this[val].querySelector(`option[value='${value}']`).selected = true;
				}
			}
		}
	}
}