function create_full_spell_list() {
    var all_spells_div = document.getElementById("all_spells");
    all_spells_div.innerHTML = "";
    for (let element of ["Air", "Earth", "Fire", "Water", "Void"]) {
        var element_contents = [];
        for (let level of [1, 2, 3, 4, 5, 6]) {
            var level_spells = document.createElement("div");
            level_spells.id = `all_spells_${element}_${level}_contents`;
            var level_div = create_collapsible_div(`Level ${level}`,
                                                   [level_spells],
                                                   "closed");
            level_div.id = `all_spells_${element}_${level}_container`;
            element_contents.push(level_div);
        }
        var element_div = create_collapsible_div(element, element_contents,
                                                 "closed");
        element_div.id = `all_spells_${element}_container`;
        all_spells_div.appendChild(element_div);
    }
}

// function create_spell_collapsible(spell) {
//     var spell_name = spell.title;
//     if (spell.keywords.length > 0) {
//         spell_name += ` (${spell.keywords.join(", ")})`;
//     }
//     var summary = document.createElement("summary");
//     summary.innerHTML = spell_name;

//     var content = document.createElement("div");
//     var spell_details = document.createElement("p");
//     spell_details.innerHTML = `<span class="b">Range:</span> ${spell.range}<br>
//                                 <span class="b">Area of Effect:</span> ${spell.aoe}<br>
//                                 <span class="b">Duration:</span> ${spell.duration}<br>`
//     content.appendChild(spell_details);

//     if (spell.raises && spell.raises.length > 0) {
//         let raises_ul = document.createElement("ul");
//         for (let r of spell.raises) {
//             let li = document.createElement("li");
//             li.innerHTML = r;
//             raises_ul.appendChild(li);
//         }
//         let raises = create_collapsible_div("Raises", [raises_ul], "closed bold");
//         content.appendChild(raises);
//     }

//     if (spell.special) {
//         let special = document.createElement("p");
//         special.innerHTML = spell.special;
//         content.appendChild(special);
//     }
    
//     let description = document.createElement("p");
//     description.innerHTML = spell.description;
//     content.appendChild(description);

//     var deets = document.createElement("details");
//     deets.appendChild(summary);
//     deets.appendChild(content);
//     return deets;
// }

function create_spell_collapsible(spell, button=null) {

    // Creating the title
    var title_content = [];

    var spell_name = spell.title;
    if (spell.keywords.length > 0) {
        spell_name += ` (${spell.keywords.join(", ")})`;
    }
    var title_text = document.createElement("p");
    title_text.innerHTML = spell_name;
    title_content.push(title_text);

    if (button != null) {
        title_content.push(button);
    }

    var content = [];

    var spell_details = document.createElement("p");
    spell_details.innerHTML = `<span class="b">Range:</span> ${spell.range}<br>
                                <span class="b">Area of Effect:</span> ${spell.aoe}<br>
                                <span class="b">Duration:</span> ${spell.duration}<br>`
    content.push(spell_details);

    if (spell.raises && spell.raises.length > 0) {
        let raises_ul = document.createElement("ul");
        for (let r of spell.raises) {
            let li = document.createElement("li");
            li.innerHTML = r;
            raises_ul.appendChild(li);
        }
        let raises = create_collapsible_div("Raises", [raises_ul], "closed bold");
        content.push(raises);
    }

    if (spell.special) {
        let special = document.createElement("p");
        special.innerHTML = spell.special;
        content.push(special);
    }
    
    let description = document.createElement("p");
    description.innerHTML = spell.description;
    content.push(description);

    return create_collapsible_div(title_content, content, "spell closed")
}

function refresh_full_spell_list() {
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
            var content_div = document.getElementById(`all_spells_${element}_${level}_contents`);
            content_div.innerHTML = "";

            let container_id = `all_spells_${element}_${level}_container`;

            // Iterate through spells
            for (let spell of spells[element][level]) {

                let spell_add = document.createElement("input");
                spell_add.type = "button";
                spell_add.value = "Add";

                // Onclick goes here

                var spell_div = create_spell_collapsible(spell,
                                                            spell_add);
                content_div.appendChild(spell_div);
            }
        }
    }
}

