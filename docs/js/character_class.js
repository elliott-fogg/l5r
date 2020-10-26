// constants ///////////////////////////////////////////////////////////////////
const ring_headings = ["Ring", "Rank"];
const trait_headings = ["Trait", "Rank"];
const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];


class Character {

    // Constructor Functions
    constructor(starting_experience) {
        const self = this;
        this.total_experience = starting_experience;
        this.experience = this.total_experience;
        this.skills = {};
        this.traits = {};
        this.setup_traits();
        this.bind_set_exp_button();
        this.refresh_display();

    }

    setup_traits() {
        for (let ring_name in rings) {
            rings[ring_name].forEach( trait_name => {
                this.traits[trait_name] = 2;
            })
        }
    }

    bind_set_exp_button() {
        var set_exp_button = document.getElementById("reset_exp");
        set_exp_button.onclick = function () {
            let prompt_text = "How much experience should this character have?"
            var new_exp_str = prompt(prompt_text);

            if (new_exp_str == null) {return;}

            var new_exp = parseInt(new_exp_str);

            if (isNaN(new_exp)) {
                alert(`'${new_exp_str}' does not format to an integer. Please try again.`);
                return;
            }

            let conf_text = `Create a new character with ${new_exp} exp?` +
            "\n(Please note that this will reset your current character!)" 
            if (confirm(conf_text)) {
                this.skills = {};
                this.traits = {};
                this.setup_traits();
                this.total_experience = new_exp;
                this.experience = this.total_experience;
                this.refresh_display();
            }
        }.bind(this);
    }

    // Adding Skills ///////////////////////////////////////////////////////////

    add_skill(skill_name, hold_refresh=false) {
        // Check if it is a valid skill name
        if (!(skill_name in default_skills)) {
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

        this.skills[skill_name] = {
            rank: 1,
            trait: default_skills[skill_name].trait,
            class: default_skills[skill_name].class,
            emphases: []
        };
        this.experience -= 1;

        if (!hold_refresh) {
            this.refresh_display();
        }

        return true;
    }

    remove_skill(skill_name) {
        // Check rank of the skill. If higher than Rank 1, double check delete.
        // If skill is only Rank 1, don't ask before removing.
        var skill_rank = this.skills[skill_name].rank;
        if (skill_rank > 1) {
            if (!(confim(`'${skill_name} is Rank ${skill_rank}. Are you sure you want to remove it?`))) {
                console.log("Cancelling skill removal.")
                return;
            }
        }

        // Calculated refund exp for levels
        var exp_refund = 0; 
        for (let i = skill_rank; i > 0; i--) {
            exp_refund += i;
        }

        // Calculate total emphases refund all at once
        this.skills[skill_name].emphases.forEach(function() {
            console.log("Emphases refund");
            exp_refund += 2;
        });

        this.experience += exp_refund;
        delete this.skills[skill_name];
    }

    add_emphasis(skill_name, emphasis_name) {
        // Check that emphasis belongs to skill
        if (!(default_skills[skill_name].emphases.includes(emphasis_name))) {
            console.log(default_skills[skill_name].emphases)
            console.log(emphasis_name in default_skills[skill_name].emphases);
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

    // Dice Rolling ////////////////////////////////////////////////////////////

    roll_skill(skill_name, emphasis_name=null) {
        console.log("Rolling " + skill_name + emphasis_name);

        let roll_textarea = document.getElementById("dice_roller_output");

        let skill_dice = this.calculate_skill_dice(skill_name);
        let has_emphasis = (emphasis_name !== null);

        let roll_title = `<span class="text_h2">${skill_name}`;
        roll_title += (has_emphasis) ? ` [${emphasis_name}]` : "";
        roll_title += "</span>";

        roll_textarea.innerHTML = get_roll_text(roll_title, skill_dice[0],
                                                skill_dice[1], has_emphasis);
    }

    roll_ring(ring_name) {
        console.log("Rolling " + ring_name + " ring")

        var roll_output = document.getElementById("dice_roller_output");
        var ring_rank = this.calculate_ring(ring_name);
        let roll_title = `<span class="text_h2">${ring_name} Ring</span>`;

        roll_output.innerHTML = get_roll_text(roll_title, ring_rank, ring_rank);
    }

    roll_trait(trait_name) {
        console.log("Rolling " + trait_name);

        var roll_output = document.getElementById("dice_roller_output");
        let roll_title = `<span class="text_h2">${trait_name}</span>`;
        let trait_rank = this.traits[trait_name];
        roll_output.innerHTML = get_roll_text(roll_title, trait_rank, 
                                              trait_rank);
    }

    // Functions for dealing with displaying skills ////////////////////////////

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

    display_skill_dice(skill_name) {
        let dice = this.calculate_skill_dice(skill_name);
        return `${dice[0]}k${dice[1]}`;
    }

    calculate_ring(ring) {
        if (ring == "Air") { return Math.min(this.traits["Awareness"],
                                             this.traits["Reflexes"]);}
        if (ring == "Earth") { return Math.min(this.traits["Stamina"],
                                             this.traits["Willpower"]);}
        if (ring == "Fire") { return Math.min(this.traits["Agility"],
                                             this.traits["Intelligence"]);}
        if (ring == "Water") { return Math.min(this.traits["Perception"],
                                             this.traits["Strength"]);}
        if (ring == "Void") { return this.traits["Void"];}
    }

    // Button Functions ////////////////////////////////////////////////////////

    create_increment_button(attr_type, attr_name, increase) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "inc_dec_btn";
        btn.value = (increase) ? "+" : "-";

        if (attr_type == "trait") {
            btn.onclick = function() {this.modify_trait(attr_name, increase);}
                .bind(this);
        }

        else if (attr_type == "skill") {
            btn.onclick = function() {this.modify_skill(attr_name, increase);}
                .bind(this);
        }

        else {
            alert("Unknown button type");
            return;
        }

        return btn; 
    }

    create_skill_button(skill_name) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "label_button";
        btn.value = skill_name;

        btn.onclick = function() {
            this.roll_skill(skill_name);
            console.log("Clicking on skill " + skill_name);
        }.bind(this);

        return btn;
    }

    create_emphasis_button(skill_name, emphasis) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "label_button";
        btn.value = emphasis;

        btn.onclick = function() {
            this.roll_skill(skill_name, emphasis);
            console.log("Clicking on emphasis " + emphasis);
        }.bind(this);

        return btn;
    }

