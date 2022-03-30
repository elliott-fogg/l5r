// Dice Rolling Function ///////////////////////////////////////////////////////

class DiceRollerBaseFunctions {
	roll_d10() {
		return Math.ceil(Math.random() * 10)
	}

	roll_dice(dice_to_roll, explode_range, has_emphasis) {
		var dice = [];
		var verbose_text = "";

		for (let i = 0; i < dice_to_roll; i++) {
			var die_roll = this.roll_d10();
			verbose_text += `*Rolled a ${die_roll}. `;

			// On first roll for each die, check for reroll due to Emphasis
			if (has_emphasis && die_roll == 1) {
				die_roll = this.roll_d10();
				verbose_text += `Rolled a 1. Rerolling for emphasis. `;
			}
			var total = die_roll;

			// Explode die roll continuously as long as new value is within explode_range
			while (explode_range.includes(die_roll)) {
				verbose_text += `Exploding (${die_roll}). `;
				die_roll = this.roll_d10();
				total += die_roll;
				verbose_text += `New die adds ${die_roll} and becomes ${total}. `;
			}

			dice.push(total);
			verbose_text += "<br>";
		}

		return {"rolls": dice.sort((a,b) => b-a), "verbose": verbose_text}
	}
}

class DiceRollerController extends DiceRollerBaseFunctions {

	constructor() {
		super();
		this.roll_select = document.getElementById("diceroller_roll_select");
		this.keep_select = document.getElementById("diceroller_keep_select");
		this.explode_select = document.getElementById("diceroller_explode_select");
		this.raise_select = document.getElementById("diceroller_raise_select");
		this.bonus_input = document.getElementById("diceroller_bonus_input");
		this.emphasis = document.getElementById("diceroller_emphasis_checkbox");
		this.verbose = document.getElementById("diceroller_verbose_checkbox");
		this.roll_button = document.getElementById("diceroller_roll_button");
		this.roll_output = document.getElementById("diceroller_output");

		this.roll_select.onchange = this.on_input_change.bind(this, "roll");
		this.keep_select.onchange = this.on_input_change.bind(this, "keep");
		this.explode_select.onchange = this.on_input_change.bind(this, null);
		this.emphasis.onchange = this.on_input_change.bind(this, null);

		this.base_tn = 0;

		this.roll_button.onclick = function() {
			this.perform_roll();
		}.bind(this);
	}

	perform_roll() {
		var [roll, keep, explode, raise, emphasis, verbose] = this.get_roll_input();
		var roll_result = this.roll_dice(roll, explode, emphasis);

		var roll_text = this.create_roll_text(roll_result["rolls"], keep, raise);

		if (verbose) {
			roll_text += `<br>${roll_result["verbose"]}`;
		}
		this.roll_output.innerHTML = roll_text;
	}

	get_roll_input() {
		var roll = this.roll_select.value;
		var keep = this.keep_select.value;
		var explode_text = this.explode_select.value;
		var explode_range = this.get_explode_range(explode_text);
		var raise = this.raise_select.value;
		var bonus = this.bonus_input.value;
		var emphasis = this.emphasis.checked;
		var verbose = this.verbose.checked;

		return [roll, keep, explode_range, raise, emphasis, verbose];
	}

	create_roll_text(dice_result, dice_to_keep, raise_count) {
		var max_result = dice_result.slice(0, dice_to_keep).reduce((a,b) => a+b, 0);
		var final_tn = this.base_tn + raise_count * 5;
		var final_result = max_result - final_tn;

		var output_text;
		if (this.base_tn > 0) {
			// Contested (e.g. Spell) roll
			var outcome_word = (final_result >= 0) ? "SUCCESS" : "FAIL";
			output_text = `${outcome_word}: <b>${max_result}</b>`;

			output_text += `<br>TN: ${final_tn}`;
			if (raise_count > 0) {
				output_text += ` (${this.base_tn} + ${raise_count} raise${(raise_count > 1) ? "s" : ""})`;
			}
		}

		else {
			output_text = `Roll: <b>${final_result}</b>`;

			if (raise_count > 0) {
				output_text += ` (${max_result} - ${raise_count} raise${(raise_count > 1) ? "s" : ""})`;
			}
		}

		output_text += `<br>Dice: (${dice_result.join(", ")})`;

		return output_text;
	}

	check_overflow(roll, keep) {
		if (roll <= 10) {
			return [roll, keep, 0]
		}

		while (roll >= 12 && keep < 10) {
			roll -= 2;
			keep += 1;
		}

		if (keep == 10) {
			var bonus = (roll - 10 + keep - 10) * 2
			return [10, 10, bonus]

		} else {
			return [10, keep, 0]
		}
	}

	set_values(roll, keep) {
		var [new_roll, new_keep, bonus] = this.check_overflow(roll, keep);
		this.roll_select.querySelector(`option[value='${new_roll}'`).selected = true;
		this.keep_select.querySelector(`option[value='${new_keep}'`).selected = true;
		this.bonus_input.value = bonus;
		this.explode_select.querySelector(`option[value='10']`).selected = true;
		this.raise_select.querySelector(`option[value='0']`).selected = true;
		this.emphasis.checked = false;
	}

	get_explode_range(explode_on) {
		if (typeof explode_on == "int") {return [explode_on]}

		if (explode_on.includes("t")) {
			// We're exploding on a range of values
			var min_explode = parseInt(explode_on.substring(0,1));
			if (min_explode <= 1) {
				console.warn("Attempting to explode on all numbers.")
				return [10];
			}
			var explode_array = [];
			for (let i = min_explode; i <= 10; i++) {
				explode_array.push(i);
			}
			return explode_array;
		}

		// explode_on is presumed a string representation of an integer
		return [parseInt(explode_on)];
	}

	add_roll_history(roll_history_id, roll_info) {
		var roll_history = document.getElementById(roll_history_id);
		var title = roll_info["title"];
		var rolls = roll_info["rolls"];
		var total = roll_info["total"];

		let roll_text = `${title}: ${total} (${rolls.join(", ")})<br>`
		roll_history.insertAdjacentHTML("afterbegin", roll_text)
	}

	clear_roll_history(roll_history_id) {
		var roll_history = document.getElementById(roll_history_id);
		roll_history.innerHTML = "";
	}

	on_input_change(change_id) {
		var [roll, keep, x_range, _, emphasis, _] = this.get_roll_input();

		if (parseInt(roll) < parseInt(keep)) {
			if (change_id == "roll") {
				this.keep_select.querySelector(`option[value='${roll}'`).selected = true;
			} else if (change_id == "keep") {
				this.roll_select.querySelector(`option[value='${keep}'`).selected = true;
			}
		}
	}

// End Class

}
