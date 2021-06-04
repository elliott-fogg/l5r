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
		console.groupEnd();
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

	console.groupEnd();
}

function all_spells_change_page(event) {

	var all_spells_tabs = document.querySelectorAll(".all_spells_tab");
	for (let tab of all_spells_tabs) {
		tab.classList.remove("active");
	}

	event.target.classList.add("active");
	var selected_page = event.target.innerHTML;

	console.log("Selected All Spells page", selected_page);

	for (let page_name of ["Air", "Earth", "Fire", "Water", "Void"]) {
		let elem = document.getElementById(`${page_name}-spells-content`);
		elem.classList.remove("active");
	}
	var select_elem = document.getElementById(`${selected_page}-spells-content`);
	select_elem.classList.add("active");
}

function refresh_full_spell_list() {

	// Need to add in some modifications from input
	console.log("REFRESHING ALL SPELLS");
    var spells = {
        "Air": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Earth": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Fire": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Water": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
        "Void": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]}
    }

    // Split Spells up into Elements
    for (let spell_name in window.DH.data.spells) {
        let spell_info = window.DH.data.spells[spell_name];
        spells[spell_info.element][spell_info.mastery_level].push(spell_info);
    }

    // Sort spells within each element
    for (let element in spells) {

    	for (let level in spells[element]) {
    		var content_div = document.getElementById(`${element}-${level}-spells-content`);
    		content_div.innerHTML = "";

    		for (let spell of spells[element][level]) {
    			content_div.appendChild(create_spell_collapsible(spell));
    		}

            // var content_div = document.getElementById(`all_spells_${element}_${level}_contents`);
            // content_div.innerHTML = "";

            // let container_id = `all_spells_${element}_${level}_container`;

            // // Iterate through spells
            // for (let spell of spells[element][level]) {

            //     let spell_add = document.createElement("input");
            //     spell_add.type = "button";
            //     spell_add.value = "Add";

            //     // Onclick goes here

            //     var spell_div = create_spell_collapsible(spell,
            //                                                 spell_add);
            //     content_div.appendChild(spell_div);
            // }
        }
    }
}