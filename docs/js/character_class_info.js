class CharacterInfo {

	// Constructors ////////////////////////////////////////////////////////////
    constructor(starting_experience=40) {
        const self = this;
        this.name = "PLACEHOLDER_NAME";
        this.family = "PLACEHOLDER_FAMILY";
        this.school = "PLACEHOLDER_SCHOOL";
        this.total_experience = starting_experience;
        this.experience = this.total_experience;
        this.skills = {};
        this.starting_skills = {};
        this.setup_traits();
    }

    setup_traits() {
        this.traits = {};
        for (let ring_name in rings) {
            rings[ring_name].forEach( trait_name => {
                this.traits[trait_name] = 2;
            })
        }
    }

    // (Add / Remove / Modify) Skills and Traits ///////////////////////////////

    add_skill(skill_name, hold_refresh=false) {
        console.log("HELLO", skill_name)
        console.log(this);
        // Check if it is a valid skill name
        if (!(skill_name in all_skills)) {
            alert(`Skill '${skill_name}' could not be found.`);
            return;
        }

        // Check if player already has the skill
        if (skill_name in this.skills) {
            alert(`Player already has skill ${skill_name}.`)
            return;
        }

        // Check if player has necessary experience
        console.log("Current Experience: ", this.experience);
        if (!(this.experience >= 1)) {
            alert(`Insufficient experience to acquire skill '${skill_name}.`)
            return;
        }

        var skill_info = get_skill_info(skill_name);

        this.skills[skill_name] = {
            rank: 1,
            trait: skill_info.trait,
            class: skill_info.class,
            emphases: []
        };
        this.experience -= 1;

        if (!hold_refresh) {
            this.refresh_display(); //DISPLAY
        }

        return true;
    }

    remove_skill(skill_name) {
        // Changed functionality where you can only remove a skill if it is at
        // Rank 1, so no need to calculate Exp levels. Just check for 
        // Starting Skills and Emphases.

        if (this.skill[skill_name].rank != 1) {
            alert(`Attempting to remove skill '${skill_name}' of rank ` +
                  `${this.skill[skill_name].rank}.`);
            return;
        }

        delete this.skills[skill_name];
        this.experience += 1;
        return;
    }

    add_emphasis(skill_name, emphasis_name) {
        // Check that emphasis belongs to skill
        if (!(all_skills[skill_name].emphases.includes(emphasis_name))) {
            console.log(all_skills[skill_name].emphases)
            console.log(emphasis_name in all_skills[skill_name].emphases);
            alert(`Could not find emphasis '${emphasis_name}' in skill '${skill_name}'.`);
            return;
        }

        // Check that skill doesn't already have emphasis
        if (emphasis_name in this.skills[skill_name].emphases) {
            alert(`Emphasis '${emphasis_name} already in skill '${skill_name}.`);
            console.log("ERROR: Emphasis somehow added twice!")
            return
        }

        // Check that character has enough experience
        if (this.experience < 2) {
            alert(`Cannot add '${emphasis_name}' emphasis for ${skill_name} as`+
                  ` you do not have enough remaining experience (2 required).`)
            return
        }

        this.skills[skill_name].emphases.push(emphasis_name);
        this.experience -= 2;
        this.refresh_display();
    }

    remove_emphasis(skill_name, emphasis_name=null) {
        let emphases = this.skills[skill_name].emphases;

        console.log(emphases);

        if (emphasis_name !== null) {
            if (!(emphases.includes(emphasis_name))) {
                // Emphasis is not currently included for this player
                alert(`Could not remove emphasis ${emphasis_name} for skill` + 
                      ` ${skill_name} as this character does not have it.`)
                return;
            }

            this.skills[skill_name].emphases = emphases.filter(function(e) {
                return e !== emphasis_name;
            })
        }

        else {
            // Check if there are emphases to remove
            if (this.skills[skill_name].emphases.length == 0) {
                alert(`Attempting to remove emphasis from '${skill_name} when `+
                      `there are none to remove.`)
                return;
            }
            // No emphasis was specified, remove last one in the list
            emphasis_name = this.skills[skill_name].emphases.pop();
        }

        this.experience += 2;
        this.refresh_display();
        console.log(`Removed emphasis '${emphasis_name}' from '${skill_name}'.`)
    }

	modify_skill(skill_name, increase=true) {
        if (increase) { // Increase the skill

            // If rank is already at 10, it cannot increase any further.
            if (this.skills[skill_name].rank == 10) {
                alert(`'${skill_name} is already at Rank 10. It cannot go higher.`);
                return;
            }

            var exp_cost = this.skills[skill_name].rank + 1;
            if (exp_cost > this.experience) {
                alert(`Cannot increase ${skill_name} to rank ${exp_cost} due to insufficient experience points.`);
                return
            }

            // At this point, the transaction has been approved.
            this.skills[skill_name].rank += 1;
            this.experience -= exp_cost;
        }

        else { // Decrease the skill

            // Check for limiting level from starting skills
            // Should not need to check for emphases, as they will be accounted
            // for in starting skill rank.
            var starting_rank;
            if (skill_name in this.starting_skills) {
                starting_rank = this.starting_skills[skill_name].rank;
            } else {
                starting_rank = 0;
            }

            var current_rank = this.skills[skill_name].rank;

            if (current_rank == starting_rank) {
                alert(`Cannot reduce Rank for '${skill_name}' below ` +
                      `starting Rank of '${starting_rank}.`)
                return;
            }

            if (current_rank > 1) {
                // Decrease is allowed, just reduce the rank by one
                var exp_refund = current_rank;
                this.skills[skill_name].rank -= 1;
                this.experience += exp_refund;

                let max_emphases
            }


            if (this.skills[skill_name].rank > 1) {
                // Reduce Skill Rank
                var exp_refund = this.skills[skill_name].rank;
                this.skills[skill_name].rank -= 1;
                this.experience += exp_refund;

                let max_emphases = Math.ceil(this.skills[skill_name].rank / 2);
                while (this.skills[skill_name].emphases.length > max_emphases) {
                    this.remove_emphasis(skill_name);
                }

            }
            else {
                // Remove Skill (Set Rank to 0)
                this.remove_skill(skill_name);
            }
        }

        console.log("Experience:", this.experience);
        this.refresh_display();
    }

    modify_trait(trait_name, increase=true) {
        if (increase) { // Increase the trait

            // If trait is already at Rank 10, it cannot be improved further
            if (this.traits[trait_name] == 10) {
                alert(`Cannot increase trait '${trait_name}' above Rank 10.`);
                return;
            }

            var exp_cost;
            if (trait_name == "Void") {
                exp_cost = (this.traits[trait_name] + 1) * 6;
            }
            else {
                exp_cost = (this.traits[trait_name] + 1) * 4;
            }

            // Reject if not enough Experience is left
            if (exp_cost > this.experience) {
                alert(`Cannot increase trait '${trait_name}' due to insufficient experience.`);
                return;
            }

            // Eveyrthing is okay, proceed with transaction
            // NOTE: Need to check for new Emphasis allowances here
            this.traits[trait_name] += 1;
            this.experience -= exp_cost;
        }

        else { // Decrease the trait

            // If the trait is at Rank 2, it cannot go lower (as 2 is default)
            if (this.traits[trait_name] == 2) {
                alert(`Cannot decrease trait '${trait_name} below Rank 2 (starting value).`);
                return;
            }

            var exp_refund;
            if (trait_name == "Void") {
                exp_refund = this.traits[trait_name] * 6;
            }
            else {
                exp_refund = this.traits[trait_name] * 4;
            }

            //
            // NOTE: Check for illegal emphases here.
            //

            // Everything is okay, proceed with transaction
            this.traits[trait_name] -= 1;
            this.experience += exp_refund;
        }
        this.refresh_display();
    }

    // Set Starting Skills and Traits //////////////////////////////////////////

    set_family(family) {
        var trait_changes = get_family_traits(family);
        for (let trait in trait_changes) {
            this.traits[trait] += trait_changes[trait];
        }
        console.log("Family Traits:", trait_changes);
        this.family = family;

        this.set_char_creation_stage("set_family");

    }

    set_school(school_name) {
        this.school = school_name;
        console.log(school_name);
        var school_info = get_school_info(school_name);
        // Set starting skills, and other values
        
        this.set_char_creation_stage("set_school");
    }

    set_skill_choice(skill_name) {
        // Update other skill choices
        this.set_char_creation_stage("select_skill");
    }

    // Placeholder Functions for Character Creation ////////////////////////////

    set_char_creation_stage(stage_name) {
        console.log("SET_CHAR_CREATION_STAGE method not overwritten!", stage_name);
    }

    refresh_display() {
        console.log("REFRESH_DISPLAY method has not been overwritten!");
    }



    // Calculate Output ////////////////////////////////////////////////////////

    calculate_skill_dice(skill_name) {
        let skill = this.skills[skill_name];
        let rank = skill.rank;

        let traits = skill.trait;
        let dice_to_keep = 0;
        traits.forEach(t => {
            let trait_score = this.traits[t];
            if (trait_score > dice_to_keep) {
                dice_to_keep = trait_score;
            }
        })

        let dice_to_roll = rank + dice_to_keep;
        return [dice_to_roll, dice_to_keep];
    }

    calculate_ring(ring) {
    	switch (ring) {
    		case "Air": return Math.min(this.traits["Awareness"],
    		                            this.traits["Willpower"]);
    		case "Earth": return Math.min(this.traits["Stamina"],
                                          this.traits["Willpower"]);
    		case "Fire": return Math.min(this.traits["Agility"],
                                         this.traits["Intelligence"]);
            case "Water": return Math.min(this.traits["Perception"],
                                          this.traits["Strength"]);
            case "Void": return this.traits["Void"];
    	}
	}

    calculate_insight() {
        var total_insight = 0;
        for (let skill in this.skills) {
            total_insight += this.skills[skill].rank;
        }

        for (let ring of ["Air", "Earth", "Fire", "Water", "Void"]) {
            total_insight += this.calculate_ring(ring) * 10;
        }
        return total_insight;
    }

    calculate_rank() {
        return "RANK_PLACEHOLDER";
    }

    clan() {
        if (this.family == null) {
            return "PLACEHOLDER_CLAN";
        } else {
            return this.family.split("_")[0];
        }
    }

    // Save and Load ///////////////////////////////////////////////////////////

    check_storage() {
        if (typeof(localStorage) !== "undefined") {
            return true;
        } else {
            alert("Unfortunately your browser does not support Local Storage." + 
                "\nYou will be unable to save characters.");
            return false;
        }
    }

    save_character() {
        if (!(this.check_storage)) {return;}
        console.log("Saving character")
        var storage_dict = {};
        storage_dict["traits"] = this.traits;
        storage_dict["skills"] = this.skills;
        storage_dict["experience"] = this.experience;
        storage_dict["total_experience"] = this.total_experience;

        localStorage.setItem("character", JSON.stringify(storage_dict));
    }

    load_character() {
        if (!(this.check_storage)) {return;}
        console.log("Loading character")
        var storage_dict = JSON.parse(localStorage.getItem("character"));
        this.skills = storage_dict["skills"];
        this.traits = storage_dict["traits"];
        this.experience = storage_dict["experience"];
        this.total_experience = storage_dict["total_experience"];
        this.refresh_display();
    }

    // Debugging ///////////////////////////////////////////////////////////////
    console_log_skills() {
        for (var skill_name in this.skills) {
            console.log(typeof this.skills);
            let skill = this.skills[skill_name];
            if (skill.rank == 0) { continue; }

            let display_line = [];
            display_line.push(skill_name);
            display_line.push(String(skill.rank));
            display_line.push(String(skill.trait));
            display_line.push(this.display_skill_dice(skill_name));
            display_line.push(String(skill.emphases));
            console.log(display_line.join(","));
        }
    }

// End Class
}

