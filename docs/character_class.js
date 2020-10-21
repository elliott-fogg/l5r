// constants ///////////////////////////////////////////////////////////////////

const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];
const trait_headings = ["Ring", "Trait", "Rank"];

class Character {

    // Constructor Functions
    constructor() {
        const self = this;
        this.total_experience = 10;
        this.experience = this.total_experience;
        this.skills = {};
        this.traits = {};
        this.setup_traits();
        this.fill_trait_table();
        this.fill_skill_table();
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
            this.fill_skill_table();
            this.display_experience();
        }

        return true;
    }

    // Functions for dealing with displaying skills ////////////////////////////

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

    default_function() {
        console.log("Triggered")
    }

    create_button(btn_type, btn_text) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = btn_type;
        btn.value = btn_text;
        return btn;
    }

    append_increment_button(row, attr_type, attr_name, increase) {
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

        row.appendChild(btn);
    }

    // append_trait_increment_button(row, inc_amount, trait_name) {
    //     var btn_text = (inc_amount == -1) ? '-' : '+';
    //     var btn = this.create_button("inc_dec_btn", btn_text);

    //     var trait = this.traits[trait_name];

    //     btn.onclick = function() {
    //         this.traits[trait_name] = maxmin(this.traits[trait_name] + inc_amount, 0, 10);
    //         console.log(this.traits);
    //         this.fill_trait_table();
    //         this.fill_skill_table();
    //     }.bind(this);

    //     row.appendChild(btn);
    // }

    // append_skill_increment_button(row, inc_amount, skill_name) {
    //     var btn;
    //     if (inc_amount == -1) {
    //         // Create the Decrease Button
    //         btn = this.create_button("inc_dec_btn", "-");
    //         btn.onclick = function() {
    //             this.decrease_skill(skill_name);
    //             this.fill_skill_table();
    //         }.bind(this);
    //     } else {
    //         // Create the Increase Button
    //         btn = this.create_button("inc_dec_btn", "+");
    //         btn.onclick = function() {
    //             this.increase_skill(skill_name);
    //             this.fill_skill_table();
    //         }.bind(this);
    //     }

    //     row.appendChild(btn);
    // }

    // Increase / Decrease Skills //////////////////////////////////////////////

    display_experience() {
        var lbl = document.getElementById("experience_label");
        lbl.innerHTML = `Current Experience: ` +
        `<span class='bolded'>${this.experience}</span>  ` +
        `(Total: ${this.total_experience})`;
    }

    modify_skill(skill_name, increase=true) {
        if (increase) { // Increase the skill

            // If rank is already at 10, it cannot increase any further.
            if (this.skills[skill_name].rank == 10) {
                alert(`'${skill_name} is already at Rank 10. It cannot go higher.`);
                return;
            }

            console.log("Attempting to increase");
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

            // If skill is already at 0, it cannot decrease further.
            if (this.skills[skill_name].rank == 0) {
                alert(`${skill_name} is already at Rank 0. It cannot go lower.`)
                return;
            }

            var previous_exp_cost = this.skills[skill_name].rank;
            this.skills[skill_name].rank -= 1;
            this.experience += previous_exp_cost;
        }

        console.log("Experience:", this.experience);
        this.display_experience();
        this.fill_skill_table();
    }

    // increase_skill(skill_name) {
    //     // If rank is already at 10, it cannot increase any further.
    //     if (this.skills[skill_name].rank == 10) {
    //         alert(`'${skill_name} is already at Rank 10. It cannot go higher.`);
    //         return;
    //     }

    //     console.log("Attempting to increase");
    //     var exp_cost = this.skills[skill_name].rank + 1;
    //     if (exp_cost > this.experience) {
    //         alert(`Cannot increase ${skill_name} to rank ${exp_cost} due to insufficient experience points.`);
    //         return
    //     }

    //     // At this point, the transaction has been approved.
    //     this.skills[skill_name].rank += 1;
    //     this.experience -= exp_cost;
    //     console.log("Experience:", this.experience);
    //     this.display_experience();
    // }

    // decrease_skill(skill_name) {
    //     // If skill is already at 0, it cannot decrease further.
    //     if (this.skills[skill_name].rank == 0) {
    //         alert(`${skill_name} is already at Rank 0. It cannot go lower.`)
    //         return;
    //     }

    //     var previous_exp_cost = this.skills[skill_name].rank;
    //     this.skills[skill_name].rank -= 1;
    //     this.experience += previous_exp_cost;
    //     console.log("Experience:", this.experience);
    //     this.display_experience();
    // }

    modify_trait(trait_name, increase=true) {
        if (increase) { // Increase the trait

            console.log("Increasing trait " + trait_name);

        }

        else { // Decrease the trait

            console.log("Decreasing trait " + trait_name);

        }

        this.fill_trait_table();
        this.fill_skill_table();

    }

    increase_trait(trait_name) {
        console.log("Increasing trait " + trait_name);
    }

    decrease_trait(trait_name) {
        console.log("Decreasing trait " + trait_name);
    }

    // Populate Tables /////////////////////////////////////////////////////////

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
        tbdy.innerHTML = ''; // Reset tBody incase it we are refilling the table

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

                this.append_increment_button(row, "trait", trait_name, true);
                this.append_increment_button(row, "trait", trait_name, false);
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
        for (skill_name in this.skills) {

            var rank0 = (this.skills[skill_name].rank == 0) ? true : false;

            let row = tbdy.insertRow(-1);
            let skill_info_array = this.get_skill_info(skill_name);
            skill_info_array.forEach(skill_info => {
                let cell = row.insertCell(-1);
                if (rank0) {
                    cell.innerHTML = `<span style="color:grey">${skill_info}</span>`;
                } else {
                    cell.innerHTML = skill_info;
                }
            })

            this.append_increment_button(row, "skill", skill_name, true);
            this.append_increment_button(row, "skill", skill_name, false);
        }
    }

    // End Class
}

function populate_skills(player) {
    console.log("adding skills")
    for (let skill_name in default_skills) {
        console.log(skill_name);
        if (skill_name in player.skills){
            continue;
        }
        var success = player.add_skill(skill_name);
        if (!success) {break;};
    }
}

function create_tables(ring_table_id, skill_table_id) {
    var player = new Character();
    // player.setup_ring_table(ring_table_id);
    // player.setup_skill_table(skill_table_id);

    // player.add_skill("Dancing");
    // player.console_log_skills();
    // player.skills["Acting"].rank += 1;
    // player.skills["Medicine"].rank += 2;

    player.add_skill("Acting");
    player.modify_skill("Acting");
    player.modify_skill("Acting");
    populate_skills(player);
    player.modify_skill("Acting");
    
}

