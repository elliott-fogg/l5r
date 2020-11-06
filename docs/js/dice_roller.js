const dice_roll_id = "dice_to_roll";
const dice_keep_id = "dice_to_keep";
const explode_on_id = "explode_on";
const raises_id = "called_raises";
const has_emphasis_id = "emphasis_checkbox";
const verbose_id = "verbose_checkbox";
const roll_button_id = "roll_dice_button";
const roll_output_id = "roll_output_textbox";
const roll_history_id = "roll_history_textbox";
const clear_history_button_id = "clear_roll_history";

// Dice Rolling Function ///////////////////////////////////////////////////////

function roll_d10() {
	return Math.ceil(Math.random() * 10)
}

function get_explode_range(explode_on) {
	if (typeof explode_on == "int") {return [explode_on];}

	if (explode_on.includes("t")) {
		// We're exploding on a range of values
		var min_explode = parseInt(explode_on.substring(0,1));
		var explode_array = [];
		for (let i = min_explode; i <= 10; i++) {
			explode_array.push(i);
		}
		return explode_array;
	}

	// explode_on is presumed a string representation of an integer
	return [parseInt(explode_on)];
}

function roll_dice(dice_to_roll, explode_range, has_emphasis) {
	var dice = [];
	var verbose_text = "";

	
	
	for (let i = 0; i < dice_to_roll; i++) {
		var die_roll = roll_d10();
		verbose_text += `*Rolled a ${die_roll}. `

		// On first roll for each die, check for reroll due to Emphasis
		if (die_roll == 1) {
			die_roll = roll_d10();
			verbose_text += `Rerolling due to emphasis. Rolled a ${die_roll}. `
		}
		var total = die_roll;

		// Explode die roll continuously as long as new value is within explode_range
		while (explode_range.includes(die_roll)) {
			verbose_text += `Exploding (${die_roll}). `
			die_roll = roll_d10();
			total += die_roll;
			verbose_text += `New die adds ${die_roll} and becomes ${total}. `
		}

		dice.push(total);
		verbose_text += "<br>"
	}

	return {"rolls": dice.sort((a,b) => b-a), "verbose": verbose_text}
}

function get_roll_info(roll_type, dice_roll, dice_keep, has_emphasis=false,
                       explode_on=10, raises=0, verbose=false) {
	
	var explode_range = get_explode_range(explode_on);
	var roll_info = roll_dice(dice_roll, explode_range, has_emphasis);
	var rolls = roll_info["rolls"];
	var verbose_text = `Rolling ${dice_roll}k${dice_keep}` +
		((has_emphasis) ? ` with emphasis. ` : ". ") + 
		`Called ${raises} raise(s). ` + 
		`The dice explode on ${explode_range}. Highest dice are kept.<br><br>` 
		+ roll_info["verbose"];

	// You cannot keep more dice than you roll, so limit 'dice_keep' to the 
	// 'dice_roll' value;
	dice_keep = Math.min(dice_keep, dice_roll);

	// Determine the highest roll
	var highest_roll = 0;
	for (let i = 0; i < dice_keep; i++) {
		highest_roll += rolls[i]
	}

	// Subtract Raises
	var raise_penalty = raises * 5;

	// Determine Total Roll Score
	var total = highest_roll - raise_penalty;

	// Create roll title
	var roll_title = `<span class="roll_text">${dice_roll}k${dice_keep}</span>`;
	var emphasis_title = "<span class='emphasis_text'>Emphasis</span>";
	var raises_title = `<span class='raises_text'>${raises} Raise` +
					((raises == 1) ? "" : "s") + "</span>";

	var full_title = `${roll_type} ${roll_title}`
	if (has_emphasis) {
		full_title += ` (${emphasis_title}`;
		if (raises > 0) {
			full_title += ` & ${raises_title})`;
		} else {
			full_title += ")";
		}
	} else if (raises > 0) {
		full_title += ` (${raises_title})`;
	}

	var output = `Rolling ${full_title}:<br>`;
	output += `<br>Dice Rolled: ${rolls.join(", ")}<br>`;
	output += `<br>Max Total: ${total}<br>`;

	if (raises > 0) {
		output += `(Rolled ${highest_roll}, -${raise_penalty} for ${raises} raises = 
		${total})<br>`;
	}

	if (verbose) {output += "<br>Verbose:<br>" + verbose_text;}

	return {"rolls": rolls, "total": total, "text": output, 
			"verbose": verbose_text, "title": full_title}
}

