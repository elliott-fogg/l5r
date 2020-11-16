class Skill_Choices {

	constructor() {
		this.start_new_character_creation();
	}

	// Stages //////////////////////////////////////////////////////////////////

	start_new_character_creation() {
		console.log("New Character Creation Initiated");
		var new_char_div = document.getElementById("character_creation_div");
		new_char_div.classList.add("active");

		this.family_id = "";
		this.school_id = "";
		this.starting_traits = {
			"Awareness": 2, "Reflexes": 2, "Stamina": 2, "Willpower": 2,
			"Agility": 2, "Intelligence": 2, "Perception": 2, "Strength": 2,
			"Void": 2
		}
		this.starting_skills = {};
		this.chosen_skills = [];

		this.refresh_family_select(); // Reset the family select element
		this.refresh_school_select(); // Reset and disable school select element
		this.refresh_skill_selections(); // Remove any skill choice dropdowns
	}

	set_family(family_id) {
		this.family_id = family_id;
		console.log(`Family Set: '${this.family_id}'`);

		this.refresh_family_select(); // Set custom text displayed on select
		this.refresh_school_select(); // Allow school select and update order
		this.refresh_skill_selections(); // Clear skill choices if they exist
	}

	set_school(school_id) {
		this.school_id = school_id;
		console.log(`School Set: '${this.school_id}'`);

		// Get school starting information
		var school_info = get_school_info(this.school_id);
		this.starting_skills = school_info["skills"];
		this.skill_choices = school_info["skill_choices"];
		this.chosen_skills = Array(this.skill_choices.length).fill(null);

		// Generate skill selection dropdowns for the selected school
		this.refresh_skill_selections();
	}

    generate_character() {
    	// Set character given name for generating
        this.given_name = window.prompt(
                        "Please enter a name for this character.", "");
        if (this.given_name == null || this.given_name == "") {
            console.log("Name Cancelled", this.name);
            return;
        }
        
        console.log(this.given_name);

        // Add trait changes for selected family
        var family_traits = get_family_traits(this.family_id);
        for (let trait in family_traits) {
        	this.starting_traits[trait] += family_traits[trait];
        }

        // Add trait changes for selected school
        var school_info = get_school_info(this.school_id);
        var school_traits = school_info["attribute"];
        for (let trait in school_traits) {
        	this.starting_traits[trait] += school_traits[trait];
        }
        console.log(this.starting_traits);

        // Add skill choices to starting skills
        for (let skill_name of this.chosen_skills) {
        	var skill_info = get_skill_info(skill_name);
        	console.log(skill_info);
        	this.starting_skills[skill_name] = {
        		"rank": 1,
        		"trait": skill_info["trait"],
        		"class": skill_info["class"],
        		"emphases": []
        	}
        }

        window.character = new CharacterDisplay(this.given_name, 
                                                this.family_id, 
                                                this.school_id, 
                                                this.starting_skills,
                                                this.starting_traits)

        console.log("Character generated");
        console.log(window.character);
    }

    // Display Functions ///////////////////////////////////////////////////////

    refresh_family_select() {
    	var sel_family = document.getElementById("char_creation_family_select");
    	sel_family.innerHTML = "";

    	sel_family.onchange = function() {
    		this.set_family(sel_family.value);
    	}.bind(this);

    	if (this.family_id === "") {
    		create_select_default(sel_family, "Select a family...");
    		document.getElementById("char_creation_school_select").disabled=true;
    	} else {
    		var [clan_name, family_name] = this.family_id.split("_");
    		create_select_default(sel_family, `${family_name} - ${clan_name}`, 
    		                      this.family_id);
    	}

        var families_by_clan = get_clan_families();

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
                sel_family.appendChild(clan_group);
            }
        }
    }

    refresh_school_select () {
    	var sel_school = document.getElementById("char_creation_school_select");
    	sel_school.innerHTML = "";

    	create_select_default(sel_school, "Select a school...");

    	if (this.family_id == "") {
    		// Family has not been set, just disable this for now.
    		sel_school.disabled = true;
    		return;
    	}

    	// Beyond this point, this.family_id must have been set
    	sel_school.onchange = function() {
    		this.set_school(sel_school.value);
    	}.bind(this);

        // Return schools from all clans, grouped, with char clan at top
        var clan_names = get_clans();
        var chosen_clan = this.family_id.split("_")[0];
        clan_names = clan_names.filter(function(e) {
        	return e !== chosen_clan}).sort();
        clan_names.unshift(chosen_clan);

        for (let clan of clan_names) {
        	var clan_group = document.createElement("optgroup");
        	clan_group.label = clan;
        	for (let school of get_clan_schools(clan).sort()) {
        		let option = document.createElement("option");
        		option.value = `${clan}_${school}`;
        		option.label = school;
        		clan_group.appendChild(option);
        	}

        	if (clan_group.childElementCount > 0) {
        		sel_school.appendChild(clan_group);
        	}
        }
    	sel_school.disabled = false;
    }

    refresh_skill_selections() {
    	var skill_choices_div = document.getElementById("skill_choice_selects");
    	skill_choices_div.innerHTML = "";

    	if (this.school_id == "") {
    		// The school has not been set, just exit after clearing div.
    		return;
    	}

    	for (let i=0; i < this.skill_choices.length; i++) {
    		var allowed_categories;
    		if (this.skill_choices[i] == "Any") {
    			// A zero-length list implies all categories allowed.
    			allowed_categories = [];
    		} else {
    			allowed_categories = this.skill_choices[i].split("/");
    		}

    		var allowed_skills_list = get_skill_list(allowed_categories);
    		var valid_skills_list = allowed_skills_list.filter(function(s) {
    			// Only allow skills that aren't already part of the school's 
    			// starting skills, and also haven't already been chosen in a 
    			// different skill choice dropdown.
    			return (
    			        !(s in this.starting_skills) && 
    			        !(this.chosen_skills.includes(s))
    			);
    		}.bind(this));

    		var grouped_valid_skills = create_skill_sublists(valid_skills_list);

    		var button_title;
    		if (this.chosen_skills[i] == null) {
    			button_title = this.skill_choices[i];
    		} else {
    			button_title = this.chosen_skills[i];
    		}

    		// Generate the callback function for the dropdown options
    		var on_option_click = function(value) {
    			this.set_skill_choice(value, i);
    		}.bind(this);

    		var skill_choice_dropdown = create_dropdown(button_title,
    		                                            grouped_valid_skills, 
    		                                            on_option_click);

    		skill_choices_div.appendChild(skill_choice_dropdown);
    	}
    }

    set_skill_choice(skill_name, skill_button) {
    	console.log(`Clicked on '${skill_name}'`, skill_button);
    	this.chosen_skills[skill_button] = skill_name;
    	this.refresh_skill_selections();
    	if (!(this.chosen_skills.includes(null))) {
	        var gen_char_btn = document.getElementById("gen_char_btn");
	        gen_char_btn.disabled = false;
	        gen_char_btn.onclick = function() {
	            this.generate_character();
	        }.bind(this);
    	}
    }

