function main() {
	create_dice_roller("dice_roller_content");
	click_nav_button("navbar_dice_roller");
	document.getElementById("new_char_btn").onclick = function() {
		new Skill_Choices("character_creation_div");
	}

	var new_btn = document.getElementById("new_char_btn");
	new_btn.addEventListener("contextmenu", event => {
		event.preventDefault();
		console.log("Success");
	})

}