function add_roll_history(roll_history_id, roll_info) {
	var roll_history = document.getElementById(roll_history_id);
	var title = roll_info["title"];
	var rolls = roll_info["rolls"];
	var total = roll_info["total"];

	let roll_text = `${title}: ${total} (${rolls.join(", ")})<br>`
	roll_history.insertAdjacentHTML("afterbegin", roll_text)
}

function clear_roll_history(roll_history_id) {
	var roll_history = document.getElementById(roll_history_id);
	roll_history.innerHTML = "";
}

// Formatting //////////////////////////////////////////////////////////////////

function manual_roll() {
	var dice_roll = document.getElementById(dice_roll_id).value;
	var dice_keep = document.getElementById(dice_keep_id).value;
	var explode_on = document.getElementById(explode_on_id).value;
	var raises = document.getElementById(raises_id).value;
	var has_emphasis = document.getElementById(has_emphasis_id).checked;
	var verbose = document.getElementById(verbose_id).checked;
	var roll_output = document.getElementById(roll_output_id);

	var roll_title = "";

	var roll_info = get_roll_info(roll_title, dice_roll, dice_keep, 
	                              has_emphasis, explode_on, raises, 
	                              verbose)

	roll_output.innerHTML = roll_info["text"];
	add_roll_history(roll_history_id, roll_info)
}

////////////////////////////////////////////////////////////////////////////////

function get_roll_text(roll_title, dice_roll, dice_keep,
                       has_emphasis=false, explode_on="10") {

	rolls = roll_multiple(dice_roll, explode_on, has_emphasis);

	// You cannot keep more dice than you roll, so limit dice_keep to dice_roll.
	if (dice_keep > dice_roll) {dice_keep = dice_roll};

	let max_roll = get_maximum_roll(rolls, dice_keep);
	let min_roll = get_minimum_roll(rolls, dice_keep);

	// Construct full title of the roll
	var full_title = `${roll_title} (<span class="text_h1">` +
		`${dice_roll}k${dice_keep}</span>)`;

	var output = `Rolling ${full_title}:<br>`;
	output += `<br>Dice Rolled: ${rolls.join(", ")}<br>`;
	output += `<br>Maximum Roll: <span class="text_h1">${max_roll}</span>`;
	output += `<br>Minimum Roll: ${min_roll}`;

	var roll_history = document.getElementById("dice_roll_history");
	let roll_history_text = `${full_title}: ${max_roll}<br>`
	roll_history.insertAdjacentHTML("afterbegin", roll_history_text)

	return output;
}

// Add options to Dice Select Boxes ////////////////////////////////////////////

