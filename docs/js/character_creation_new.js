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
        // this.refresh_spell_button();
        this.update_gear();
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
        this.gear = null;
        this.money = null;
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
			"deficiency": this.deficiency,
            "gear": this.gear
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

        // Refresh Advantages Selection
        this.refresh_advantages_select();
        this.refresh_disadvantages_select();

        // Refresh Traits Display (as that should be the only thing changed)
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
        this.gear = school_info["gear"];
        this.money = school_info["koku"];

        // Update Class Display
        document.getElementById("school_class").innerHTML = school_info["class"];

        // If Shugenja, enable Spells collapsible
        if (school_info["class"] == "Shugenja") {
            this.set_spells_allowed(true);
            this.refresh_spells_info();
        } else {
            this.set_spells_allowed(false);
        }

        // Generate skill selection dropdowns for the selected school
        this.refresh_school_select();
        this.refresh_skill_selections();

        // Refresh Advantages Selection
        this.refresh_advantages_select();
        this.refresh_disadvantages_select();

        // Refresh Displays
        this.update_skills();
        this.update_traits();
        this.update_gear();
        this.update_techniques();

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
            let p = document.createElement("p");
            p.style = "display: inline; color: grey";
            p.innerHTML = "None";
            skill_choices_div.appendChild(p);
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

            console.groupCollapsed("Skill Stages");
            console.log("Allowed Skills", allowed_skills);
            console.log("Filtered Skills", filtered_skills);
            console.log("Grouped Skills", grouped_skills);
            console.groupEnd("Skill Stages");

            var dropdown_object = new CustomDropdown(button_title,
                                                     grouped_skills,
                                                     false,
                                                     on_option_click);

            var choice_div = document.createElement("div");

            var label = document.createElement("label");
            label.innerHTML = `<u>${this.skills.choices[i]}:</u>`;
            label.style="margin-right: 5px"
            choice_div.appendChild(label);

            choice_div.appendChild(dropdown_object.dropdown);
            dropdown_object.dropdown.style="display: inline";
            choice_div.style="margin-bottom: 5px"

            skill_choices_div.appendChild(choice_div);
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
            let value = traits_dict[trait];
            let value_html = (value > 2) ? `<b>${value}</b>` : `${value}`;
            let row_html = `<tr><td>${trait}</td><td>${value_html}</td></tr>`;
            template.innerHTML = row_html.trim();
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
            spells_container.classList.remove("hidden");
            spells_container.classList.remove("disabled");
            spells_container.title = "";
        } else {
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
        console.groupCollapsed("Adding Default Spells");
        for (let spell_name in window.DH.data.spells) {
            if (window.DH.data.spells[spell_name].universal) {
                this.add_existing_spell(spell_name);
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

        this.add_spell({
            "title": input_data["name"],
            "element": input_data["elements"],
            "mastery_level": input_data["mastery_level"],
            "keywords": input_data["keywords"],
            "range": input_data["range"],
            "aoe": input_data["aoe"],
            "duration": input_data["duration"],
            "raises": input_data["raises"],
            "special": input_data["special"],
            "description": input_data["description"]
        })

        this.refresh_spells_table();
    }

    next_spell_id() {
        let spell_id = `spell_${this.spells.count}`;
        this.spells.count += 1;
        return spell_id;
    }

    add_spell(spell_dict) {
        var spell_name = spell_dict["title"];
        this.spells.learned[spell_name] = spell_dict;
    }

    refresh_spells_table() {
        console.log("this.spell_info", this.spells);
        var spells_tbody = document.getElementById("spells_tbody");
        spells_tbody.innerHTML = "";

        for (let spell_id in this.spells["learned"]) {
            let spell = this.spells.learned[spell_id];
            console.log(spell);

            let row = document.createElement("tr");

            // First Cell
            let c1 = document.createElement("td");
            
                // Create Title
            var spell_name = spell["title"];
            if (spell["keywords"].length > 0) {
                spell_name += ` (${spell["keywords"].join(", ")})`;
            }

            var content = [];

                // Create Details
            var spell_text = "";
            spell_text += `Range: ${spell["range"]}<br>`;
            spell_text += `AoE: ${spell["aoe"]}<br>`;
            spell_text += `Duration: ${spell["duration"]}<br>`;
            let details = document.createElement("p");
            details.innerHTML = spell_text;
            content.push(details);


                // Add Raises to description (if present)
            if (spell["raises"].length > 0) {
                let raises_ul = document.createElement("ul");
                for (let r of spell["raises"]) {
                        let li = document.createElement("li");
                        li.innerHTML = r;
                        raises_ul.appendChild(li);
                }
                let raises = create_collapsible_div("Raises", [raises_ul], "hidden");
                content.push(raises)
            }
            
                // Add bulk description text
            let description = document.createElement("p");
            description.innerHTML = spell["description"];
            content.push(description);

            console.log(content);

            // Finish creating Cell 1
            c1.appendChild(create_collapsible_div(spell_name,
                                                  content,
                                                  "spell hidden"
            ));

            c1.classList.add("text_cell");
            row.appendChild(c1);

            console.log(spell)

            let c2 = document.createElement("td");
            c2.innerHTML = spell["mastery_level"];
            row.appendChild(c2);
            c2.style = "text-align: center; vertical-align: text-top;";

            let c3 = document.createElement("td");
            console.log(spell["element"])
            c3.innerHTML = spell["element"];
            row.appendChild(c3);
            c3.style = "vertical-align: text-top;"

            spells_tbody.appendChild(row);
        }
    }

    refresh_spell_dropdown() {
        var spell_dropdown = document.getElementById("spell_dropdown");
        spell_dropdown.innerHTML = "";

        var new_spells = [];
        for (let spell in window.DH.data.spells) {
            let spell_info = window.DH.data.spells[spell];
            if (!(spell in this.spells.learned)) {
                new_spells.push(spell);
            }
        }

        var grouped_spells = window.DH.group_spells(new_spells)

        var on_spell_click = function(value) {
            console.log("SPELL SELECTED");
            this.confirm_spell(value);
        }.bind(this);

        var dropdown_obj = new CustomDropdown("Add Spell", grouped_spells,
                                              false, on_spell_click)

        spell_dropdown.appendChild(dropdown_obj.dropdown);
    }

    add_existing_spell(spell_name) {
        this.spells.learned[spell_name] = window.DH.data.spells[spell_name];
    }

    async confirm_spell(spell_name) {
        var spell = window.DH.data.spells[spell_name];
        console.log(spell);

        var modal = new ModalWindow();
        modal.add_title(`Add spell '${spell_name}'?`);
        modal.add_subtitle(`${spell.element} ${spell.mastery_level} (${spell.keywords})`);

        var description = "";
        description += `<b>Range:</b> ${spell.range}<br>`;
        description += `<b>Area of Effect:</b> ${spell.aoe}<br>`;
        description += `<b>Duration:</b> ${spell.duration}<br>`;
        description += `<b>Raises:</b> ${spell.raises}<br>`;
        description += `<b>Special:</b> ${spell.special}<br>`;
        description += spell.description;
        modal.add_description(description);

        var input_data = await modal.get_user_input();

        if (input_data == null) {
            return;
        } else {
            this.add_existing_spell(spell_name);
            this.refresh_spells_info();
        }
    }

    refresh_spells_info() {
        this.refresh_spells_table();
        this.refresh_spell_dropdown();

        // Refresh Affinity display
        var p_affinity = document.getElementById("p_affinity");
        var sel_affinity = document.getElementById("sel_affinity");
        if (this.affinity == "Any") {
            sel_affinity.style.display = "inline";
            p_affinity.style.display = "none";
        } else {
            sel_affinity.style.display = "none";
            p_affinity.style.display = "inline";
            p_affinity.innerHTML = this.affinity;
        }

        // Refresh Deficiency display
        var p_deficiency = document.getElementById("p_deficiency");
        p_deficiency.innerHTML = this.deficiency;

        // Refresh Spell Choices
        console.log(this.spells.choices);
        var p_spell_choices = document.getElementById("p_spell_choices");
        p_spell_choices.innerHTML = this.spells.choices.join(", ");
    }

    // Gear ////////////////////////////////////////////////////////////////////

    update_gear() {
        var money_p = document.getElementById("money_display");
        money_p.innerHTML = "";
        if (this.money == null) {
            money_p.innerHTML = "None";
        } else {
            money_p.innerHTML = `${this.money} Koku`;
        }

        var gear_p = document.getElementById("gear_display");
        gear_p.innerHTML = "";
        if (this.gear == null) {
            // gear_p.disabled = true;
            gear_p.innerHTML = "None"
        } else {
            var ul = document.createElement("ul");
            for (let item of this.gear) {
                let li = document.createElement("li");
                li.innerHTML = item;
                ul.appendChild(li);
            }
            gear_p.appendChild(ul);
        }
    }

    // Techniques //////////////////////////////////////////////////////////////

    update_techniques() {
        var techniques_div = document.getElementById("techniques_div");
        techniques_div.innerHTML = "";

        console.log("UPDATING TECHNIQUES");
        var techniques = window.DH.get_techniques(this.school_id);

        for (let i in techniques) {
            let content = document.createElement("p");
            content.innerHTML = techniques[i].effect;
            let div = create_collapsible_div(`Rank ${i}: ${techniques[i].name}`,
                                                [content], "bold hidden");
            techniques_div.appendChild(div);
        }
    }

    ////////////////////////////////////////////////////////////////////////////

}

// Page Functions //////////////////////////////////////////////////////////////
function change_character_name() {

    var new_name = window.prompt("Enter a new name for this character:");

    if (new_name == null || new_name == "") {
        return;
    }

    document.getElementById("character_name_display").innerHTML = new_name;
}

function complete_character() {
    console.log("BUTTON CLICKED - Complete Character");
}

function start_over() {
    console.log("BUTTON CLICKED - Start Over");
}