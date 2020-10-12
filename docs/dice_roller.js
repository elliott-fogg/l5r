function roll_d10() {
	return Math.ceil(Math.random() * 10)
}

function roll_single(explode_on, emphasis) {
	let total = 0;
	let rand_value = roll_d10();
	let first_roll = true;
	let explode_range = false;

	// Determine if the roll explodes on a single or multiple values
	if (explode_on.includes("t")) {
		explode_range = true;
		explode_on = parseInt(explode_on.substring(0,1))
	}

	// Get the value of the roll
	while (true) {
		// If emphasis, reroll any 1s (just once)
		if (first_roll && emphasis && rand_value == 1) {
			rand_value = roll_d10();
			first_roll = false;
			continue;
		}

		// If the die explodes, add the current value and roll again
		if ( (explode_range && rand_value >= explode_on) || rand_value == explode_on) {
			total += rand_value;
			rand_value = roll_d10();
			continue;
		}

		// No more explosions. Add remaining dice value and exit loop
		total += rand_value;
		break;
	}

	return total;
}

function roll_multiple(dice_roll, explode_on, emphasis) {
	let rolls = [];
	for (let i=0; i < dice_roll; i++) {
		rolls.push(roll_single(explode_on, emphasis))
	}

	rolls.sort(function(a,b){return b - a});

	return rolls;
}

function get_maximum_roll(rolls, dice_keep) {
	let total = 0;
	for (let i = 0; i < dice_keep; i++) {
		total += rolls[i];
	}
	return total;
}

function get_minimum_roll(rolls, dice_keep) {
	let total = 0;
	let array_length = rolls.length;
	for (let i = 0; i < dice_keep; i++) {
		let reverse_i = rolls.length - i - 1;
		total += rolls[reverse_i];
	}
	return total
}

function output_text(dice_roll, dice_keep, emphasis, explode_on) {4
	rolls = roll_multiple(dice_roll, explode_on, emphasis);

	// You cannot keep more dice than you roll, so limit dice_keep
	// to dice_roll.
	if (dice_keep > dice_roll) {
		dice_keep = dice_roll;
	};

	let text_value = "L5R Dice Roller:\n";
	text_value += `Rolling ${dice_roll}k${dice_keep}`;
	if (emphasis) {
		text_value += " with emphasis";
	}

	text_value += "\nDice Rolled: " + String(rolls);
	text_value += "\nMaximum roll: "+get_maximum_roll(rolls, dice_keep);
	text_value += "\nMinimum roll: "+get_minimum_roll(rolls, dice_keep);
	return text_value;
}

