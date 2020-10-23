// Dice Rolling Function ///////////////////////////////////////////////////////

function roll_d10() {
	return Math.ceil(Math.random() * 10)
}

function roll_single(explode_on, emphasis) {
	let total = 0;
	let rand_value = roll_d10();
	let first_roll = true;
	let explode_range = false;

	// Determine if the roll explodes on a single or multiple values
	console.log(explode_on);
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

// Formatting //////////////////////////////////////////////////////////////////

function output_text(roll, keep, em, explode, description) {
	rolls = roll_multiple(roll, explode, em);

	// You cannot keep more dice than you roll, so limit keep to roll.
	// to dice_roll.
	if (keep > roll) {
		keep = roll;
	};

	let text_value = description + "<br>";
	text_value += "<br>Dice Rolled: " + String(rolls) + "<br>";
	text_value += "<br>Maximum roll: "+get_maximum_roll(rolls, keep);
	text_value += "<br>Minimum roll: "+get_minimum_roll(rolls, keep);
	return text_value;
};

// Manual Rolling //////////////////////////////////////////////////////////////

function manual_roll(roll_select_id, keep_select_id, explode_select_id,
                     emphasis_checkbox_id, output_text_id) {

	let roll = document.getElementById(roll_select_id).value;
	let keep = document.getElementById(keep_select_id).value;
	let explode = document.getElementById(explode_select_id).value;
	let em = document.getElementById(emphasis_checkbox_id).checked;
	let roll_text_output = document.getElementById(output_text_id);

	let first_line = `Rolling ${roll}k${keep}`;
	if (em) {
		first_line += " with emphasis";
	}

	roll_text_output.innerHTML = output_text(roll, keep, em, explode, first_line);
}

// Add options to Dice Select Boxes ////////////////////////////////////////////

function populate_dice_selectors(roll_select_id, keep_select_id, 
                                 explode_select_id, emphasis_checkbox_id, 
                                 roll_button_id, output_text_id) {

	var select_roll = document.getElementById(roll_select_id);
	for (let i = 1; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.label = `Roll ${i}`;
		select_roll.appendChild(option);
	}

	var select_keep = document.getElementById(keep_select_id);
	for (let i = 1; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.label = `Keep ${i}`;
		select_keep.appendChild(option);
	}

	var select_explode = document.getElementById(explode_select_id);

	let no_explode = document.createElement("option");
	no_explode.value = 0;
	no_explode.label = "Never Explode";
	select_explode.appendChild(no_explode);

	for (let i = 1; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = `${i}`;
		option.label = `Explode on ${i}`;
		option.selected = (i == 10) ? "selected" : null;
		select_explode.appendChild(option);
	}

	for (let i = 2; i <= 9; i++) {
		let option = document.createElement("option");
		option.value = `${i}t`;
		option.label = `Explode ${i} thru 10`;
		select_explode.appendChild(option);
	}

	let roll_btn = document.getElementById(roll_button_id);
	roll_btn.onclick = function() {manual_roll(roll_select_id, keep_select_id, 
												explode_select_id, 
												emphasis_checkbox_id,
												output_text_id);
	}
}

