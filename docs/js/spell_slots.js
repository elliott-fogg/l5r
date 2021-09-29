class SpellSlotsController {

	constructor() {

		// Bind Reset Spell Slots button
		this.rest_button = document.getElementById("spell_slots_rest");
		this.rest_button.onclick = this.refill_all_spell.bind(this);

		// Get all Spell Slots names and divs as properties
		this.spell_slots = {};
		for (let element of ["air", "earth", "fire", "water", "void"]) {
			this.spell_slots[element] = {
				"slots": 2,
				"remaining": 2
			};

			this[`label_${element}`] = document.getElementsByClassName(`spellslots_name ${element}`)[0];
			this[`label_${element}`].onclick = this.use_spell_slot.bind(this, element);

			// let dom_cell_elem = document.getElementsByClassName(`spellslots_cell ${element}`);
			// // dom_cell_elem.onclick = this.use_spell_slot;
		}

		this.load_spell_slots();

		this.redraw_all_spell_slots();
	}

	load_spell_slots() {
		if (localStorage["spellslots"]) {
			this.spell_slots = JSON.parse(localStorage["spellslots"]);
		}
	}

	save_spell_slots() {
		localStorage["spellslots"] = JSON.stringify(this.spell_slots);
	}

	use_spell_slot(element) {
		if (this.spell_slots[element]["remaining"] > 0) {
			this.spell_slots[element]["remaining"] -= 1;
			this.redraw_all_spell_slots();
		}
		this.save_spell_slots();
	}

	redraw_all_spell_slots() {
		for (let element of ["air", "earth", "fire", "water", "void"]) {
			let num_slots = this.spell_slots[element]["slots"];
			let remaining = this.spell_slots[element]["remaining"];
			this.redraw_spell_slot(element, num_slots, remaining);
		}
	}

	redraw_spell_slot(element, num_slots, num_filled) {
		let elem = document.getElementsByClassName(`spellslots_cell ${element}`)[0];
		elem.innerHTML = "";
		for (let i=0; i<num_slots; i++) {
			let notch = document.createElement("div");
			notch.classList.add("spellslot");
			notch.classList.add(element);
			if (i < num_filled) {
				notch.classList.add("filled");
			}
			notch.dataset.notch_num = i;
			elem.appendChild(notch);
		}
	}

	update_spell_slot_number(element, new_number) {
		this.spell_slots[element]["slots"] = new_number;
		this.spell_slots[element]["remaining"] = new_number;
		this.redraw_all_spell_slots();
		this.save_spell_slots();
	}

	refill_all_spell() {
		for (let element of ["air", "earth", "fire", "water", "void"]) {
			this.spell_slots[element]["remaining"] = 
										this.spell_slots[element]["slots"];
		}
		this.redraw_all_spell_slots();
		this.save_spell_slots();
	}
}