function fill_advantages_table() {
        var adv_tbody = document.getElementById("adv_tbody");
        adv_tbody.innerHTML = "";
        var disadv_tbody = document.getElementById("disadv_tbody");
        disadv_tbody.innerHTML = "";

        let row = create_adv_object("Hyper Aware", "You're just so super aware.", 1, 1)
        adv_tbody.appendChild(row);
        let row2 = create_adv_object("Hyper Stupid", "You're just so stupid.", 1, 1);
        disadv_tbody.appendChild(row2);
}

function create_adv_object(title, text, cost, index=-1, advantage=null) {
    var row = document.createElement("tr");

    var trash_icon;
    if (index >= 0) {
        trash_icon = document.createElement("img");
        trash_icon.src = "images/trash2.svg";
        trash_icon.classList.add("icon-red");
        trash_icon.height = 14;
        trash_icon.onclick = function() {
            console.log("Delete Advantage:", index);
            event.stopPropagation();
            event.preventDefault();
        }.bind(this);
        trash_icon.title = `Delete ${advantage} Advantage`;
    }

    var text_cell = document.createElement("td");
    var title_p = document.createElement("p");
    title_p.innerHTML = title;

    var deets = document.createElement("details");
    var smmry = document.createElement("summary");
    var contents = document.createElement("div");
    deets.appendChild(smmry);
    smmry.appendChild(title_p);
    smmry.appendChild(trash_icon);
    contents.innerHTML = text;
    deets.appendChild(contents);
    text_cell.appendChild(deets);

    row.appendChild(text_cell);

    var cost_cell = document.createElement("td");
    cost_cell.innerHTML = cost;
    cost_cell.className = "center v-top";
    row.appendChild(cost_cell);

    return row;
}

// Data ////////////////////////////////////////////////////////////////////////

var ring_dict = {
    "Air": {
        "Awareness": {
            "value": 2,
            "increment": {
                "function": function() {console.log("AWA Inc")}
            },
            "decrement": {
                "function": function() {console.log("AWA Dec")}
            }
        },
        "Reflexes": {
            "value": 2,
            "increment": {
                "function": function() {console.log("REF Inc")}
            },
            "decrement": {
                "function": function() {console.log("REF Dec")}
            }
        }
    },

    "Earth": {
        "Stamina": {
            "value": 2,
            "increment": {
                "function": function() {console.log("STA Inc")}
            },
            "decrement": {
                "function": function() {console.log("STA Dec")}
            }
        },
        "Willpower": {
            "value": 2,
            "increment": {
                "function": function() {console.log("WIL Inc")}
            },
            "decrement": {
                "function": function() {console.log("WIL Dec")}
            }
        }
    },

    "Fire": {
        "Agility": {
            "value": 2,
            "increment": {
                "function": function() {console.log("AGI Inc")}
            },
            "decrement": {
                "function": function() {console.log("AGI Dec")}
            }
        },
        "Intelligence": {
            "value": 2,
            "increment": {
                "function": function() {console.log("INT Inc")}
            },
            "decrement": {
                "function": function() {console.log("INT Dec")}
            }
        }
    },

    "Water": {
        "Perception": {
            "value": 2,
            "increment": {
                "function": function() {console.log("PER Inc")}
            },
            "decrement": {
                "function": function() {console.log("PER Dec")}
            }
        },
        "Strength": {
            "value": 2,
            "increment": {
                "function": function() {console.log("STR Inc")}
            },
            "decrement": {
                "function": function() {console.log("STR Dec")}
            }
        }
    },

    "Void": {
        "Void": {
            "value": 2,
            "increment": {
                "function": function() {console.log("VOID Inc")}
            },
            "decrement": {
                "function": function() {console.log("VOID Dec")}
            }
        }
    }
}

var skills_dict = {
    "Battle": {
        "rank": 1,
        "trait": "PER",
        "roll": "4k3",
        "emphases": "Mass Combat",
        "mastery_abilities": ""
    },
    "Etiquette": {
        "rank": 5,
        "trait": "Awareness",
        "roll": "7k2",
        "emphases": "",
        "mastery_abilities": "+3 Insight, +1k0 to Contested Rolls"
    }
}
// Call Display Functions //////////////////////////////////////////////////////

// update_trait_table(t_dict);
update_skill_table(skills_dict, true);

create_full_spell_list();
refresh_full_spell_list();

fill_advantages_table();