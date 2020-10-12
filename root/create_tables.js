const rings = [
	{name: "Air", traits: ["Awareness", "Reflexes"]},
	{name: "Earth", traits: ["Stamina", "Willpower"]},
	{name: "Fire", traits: ["Agility", "Intelligence"]},
	{name: "Water", traits: ["Perception", "Strength"]},
	{name: "Void", traits: ["Void"]}
];

function create_ring_table(table_id) {
	const table = document.getElementById(table_id);
	let header = table.createTHead();
	let header_row = header.insertRow(0);
	
	var headings = ["Ring", "Trait", "Level"];
	for (let i = 0; i < headings.length; i++) {
		let cell = header_row.insertCell(i);
		cell.innerHTML = `<b><u>${headings[i]}</u></b>`;
	}

	let tbdy = table.createTBody();

	rings.forEach( ring => {
		let first = true;
		ring.traits.forEach( trait => {
			let row = tbdy.insertRow(-1);
			if (first) {
				let ring_type = row.insertCell(0);
				ring_type.rowSpan = ring.traits.length;
				ring_type.innerHTML = `<b>${ring.name}</b>`;
				first = false;
			};
			trait_name = row.insertCell();
			trait_name.innerHTML = trait;
			trait_level = row.insertCell();
			trait_level.innerHTML = 2;
			var btn_inc = document.createElement("input");
			btn_inc.type = "button";
			btn_inc.className = "inc_dec_btn";
			btn_inc.value = "+";
			row.appendChild(btn_inc);
			var btn_dec = document.createElement("input");
			btn_dec.type = "button";
			btn_dec.className = "inc_dec_btn";
			btn_dec.value = "-";
			row.appendChild(btn_dec);
		});
	});
}