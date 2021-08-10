function show_spells_of_element(element) {
	var all_elements = ["Air", "Earth", "Fire", "Water", "Void"];
	if (!all_elements.contains(element)) {
		console.error(`'${element}' is not a valid element. Cannot load.`);
		return;
	}

	for (let e of all_elements) {
		let container = document.getElementById(`${e}-spells-content`);

		if (e == element) {
			container.style.display = "block";
		} else {
			container.style.display = "none";
		}
	}
}