// End Class


	// refresh() {
	// 	this.main_div.innerHTML = "";

	// 	for (let i=0; i < this.choice_strings.length; i++) {
	// 		var choice_categories;
	// 		if (this.choice_strings[i] == "Any") {
	// 			choice_categories = [];
	// 		} else {
	// 			choice_categories = this.choice_strings[i].split("/");
	// 		}

	// 		var choice_skill_list = get_skill_list(choice_categories)
	// 		var valid_skill_choices = choice_skill_list.filter(function(s) {
	// 			return (!(s in this.starting_skills) && !(this.choices.includes(s)));
	// 		}.bind(this));

	// 		var grouped_valid_skills = create_skill_sublists(valid_skill_choices);

	// 		var button_title;
	//         if (this.choices[i] == null) {
	//             button_title = this.choice_strings[i];
	//         } else {
	//             button_title = this.choices[i];
	//         }

	// 		var choice_dropdown = create_dropdown(button_title,
	// 		                                            grouped_valid_skills);

	// 		var dropdown_options = choice_dropdown.getElementsByClassName(
	// 		                                                    "menu-option");
	//         for (let option of dropdown_options) {
	//             option.onclick = function() {
	//                 // Re-call this (outer) function to refresh the choice 
	//                 // select dropdowns, and update the title of this particular
	//                 // dropdown to reflect this skill choice.
	//                 this.choices[i] = option.dataset.value;
	//                 this.refresh()
	//             }.bind(this);
	//         }
	//         this.main_div.appendChild(choice_dropdown);

	//         // If all choices have been made, enable Generate Character button
	//         if (this.choices.includes(null)) {
	//         	console.log("Some skills not set. Cannot generate character.",
	//         	            this.choices);
	//         } else {
	//         	this.character.set_char_creation_stage("set_skill_choice");
	//         }
	// 	}
	// }

	// constructor(school_id, character, main_div_id) {
	// 	var school_info = get_school_info(school_id);
	// 	this.choice_strings = school_info["skill_choices"];
	// 	this.choices = Array(this.choice_strings.length).fill(null);
	// 	this.main_div = document.getElementById(main_div_id);
	// 	this.character = character;

	// 	this.starting_skills = school_info["skills"];

	// 	this.refresh();
	// }

	// refresh() {
	// 	this.main_div.innerHTML = "";

	// 	for (let i=0; i < this.choice_strings.length; i++) {
	// 		var choice_categories;
	// 		if (this.choice_strings[i] == "Any") {
	// 			choice_categories = [];
	// 		} else {
	// 			choice_categories = this.choice_strings[i].split("/");
	// 		}

	// 		var choice_skill_list = get_skill_list(choice_categories)
	// 		var valid_skill_choices = choice_skill_list.filter(function(s) {
	// 			return (!(s in this.starting_skills) && !(this.choices.includes(s)));
	// 		}.bind(this));

	// 		var grouped_valid_skills = create_skill_sublists(valid_skill_choices);

	// 		var button_title;
	//         if (this.choices[i] == null) {
	//             button_title = this.choice_strings[i];
	//         } else {
	//             button_title = this.choices[i];
	//         }

	// 		var choice_dropdown = create_dropdown(button_title,
	// 		                                            grouped_valid_skills);

	// 		var dropdown_options = choice_dropdown.getElementsByClassName(
	// 		                                                    "menu-option");
	//         for (let option of dropdown_options) {
	//             option.onclick = function() {
	//                 // Re-call this (outer) function to refresh the choice 
	//                 // select dropdowns, and update the title of this particular
	//                 // dropdown to reflect this skill choice.
	//                 this.choices[i] = option.dataset.value;
	//                 this.refresh()
	//             }.bind(this);
	//         }
	//         this.main_div.appendChild(choice_dropdown);

	//         // If all choices have been made, enable Generate Character button
	//         if (this.choices.includes(null)) {
	//         	console.log("Some skills not set. Cannot generate character.",
	//         	            this.choices);
	//         } else {
	//         	this.character.set_char_creation_stage("set_skill_choice");
	//         }
	// 	}
	// }



// End Class
}

function bind_clan_only_checkbox() {
        var co_box = document.getElementById("clan_only_checkbox");
        co_box.onchange = function() {
            this.repopulate_school_select();
        }.bind(this);
    }