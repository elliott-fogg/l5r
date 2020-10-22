// constants ///////////////////////////////////////////////////////////////////

const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];
const trait_headings = ["Ring", "Trait", "Rank"];

class Character {

    // Constructor Functions
    constructor(starting_experience) {
        const self = this;
        this.total_experience = starting_experience;
        this.experience = this.total_experience;
        this.skills = {};
        this.traits = {};
        this.setup_traits();
        this.refresh_display();
        // this.bind_add_skill_button();
    }

    setup_traits() {
        rings.forEach(ring => {
            ring.traits.forEach( trait_name => {
                this.traits[trait_name] = 2;
            })
        })
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
        var skill_rank = this.skills[skill_name].rank;
        if (skill_rank > 1) {
            if (!(confim(`'${skill_name} is Rank ${skill_rank}. Are you sure you want to remove it?`))) {
                console.log("Cancelling skill removal.")
                return;
            }
        }

        // If skill is only Rank 1, don't ask before removing.

        // Calculated refund exp for levels
        var exp_refund = 0; 
        for (let i = skill_rank; i > 0; i--) {
            exp_refund += i;
        }

        // Calculate refund exp for emphases
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
        }

        this.skills[skill_name].emphases.push(emphasis_name);
        this.refresh_display();
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
        if (ring == "Air") { return this.awareness + this.reflexes; }
        else if (ring == "Earth") { return this.stamina + this.willpower; }
        else if (ring == "Fire") { return this.agility + this.intelligence; }
        else if (ring == "Water") { return this.perception + this.strength; }
        else if (ring == "Void") { return this.void; }
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
            console.log("Clicking on emphasis " + emphasis);
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
        selectbox.id = "emphasis_select";
        selectbox.onchange = function() {
            this.add_emphasis(skill_name, selectbox.value);
        }.bind(this);

        let default_option = document.createElement("option");
        default_option.value = "DEFAULT";
        default_option.label = "Add emphasis...";
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

            trait_headings.forEach(h => {
                let cell = header_row.insertCell();
                cell.innerHTML = `<b><u>${h}</u></b>`;
            })
        };

        let tbdy = (table.tBodies.length == 1) ? table.tBodies[0] : table.createTBody();
        tbdy.innerHTML = ''; // Reset tBody incase we are refilling the table

        rings.forEach( ring => {
            let first = true;
            ring.traits.forEach( trait_name => {
                let row = tbdy.insertRow(-1);
                if (first) {
                    let ring_type = row.insertCell(0);
                    ring_type.rowSpan = ring.traits.length;
                    ring_type.innerHTML = `<b>${ring.name}</b>`;
                    first = false;
                };
                row.insertCell().innerHTML = trait_name;
                row.insertCell().innerHTML = this.traits[trait_name];

                row.appendChild(this.create_increment_button("trait", trait_name, true));
                row.appendChild(this.create_increment_button("trait", trait_name, false));
            })
        })
    }

    fill_skill_table(show_all_skills=false) {
        var table = document.getElementById("skill_table");

        // If the tHead of this table does not exist, create it.
        if (table.tHead == null) {
            let header = table.createTHead();
            let header_row = header.insertRow(0);
            skill_headings.forEach(h => {
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
        row.appendChild(this.create_skill_button(skill_name)); // Clickable Name
        row.insertCell(-1).innerHTML = this.skills[skill_name].rank;
        row.insertCell(-1).innerHTML = this.skills[skill_name].trait;
        row.insertCell(-1).innerHTML = this.display_skill_dice(skill_name);

        // Add Emphases
        var emphasis_div = document.createElement("div");
        this.skills[skill_name].emphases.forEach(em => {
            let btn = this.create_emphasis_button(skill_name, em);
            emphasis_div.appendChild(btn);
        })
        row.insertCell(-1).appendChild(emphasis_div);

        // Add Increment Buttons
        var increment_div = document.createElement("div");
        increment_div.appendChild(this.create_increment_button(
                                    "skill", skill_name, true));
        increment_div.appendChild(this.create_increment_button(
                                    "skill", skill_name, false));
        row.insertCell(-1).appendChild(increment_div);

        // Add Emphasis Select Box
        var emphasis_select = this.create_add_emphasis_list(skill_name);
        if (!(emphasis_select == null)) {
            row.insertCell(-1).appendChild(emphasis_select);
        }
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
        }.bind(this));

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