    create_ring_button(ring_name) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "label_button";
        btn.value = ring_name;

        btn.onclick = function() {
            this.roll_ring(ring_name);
        }.bind(this);

        return btn;
    }

    create_trait_button(trait_name) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "label_button";
        btn.value = trait_name;

        btn.onclick = function() {
            this.roll_trait(trait_name);
        }.bind(this);

        return btn;
    }

    create_add_emphasis_list(skill_name) {

        var emphasis_list = default_skills[skill_name].emphases;
        var current_emphases = this.skills[skill_name].emphases;
        var missing_emphases = emphasis_list.filter(function(em) {
            return (!(current_emphases.includes(em)));
        }.bind(this));

        if (missing_emphases.length == 0) {
            return;
        }

        var selectbox = document.createElement("select");
        selectbox.className = "add_emphasis_select"
        selectbox.onchange = function() {
            this.add_emphasis(skill_name, selectbox.value);
        }.bind(this);

        // Disabled select if character has reached maximum number of emphases
        // for this skill
        let max_emphases = Math.ceil(this.skills[skill_name].rank / 2);
        if (current_emphases.length >= max_emphases) {
            selectbox.disabled = true;
        }

        let default_option = document.createElement("option");
        default_option.value = "DEFAULT";
        default_option.label = "+";
        default_option.style = "display:none";
        default_option.selected = "selected";
        selectbox.appendChild(default_option);

        missing_emphases.forEach(em => {
            if (this.skills[skill_name].emphases.includes(em)) {
                return;
            }
            let option = document.createElement("option");
            option.value = em;
            option.label = em;
            selectbox.appendChild(option);
        });

        return selectbox;
    }

    // Increase / Decrease Skills //////////////////////////////////////////////

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

    // Display Information /////////////////////////////////////////////////////

    display_experience() {
        var lbl = document.getElementById("experience_label");
        lbl.innerHTML = `Current Experience: ` +
        `<span class='bolded'>${this.experience}</span>  ` +
        `(Total: ${this.total_experience})`;
    }

    fill_trait_table() {
        var table = document.getElementById("trait_table");

        // If the tHead of this table does not exist, create it.
        if (table.tHead == null) {
            let header = table.createTHead();
            let header_row = header.insertRow(0);

            header_row.insertCell(-1).innerHTML = "<b><u>Ring</u></b>";

            let ringrank_header = header_row.insertCell(-1);
            ringrank_header.innerHTML = "<b><u>Rank</u></b>";
            ringrank_header.className = "border_right";

            header_row.insertCell(-1).innerHTML = "<b><u>Trait</u></b>";
            header_row.insertCell(-1).innerHTML = "<b><u>Rank</u></b>";

        };

        let tbdy = (table.tBodies.length == 1) ? table.tBodies[0] : table.createTBody();
        tbdy.innerHTML = ''; // Reset tBody incase we are refilling the table

        for (let ring_name in rings) {
            let first = true;
            rings[ring_name].forEach( trait_name => {
                let row = tbdy.insertRow(-1);
                if (first) {

                    // Create Ring Name Button
                    let ring_type = row.insertCell(-1);
                    ring_type.rowSpan = rings[ring_name].length;
                    ring_type.appendChild(this.create_ring_button(ring_name));

                    // Show Ring rank value
                    let ring_rank = row.insertCell(-1);
                    ring_rank.rowSpan = rings[ring_name].length;
                    ring_rank.innerHTML = this.calculate_ring(ring_name);
                    ring_rank.className = "border_right";

                    first = false;
                };

                // Create Trait Name Button
                row.insertCell(-1).appendChild(this.create_trait_button(
                                                                trait_name));

                // Create div for Trait Rank value with Incrementer Buttons
                let trait_rank_cell = row.insertCell(-1);
                let trait_rank_div = document.createElement("div");

                let trait_rank_text = document.createElement("p");
                trait_rank_text.className = "rank_value"
                trait_rank_text.innerHTML = this.traits[trait_name];
                trait_rank_div.appendChild(trait_rank_text);
                trait_rank_div.appendChild(this.create_increment_button(
                                                "trait", trait_name, true));
                trait_rank_div.appendChild(this.create_increment_button(
                                                "trait", trait_name, false));
                trait_rank_cell.appendChild(trait_rank_div);
            })
        }
    }

    fill_skill_table(show_all_skills=false) {
        var table = document.getElementById("skill_table");

        // If the tHead of this table does not exist, create it.
        if (table.tHead == null) {
            let header = table.createTHead();
            let header_row = header.insertRow(0);

            skill_headings.forEach(h => { // skill_headings is const at T.O.P.
                let cell = header_row.insertCell(-1);
                cell.innerHTML = `<b><u>${h}</u></b>`;
            })
        };

        let tbdy = (table.tBodies.length == 1) ? table.tBodies[0] : table.createTBody();
        tbdy.innerHTML = ''; // Reset TBody incase it already exists

        let skill_name = "";
        let skill_name_list = Object.keys(this.skills).sort();

        skill_name_list.forEach(skill_name => {
            this.fill_skill_row(tbdy.insertRow(-1), skill_name);
        })
    }

    fill_skill_row(row, skill_name) {
        // Clickable Skill Name
        row.appendChild(this.create_skill_button(skill_name)); // Clickable Name

        // Rank value with incrementer buttons
        var rank_div = document.createElement("div");
        var skill_rank = document.createElement("p");
        skill_rank.className = "rank_value";
        skill_rank.innerHTML = String(this.skills[skill_name].rank);
        rank_div.appendChild(skill_rank);
        // Add Increment Buttons
        rank_div.appendChild(this.create_increment_button(
                                    "skill", skill_name, true));
        rank_div.appendChild(this.create_increment_button(
                                    "skill", skill_name, false));
        row.insertCell(-1).appendChild(rank_div);

        // Associated Trait
        row.insertCell(-1).innerHTML = this.skills[skill_name].trait;

        // Text representation of associated dice roll
        row.insertCell(-1).innerHTML = this.display_skill_dice(skill_name);

        // Add Emphases
        var emphasis_div = document.createElement("div");
        this.skills[skill_name].emphases.forEach(em => {
            let btn = this.create_emphasis_button(skill_name, em);
            emphasis_div.appendChild(btn);
        })
        // Add Emphasis Select Box
        var emphasis_select = this.create_add_emphasis_list(skill_name);
        if (!(emphasis_select == null)) {
            emphasis_div.appendChild(emphasis_select);
        }
        row.insertCell(-1).appendChild(emphasis_div);
    }

    get_skill_info(skill_name) {
        let skill = this.skills[skill_name];
        let display_data = [];
        display_data.push(skill_name);
        display_data.push(String(skill.rank));
        display_data.push(String(skill.trait));
        display_data.push(this.display_skill_dice(skill_name));
        display_data.push(String(skill.emphases));
        return display_data;
    }

    populate_select_skill() {
        var select_skill = document.getElementById("select_add_skill");
        select_skill.innerHTML = ""; // Reset the options before repopulating

        select_skill.onchange = function() {
            this.add_skill(select_skill.value);
        }.bind(this);

        var default_option = document.createElement("option");
        default_option.value = "NO_SKILL";
        default_option.label = "Add a skill...";
        default_option.style = "display:none";
        default_option.selected = "selected";
        select_skill.appendChild(default_option);

        var addable_skills = default_skill_names.filter(function(s) {
            return !(s in this.skills);
        }.bind(this)).sort();

        addable_skills.forEach(skill_name => {
            let option = document.createElement("option");
            option.value = skill_name;
            option.label = skill_name;
            select_skill.appendChild(option);
        });
    }

    refresh_display() {
        this.fill_trait_table();
        this.fill_skill_table();
        this.display_experience();
        this.populate_select_skill();
    }

    // End Class
}

function populate_skills(player, limit=6) {
    var skills_added = 0;
    for (let skill_name in default_skills) {
        if (skill_name in player.skills){
            continue;
        }
        var success = player.add_skill(skill_name);
        if (!success) {break;};
        skills_added += 1;
        if (skills_added >= limit) {break;};
    }
}

