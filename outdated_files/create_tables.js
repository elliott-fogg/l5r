const rings = [
	{name: "Air", traits: ["Awareness", "Reflexes"]},
	{name: "Earth", traits: ["Stamina", "Willpower"]},
	{name: "Fire", traits: ["Agility", "Intelligence"]},
	{name: "Water", traits: ["Perception", "Strength"]},
	{name: "Void", traits: ["Void"]}
];

function append_btn_inc(row, button_symbol) {
	var btn_inc = document.createElement("input");
	btn_inc.type = "button";
	btn_inc.className = "inc_dec_btn";
	btn_inc.value = "-";
	row.appendChild(btn_inc);
}

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

function create_skill_table(table_id) {
	const table = document.getElementById(table_id);
	let header = table.createTHead();
	let header_row = header.insertRow(0);

	let headings = ["Skill", "Rank", "Trait", "Roll", "Emphases", "Class(es)"];
	headings.forEach( h => {
		let cell = header_row.insertCell();
		cell.innerHTML = `<b><u>${h}</u></b>`;
	});

	let tbdy = table.createTBody();

	skill_data = get_skills();

	skill_data.forEach( skill => {
		let row = tbdy.insertRow(-1);
		// Name
		row.insertCell(-1).innerHTML = `<b>${skill.name}</b>`;
		// Rank
		row.insertCell(-1).innerHTML = 3;
		// Trait
		row.insertCell(-1).innerHTML = skill.trait;
		// Roll
		row.insertCell(-1).innerHTML = "2k3";
		// Emphases
		row.insertCell(-1).innerHTML = "";
		// Classes
		row.insertCell(-1).innerHTML = skill.class;
	});
}