function create_controls() {
	var d = document.createElement("div");

	// Dice To Roll 
	let select_roll = document.createElement("select");
	select_roll.className = "red_round_rectangle";
	select_roll.id = dice_roll_id;
	for (let i = 1; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.label = `Roll ${i}`;
		select_roll.appendChild(option);
	}
	d.appendChild(select_roll);

	// Dice To Keep
	let select_keep = document.createElement("select");
	select_keep.className = "red_round_rectangle";
	select_keep.id = dice_keep_id;
	for (let i = 1; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.label = `Keep ${i}`;
		select_keep.appendChild(option);
	}
	d.appendChild(select_keep);

	d.appendChild(document.createElement("br"));

	// Explode-On Values
	let select_explode = document.createElement("select");
	select_explode.className = "red_round_rectangle";
	select_explode.id = explode_on_id;

	let no_explode = document.createElement("option");
	no_explode.value = 0;
	no_explode.label = "Never Explode";
	select_explode.appendChild(no_explode);

	for (let i = 1; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = `${i}`;
		option.label = `Explode on ${i}`
		option.selected = (i == 10) ? "selected" : null;
		select_explode.appendChild(option);
	}

	for (let i = 2; i <= 9; i++) {
		let option = document.createElement("option");
		option.value = `${i}t`;
		option.label = `Explode ${i} thru 10`;
		select_explode.appendChild(option);
	}
	d.appendChild(select_explode);

	d.appendChild(document.createElement("br"));

	// Called Raises
	let select_raises = document.createElement("select");
	select_raises.className = "red_round_rectangle";
	select_raises.id = raises_id;
	for (let i = 0; i <= 10; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.label = (i == 0) ? "No Called Raises" : `${i} Called Raises`;
		select_raises.appendChild(option);
	}
	d.appendChild(select_raises)

	d.appendChild(document.createElement("br"));

	// Has-Emphasis Checkbox
	let emphasis_label = document.createElement("label");
	emphasis_label.innerHTML = "Emphasis:";
	emphasis_label.for = has_emphasis_id;
	let emphasis_checkbox = document.createElement("input");
	emphasis_checkbox.type = "checkbox";
	emphasis_checkbox.id = has_emphasis_id;
	d.appendChild(emphasis_label);
	d.appendChild(emphasis_checkbox);

	d.appendChild(document.createElement("br"));

	// Verbose Output Checkbox
	let verbose_label = document.createElement("label");
	verbose_label.innerHTML = "Verbose Output:";
	verbose_label.for = verbose_id;
	let verbose_checkbox = document.createElement("input");
	verbose_checkbox.type = "checkbox";
	verbose_checkbox.id = verbose_id;
	d.appendChild(verbose_label);
	d.appendChild(verbose_checkbox);

	d.appendChild(document.createElement("br"));

	// Roll-Dice Button
	let roll_button = document.createElement("input");
	roll_button.type = "button";
	roll_button.className = "red_round_rectangle";
	roll_button.id = roll_button_id;
	roll_button.value = "Roll!"
	roll_button.onclick = manual_roll;
	d.append(roll_button)

	return d;
}

function create_output() {
	var d = document.createElement("d");
	var output_textbox = document.createElement("p");
	output_textbox.id = roll_output_id;
	output_textbox.className = "dice_roll_output";
	d.appendChild(output_textbox);
	return d;
}

function create_history() {
	var d = document.createElement("d");

	var header_div = document.createElement("div");
	header_div.id = "roll_history_header";
	
	var header_title = document.createElement("p");
	header_title.innerHTML = "Roll History:";
	header_title.id = "title_with_button";
	header_title.style = "display: inline";

	var clear_history_button = document.createElement("input");
	clear_history_button.type = "button";
	clear_history_button.value = "Clear";
	clear_history_button.style = "float: right";
	clear_history_button.onclick = function() {clear_roll_history(
														roll_history_id)};

	header_div.appendChild(header_title);
	header_div.appendChild(clear_history_button);
	d.appendChild(header_div);

	var history_box = document.createElement("p");
	history_box.id = roll_history_id;
	history_box.className = "dice_roll_history";
	d.appendChild(history_box);

	return d;
}

function create_dice_roller(id_to_replace) {
	var div_to_replace = document.getElementById(id_to_replace)
	var new_div = document.createElement("div");
	new_div.id = id_to_replace;

	var table = document.createElement("table");
	var row = table.insertRow(-1);
	row.insertCell(-1).appendChild(create_controls());
	row.insertCell(-1).appendChild(create_output());
	row.insertCell(-1).appendChild(create_history());
	new_div.appendChild(table);

	div_to_replace.replaceWith(new_div);
}

