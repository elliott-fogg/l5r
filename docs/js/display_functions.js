// Trait Tables ////////////////////////////////////////////////////////////////
function update_trait_table(ring_dict) {

	for (let ring in ring_dict) {

		let ring_rank = Infinity;

		for (let trait in ring_dict[ring]) {
			let trait_info = ring_dict[ring][trait];
			let value_id = `${trait}_trait_rank`;
			document.getElementById(value_id).innerHTML = trait_info.value;

			if (trait_info.increment) {
				var inc_cell = document.getElementById(`${trait}_inc`);
				inc_cell.innerHTML = "";
				let icon = document.createElement("img");
				icon.src = "images/plus.svg";
				icon.height = 14;
				icon.onclick = trait_info.increment.function;
				inc_cell.appendChild(icon);
			}

			if (trait_info.decrement) {
				var dec_cell = document.getElementById(`${trait}_dec`);
				dec_cell.innerHTML = "";
				let icon = document.createElement("img");
				icon.src = "images/minus.svg";
				icon.height = 14;
				icon.onclick = trait_info.decrement.function;
				dec_cell.appendChild(icon);
			}

			ring_rank = Math.min(trait_info.value, ring_rank);
		}

		let ring_rank_id = `${ring}_ring_rank`;
		document.getElementById(ring_rank_id).innerHTML = ring_rank;
	}
}


function update_skill_table(skills_dict) {
	console.groupCollapsed("Updating Skills Table");
	console.log(skills_dict);

	var skill_table = document.getElementById("skill_table");

	// Set THead
	thead = skill_table.querySelector("thead");
	thead.innerHTML = "";

	let headings = ["Skill", "Rank", "Trait", "Roll", "Emphases"];
	if (mastery_abilities) {
		headings.push("Mastery Abilities");
	}

	let thead_row = document.createElement("tr");
	for (let heading of headings) {
		let cell = document.createElement("td");
		cell.innerHTML = heading;
		thead_row.appendChild(cell);
	}
	thead.appendChild(thead_row);

	// Set TBody
	var tbody = document.getElementById("skill_tbody");
	skill_tbody.innerHTML = "";

	if (Object.keys(skills_dict).length == 0) {

	}

	if (skills_dict.length == 0) {
		skill_tbody.innerHTML = "<tr><td class='note' colspan='3'>None</td></tr>";
		return;
	}

	for (let skill_name in skills_dict) {
		let skill_info = skills_dict[skill_name];
		console.log(skill_info);
		let row = document.createElement("tr");

		let name_cell = document.createElement("td");
		name_cell.innerHTML = skill_name;
		row.appendChild(name_cell);

		let rank_cell = document.createElement("td");
		rank_cell.innerHTML = skill_info.rank;
		row.appendChild(rank_cell);

		let trait_cell = document.createElement("td");
		trait_cell.innerHTML = skill_info.trait;
		row.appendChild(trait_cell);

		let roll_cell = document.createElement("td");
		roll_cell.innerHTML = skill_info.roll;
		row.appendChild(roll_cell);

		let emphases_cell = document.createElement("td");
		emphases_cell.innerHTML = skill_info.emphases;
		row.appendChild(emphases_cell);

		let ma_cell = document.createElement("td");
		ma_cell.innerHTML = skill_info.mastery_abilities;
		row.appendChild(ma_cell);

		tbody.appendChild(row);
	}
}




