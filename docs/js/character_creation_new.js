class CharacterCreator {

	constructor() {
        console.log("Initiating CharacterCreator");
        this.reset_character_data();
		this.reset_page();
	}

    reset_page() {
        console.log("Resetting Character Data");
        this.reset_character_data();
        this.refresh_family_select();
        this.refresh_school_select();
        this.refresh_skill_selections();
        this.update_traits();
        this.refresh_advantages_select();
        this.refresh_disadvantages_select();
        this.set_spells_allowed(false);
        this.add_default_spells();
        this.refresh_spell_button();
    }

	// Character Data //////////////////////////////////////////////////////////

	reset_character_data() {
		this.name = null;
		this.info = {};
		this.family_id = "";
		this.school_id = "";
		this.total_experience = 40;
		this.trait_bonuses = {
			"family": null,
			"school": null
		};
		this.skills = {
			"set": [],
			"choices": [],
			"chosen" : []
		};
		this.spells = {
			"count": 0,
			"choices": [],
			"learned": {}
		};
		this.affinity = null;
		this.deficiency = null;
	}

	save_character_data() {
		var save_data = {
			"name": this.name,
			"info": this.info,
			"family_id": this.family_id,
			"school_id": this.school_id,
			"total_experience": this.total_experience,
			"trait_bonuses": this.trait_bonuses,
			"starting_skills": this.starting_skills,
			"spells": this.spells,
			"affinity": this.affinity,
			"deficiency": this.deficiency
		}
		localStorage["current_character"] = JSON.stringify(save_data);
	}

    // Traits and Skills ///////////////////////////////////////////////////////

    set_family(family_id) {
    	console.group(`Set Family - ${family_id}`);
    	var family_trait_bonus = window.DH.get_family_traits(family_id);

    	this.family_id = family_id;
    	this.trait_bonuses.family = family_trait_bonus;
    	this.save_character_data();

    	console.log(`Family set: '${family_id}'`);
    	console.log(`Family trait bonus: '${family_trait_bonus}'`, family_trait_bonus);

        this.refresh_family_select(); // Set custom text displayed on select
        this.refresh_school_select(); // Update Order of School Select
        this.refresh_skill_selections(); // Clear skill choices if they exist

        this.refresh_advantages_select();
        this.refresh_disadvantages_select();

        this.update_traits();
        console.groupEnd();
    }

    set_school(school_id) {
        console.group(`Set School - ${school_id}`);
        var school_info = window.DH.get_school_info(school_id);
        console.log(school_info);

        // Update Character Info
        this.school_id = school_id;
        this.skills.set = school_info["skills"];
        this.skills.choices = school_info["skill_choices"];
        this.skills.chosen = 
                        Array(school_info["skill_choices"].length).fill(null);
        this.trait_bonuses.school = school_info["attribute"];
        this.affinity = school_info["affinity"];
        this.deficiency = school_info["deficiency"];
        this.spells.choices = school_info["spells"];

        // Update Class Display
        document.getElementById("school_class").innerHTML = school_info["class"];

        // If Shugenja, enable Spells collapsible
        if (school_info["class"] == "Shugenja") {
            this.set_spells_allowed(true);
        } else {
            this.set_spells_allowed(false);
        }

        // Generate skill selection dropdowns for the selected school
        this.refresh_school_select();
        this.refresh_skill_selections();

        this.refresh_advantages_select();
        this.refresh_disadvantages_select();

        this.update_skills();
        this.update_traits();
    }

	refresh_family_select() {
        console.log("REFRESH FAMILY SELECT");
		var family_select = document.getElementById("character_family_select");
		family_select.innerHTML = "";

		family_select.onchange = function() {
			this.set_family(family_select.value);
		}.bind(this);

		if (this.family_id == "") {
			create_select_default(family_select, "Select a family...");
		} else {
			var [clan_name, family_name] = this.family_id.split("_");
			let select_show_value = `${family_name} (${clan_name})`;
			create_select_default(family_select, select_show_value, this.family_id);
		}

		var families_by_clan = window.DH.get_clan_families();

        console.log(families_by_clan);

        for (let clan of Object.keys(families_by_clan).sort()) {
            let clan_group = document.createElement("optgroup");
            clan_group.label = clan;
            for (let family of families_by_clan[clan].sort()) {
                let option = document.createElement("option");
                option.value = clan + "_" + family;
                option.label = family;
                clan_group.appendChild(option);
            }

            // Only add clan if the number of families is > 0
            console.log("Triggered");
            if (clan_group.childElementCount > 0) {
                family_select.appendChild(clan_group);
            }
        }
	}

    refresh_school_select() {
        var school_select = document.getElementById("character_school_select");
        school_select.innerHTML = "";

        school_select.onchange = function() {
            this.set_school(school_select.value);
        }.bind(this);

        // Set default text
        if (this.school_id === "") {
            create_select_default(school_select, "Select a school...");
        } else {
            var school_info = window.DH.get_school_info(this.school_id);
            var [clan_name, school_name] = this.school_id.split("_");
            var new_text = `${school_name} (${clan_name} ${school_info.class})`;
            create_select_default(school_select, new_text);
        }

        var clan_schools = window.DH.get_clan_schools();

        if (this.family_id != "") {
            let chosen_clan = this.family_id.split("_")[0];
            if (chosen_clan in clan_schools) {
                let clan_group = document.createElement("optgroup");
                clan_group.label = chosen_clan;
                for (let school of clan_schools[chosen_clan]) {
                    let option = document.createElement("option");
                    option.value = `${chosen_clan}_${school}`;
                    option.label = school;
                    clan_group.appendChild(option);
                }
                if (clan_group.childElementCount > 0) {
                    school_select.appendChild(clan_group);
                    let divider = document.createElement("optgroup");
                    divider.label = "--- Other Clans ---";
                    school_select.appendChild(divider);
                }

                delete clan_schools[chosen_clan];
            } else {
                console.warn(`'${chosen_clan} Clan' has no schools.`);
            }
        }

        for (let clan in clan_schools) {
            var clan_group = document.createElement("optgroup");
            clan_group.label = clan;
            for (let school of clan_schools[clan]) {
                let option = document.createElement("option");
                option.value = `${clan}_${school}`;
                option.label = school;
                clan_group.appendChild(option);
            }
            if (clan_group.childElementCount > 0) {
                school_select.appendChild(clan_group);
            }
        }
    }

    refresh_skill_selections() {
    	var skill_choices_div = document.getElementById("skill_choices_div");
    	skill_choices_div.innerHTML = "";

    	if (this.school_id == "" || this.skills.choices.length == 0) {
            let null_button = document.createElement("input");
            null_button.type = "button";
            null_button.value = "None";
            null_button.disabled = true;
            skill_choices_div.appendChild(null_button);
    		return;
    	}

    	for (let i=0; i < this.skills.choices.length; i++) {
    		var allowed_skills;
    		if (this.skills.choices[i] == "Any") {
    			allowed_skills = window.DH.get_skill_list();
    		} else {
    			let allowed_categories = this.skills.choices[i].split("/");
    			allowed_skills = window.DH.get_skill_list(allowed_categories)
    		}

    		// Only allow skills that aren't already part of the school's 
    		// starting skills, and also haven't already been chosen in a 
    		// different skill choice dropdown.
    		var filtered_skills = allowed_skills.filter(function(s) {
    			return (!(s in this.skills.set) &&
    			        !(this.skills.chosen.includes(s))
    			);
    		}.bind(this));

    		var grouped_skills = window.DH.create_skill_sublists(filtered_skills);

    		var button_title;
    		if (this.skills.chosen[i] == null) {
    			button_title = `${this.skills.choices[i]}`;
    		} else {
    			button_title = this.skills.chosen[i];
    		}

    		// Generate the callback function for the dropdown options
    		var on_option_click = function(value) {
    			this.set_skill_choice(value, i);
    		}.bind(this);

            console.log("Grouped Skills", grouped_skills);

            var dropdown_object = new CustomDropdown(button_title,
                                                     grouped_skills,
                                                     false,
                                                     on_option_click);

            skill_choices_div.appendChild(dropdown_object.dropdown);
    	}
    }

    set_skill_choice(skill_name, skill_button) {
    	console.log(`Clicked on '${skill_name}'`, skill_button);
    	this.skills.chosen[skill_button] = skill_name;
    	this.refresh_skill_selections();
        this.update_skills();
    }

    update_traits() {
        var traits_list = ["Awareness", "Reflexes", "Stamina", "Willpower",
                            "Agility", "Intelligence", "Perception", "Strength",
                            "Void"];

        // Create traits_dict and fill with default_value (2)
        var traits_dict = {}
        for (let trait of traits_list) {
            traits_dict[trait] = 2;
        }

        // Add in bonuses from family/school
        console.log("THIS.TRAIT_BONUSES", this.trait_bonuses);
        for (let type in this.trait_bonuses) {
            for (let trait in this.trait_bonuses[type]) {
                traits_dict[trait] += this.trait_bonuses[type][trait];
            }
        }

        console.log("UPDATING TRAITS");
        var trait_tbody = document.getElementById("trait_tbody");
        trait_tbody.innerHTML = "";
        var template = document.createElement("template");
        for (let trait in traits_dict) {
            let row_html = `<tr><td>${trait}</td>
                        <td>${traits_dict[trait]}</td></tr>`;
            row_html = row_html.trim();
            template.innerHTML = row_html;
            trait_tbody.appendChild(template.content.firstChild);
        }
    }

    update_skills() {
        console.log("UPDATING SKILLS");
        console.log(this.skills);
        var skill_tbody = document.getElementById("skill_tbody");
        skill_tbody.innerHTML = "";
        var template = document.createElement("template");

        var starting_skills = this.skills.set;
        console.log(starting_skills);

        for (let skill in starting_skills) {
            let skill_info = starting_skills[skill];
            var row_html = `<tr><td>${skill}</td>
                            <td>${skill_info.rank}</td>
                            <td>${skill_info.emphases.join(", ")}</td></tr>`;
            row_html = row_html.trim();
            template.innerHTML = row_html;
            skill_tbody.appendChild(template.content.firstChild);
        }

        var chosen_skills = this.skills.chosen;

        for (let skill of chosen_skills) {
            if (skill == null) {continue};
            var row_html = `<tr><td>${skill}</td><td>1</td><td></td></tr>`;
            row_html = row_html.trim();
            template.innerHTML = row_html;
            skill_tbody.appendChild(template.content.firstChild);
        }
    }

    update_techniques() {
        console.log("UPDATE_TECHNIQUES");
    }

    // Advantages and Disadvantages ////////////////////////////////////////////

    adv_onselect(adv_data, tbody) {
        var func = async function() {
            console.group("Advantage/Disadvantage Selected");
            var selected_item = event.target.value;
            var selected_data = adv_data[selected_item];
            console.log("Loading Modal Window");
            console.log("Selected item:", selected_item);
            console.log("Data:", adv_data);
            
            var modal = new AdvantagesModal(selected_data);

            var input_data = await modal.get_user_input();

            if (input_data) {
                console.log("INPUT_DATA:", input_data);
                tbody.appendChild(this.create_adv_object(input_data));
            } else {
                console.log("Advantage cancelled");
            }
            this.refresh_advantages_select();
            this.refresh_disadvantages_select();
        }
        return func.bind(this);
    }

    create_adv_object(data) {
        console.warn("Creating adv object", data);
        var row = document.createElement("tr");
        var cell_1 = document.createElement("td");

        cell_1.appendChild(create_collapsible_div(data.title, data.text, "max400"));

        row.appendChild(cell_1);

        var cost_cell = document.createElement("td");
        cost_cell.innerHTML = data["cost"];
        row.appendChild(cost_cell);

        return row;
    }

    refresh_advantages_select() {
        console.log("Refresh Advantages Select");
        var select = document.getElementById("advantage_select");
        var data = this.filter_advantages();
        select.innerHTML = "";
        create_select_default(select, "Select an Advantage...");

        for (let item_name in data) {
            let opt = document.createElement("option");
            opt.innerHTML = item_name;
            opt.value = item_name;
            select.appendChild(opt);
        }
        select.onchange = this.adv_onselect(this.filter_advantages(),
                                        document.getElementById("adv_tbody"));
    }

    refresh_disadvantages_select() {
        console.log("Refresh Disadvantages Select");
        var select = document.getElementById("disadvantage_select");
        var data = this.filter_disadvantages();
        select.innerHTML = "";
        create_select_default(select, "Select a Disadvantage...");

        for (let item_name in data) {
            let opt = document.createElement("option");
            opt.innerHTML = item_name;
            opt.value = item_name;
            select.appendChild(opt);
        }
        select.onchange = this.adv_onselect(this.filter_disadvantages(),
                                    document.getElementById("disadv_tbody"));
    }

    filter_advantages() {
        // PLACEHOLDER
        return window.DH.data.advantages;
    }

    filter_disadvantages(disadvantage_data) {
        // PLACEHOLDER
        return window.DH.data.disadvantages;
    }

    // Spells //////////////////////////////////////////////////////////////////

    set_spells_allowed(allowed) {
        console.log("SETTING SPELLS ALLOWED", allowed);
        var spells_container = document.getElementById("spells_container");
        if (allowed) {
            console.log("TRUE");
            spells_container.classList.remove("hidden");
            spells_container.classList.remove("disabled");
            spells_container.title = "";
        } else {
            console.log("FALSE");
            spells_container.classList.add("hidden");
            spells_container.classList.add("disabled");
            spells_container.title = "A Shugenja class is required to use Spells";
        }
    }

    refresh_spell_button() {
        var spell_btn = document.getElementById("spell_btn");
        spell_btn.onclick = this.add_custom_spell.bind(this);
    }

    add_default_spells() {
        console.log("ADDING DEFAULT SPELLS");
        var default_spells = {};
        console.log(window.DH.spells);

        for (let spell_name in window.DH.spells) {
            if (window.DH.spells[spell_name].universal) {
                let spell = window.DH.spells[spell_name];
                this.add_spell(spell_name, spell.description, spell.keywords,
                               spell.ring.split(), spell.mastery_level, spell.range,
                               spell.aoe, spell.duration, spell.raises,
                               spell.universal);
            }
        }

        this.refresh_spells_table();
    }

    async add_custom_spell() {
        console.groupCollapsed("Adding Custom Spell");

        var modal = new ModalWindow();
        modal.add_title("Custom Spell");
        modal.add_text_input("name", "Name", "Spell Name");
        modal.add_wordlist_input("keywords", "Keywords", "Keyword...", true);
        // modal.add_text_input("keywords", "Keywords", "(Space separated)", null,
        //                     false, true);
        modal.add_int_input("mastery_level", "Mastery Level", 6, 1);
        modal.add_multicheckbox_input("elements", "Elements",
                                    ["Air", "Earth", "Fire", "Water", "Void"]);
        modal.add_text_input("range", "Range", "e.g. Personal, 5', etc.");
        modal.add_text_input("aoe", "Area of Effect", "30', 10 radius, etc.");
        modal.add_text_input("duration", "Duration", "3 rounds, 1 hour, etc.");
        modal.add_text_input("info", "Description", "Spell Description...",
                             null, true);

        var input_data = await modal.get_user_input();

        if (input_data == null) {
            return;
        }

        console.log("CUSTOM SPELL", input_data);

        this.add_spell(input_data["name"],
                       input_data["info"],
                       input_data["keywords"],
                       input_data["elements"],
                       input_data["mastery_level"],
                       input_data["range"],
                       input_data["aoe"],
                       input_data["duration"],
                       null,
                       false);

        this.refresh_spells_table();
    }

    next_spell_id() {
        let spell_id = `spell_${this.spell_info.count}`;
        this.spell_info.count += 1;
        return spell_id;
    }

    add_spell(name, description, keywords, elements, mastery_level, range, aoe,
              duration, raises, universal=false) {
        let spell_id = this.next_spell_id();
        var spell = {
            "name": name,
            "description": description,
            "keywords": keywords,
            "elements": elements,
            "mastery_level": mastery_level,
            "range": range,
            "aoe": aoe,
            "duration": duration,
            "raises": raises,
            "universal": universal
        }
        this.spell_info.spells[spell_id] = spell;
    }

    refresh_spells_table() {
        console.log("this.spell_info", this.spell_info);
        var spells_tbody = document.getElementById("spells_tbody");
        spells_tbody.innerHTML = "";

        for (let spell_id in this.spells["learned"]) {
            let spell = this.spell_info.spells[spell_id];
            console.log(spell);

            let row = document.createElement("tr");

            // First Cell
            let c1 = document.createElement("td");
            
                // Create Title
            var spell_name = spell["name"];
            if (spell["keywords"].length > 0) {
                spell_name += ` (${spell["keywords"].join(", ")})`;
            }

                // Create Details
            var spell_text = "";
            spell_text += `Range: ${spell["range"]}<br>`;
            spell_text += `AoE: ${spell["aoe"]}<br>`;
            spell_text += `Duration: ${spell["duration"]}<br>`;
            let details = document.createElement("p");
            details.innerHTML = spell_text;


                // Add Raises to description
            let raises = document.createElement("div");
            raises = create_collapsible_div("Raises", "RAISES_INFO", "hidden");
            console.log("RAISES", spell["raises"]);


                // Add bulk description text
            let description = document.createElement("p");
            description.innerHTML = spell["description"];


            // Finish creating Cell 1
            c1.appendChild(create_collapsible_div(spell_name,
                                                  [details, raises, description],
                                                  "spell hidden"
            ));

            c1.classList.add("text_cell");
            row.appendChild(c1);

            let c2 = document.createElement("td");
            c2.innerHTML = spell["mastery_level"];
            row.appendChild(c2);
            c2.style = "text-align: center; vertical-align: text-top;";


            let c3 = document.createElement("td");
            console.log(spell["elements"])
            c3.innerHTML = spell["elements"].join(", ");
            row.appendChild(c3);
            c3.style = "vertical-align: text-top;"

            spells_tbody.appendChild(row);
        }
    }


    ////////////////////////////////////////////////////////////////////////////

}

// Page Functions //////////////////////////////////////////////////////////////
function change_character_name() {
    var new_name = document.getElementById('character_name_input').value;

    if (new_name.length == 0) {
        alert("Character cannot have a name of 0 length.");
    } else {
        var yesno = confirm(`Change character's name to '${new_name}'?`);
        if (yesno) {
            document.getElementById("character_name_display").innerHTML = new_name;
        }
    }
}

function complete_character() {
    console.log("BUTTON CLICKED - Complete Character");
}

function start_over() {
    console.log("BUTTON CLICKED - Start Over");
}