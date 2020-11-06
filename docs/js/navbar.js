function click_nav_button(button_id) {
	// Set active button
	for (let btn of document.getElementsByClassName("navbar_button")) {
		btn.classList.remove("active");
	}
	document.getElementById(button_id).classList.toggle("active");

	// Set active divs
	for (let div of document.getElementsByClassName("toplevel-div")) {
		div.classList.remove("active");
	}

	let active_div;
	switch(button_id) {
		case "navbar_instructions":
			active_div = document.getElementById("instructions_div");
			break;
		case "navbar_dice_roller":
			active_div = document.getElementById("dice_roller_div");
			break;
		case "navbar_skills":
			active_div = document.getElementById("skills_div");
			break;
		case "navbar_combat":
			active_div = document.getElementById("combat_div");
			break;
		case "navbar_spells":
			active_div = document.getElementById("spells_div");
			break;
		case "navbar_custom":
			active_div = document.getElementById("custom_additions_div");
			break;
		default:
			console.log("nav_button pressed: " + button_id)
			return;
	}

	active_div.classList.add("active");
}