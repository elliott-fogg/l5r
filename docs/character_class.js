function create_button(btn_type, btn_text) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = btn_type;
    btn.value = btn_text;
    return btn;
}

class Character {

    constructor() {
        const self = this;
        this.skills = {};
        this.traits = {};
        this.setup_traits();
        this.setup_skills();
    }

    setup_traits() {
        rings.forEach(ring => {
            ring.traits.forEach( trait_name => {
                this.traits[trait_name] = 2;
            })
        })
    }

    setup_skills() {
        let skill_data = get_skills();
        this.skills = {};
        skill_data.forEach(skill => {
            this.skills[skill.name] = {
                rank: 0,
                trait: skill.trait,
                class: skill.class,
                emphases: []
            };
        })
    }

    display_skills() {
        this.skills.forEach(skill => {
            let cell_list = [];
        })
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
        if (ring == "air") { return this.awareness + this.reflexes; }
        else if (ring == "earth") { return this.stamina + this.willpower; }
        else if (ring == "fire") { return this.agility + this.intelligence; }
        else if (ring == "water") { return this.perception + this.strength; }
        else if (ring == "void") { return this.void; }
    }

    default_function() {
        console.log("Triggered")
    }

    append_trait_increment_button(row, inc_amount, trait_name) {
        var btn_text = (inc_amount == -1) ? '-' : '+';
        var btn = create_button("inc_dec_btn", btn_text);

        let trait_info = this.traits[trait_name];
        let function_to_call = this.fill_ring_table;

        btn.addEventListener("click", function(){
            console.log(`${trait_name} ${inc_amount}`);
            // console.log(this.traits[trait_name]);
            console.log(trait_info);
            // this.traits[trait_name] += inc_amount;
            // this.fill_ring_table("trait_table");
            function_to_call("trait_table");

            // ERROR HERE as 'this' is not referring to the PLAYER object at runtime
        });
        row.appendChild(btn);
    }

    append_skill_increment_button(row, inc_amount, skill_name) {
        var btn_text = (inc_amount == -1) ? '-' : '+';
        var btn = create_button("inc_dec_btn", btn_text);
        btn.addEventListener("click", function(){
            console.log(`${skill_name} ${inc_amount}`);
        });
        row.appendChild(btn);
    }

    setup_skill_table(table_id) {
        const table = document.getElementById(table_id);
        let header = table.createTHead();
        let header_row = header.insertRow(0);
        let headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis", "Class"];
        headings.forEach(h => {
            let cell = header_row.insertCell(-1);
            cell.innerHTML = `<u><b>${h}</b></u>`;
        })

        this.fill_skill_table(table_id);
    }

    fill_skill_table(table_id) {
        let table = document.getElementById(table_id);
        let tbdy = table.createTBody(); // Returns TBody if it already exists
        tbdy.innerHTML = ''; // Reset TBody incase it already exists

        let skill_name = "";
        for (skill_name in this.skills) {
            if (this.skills[skill_name].rank == 0) {
                continue;
            }
            let row = tbdy.insertRow(-1);
            let skill_info_array = this.get_skill_info(skill_name);
            skill_info_array.forEach(skill_info => {
                let cell = row.insertCell(-1);
                cell.innerHTML = skill_info;
            })
            this.append_skill_increment_button(row, 1, skill_name);
            this.append_skill_increment_button(row, -1, skill_name);
        }
    }

    // create_skill_table(table_id) {
    //     const table = document.getElementById(table_id);
    //     let header = table.createTHead();
    //     let header_row = header.insertRow(0);
    //     let headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis", "Class"];
    //     headings.forEach(h => {
    //         let cell = header_row.insertCell(-1);
    //         cell.innerHTML = `<u><b>${h}</b></u>`;
    //     })

    //     let tbdy = table.createTBody();
    //     let skill_name = "";
    //     for (skill_name in this.skills) {
    //         if (this.skills[skill_name].rank == 0) {
    //             continue;
    //         }
    //         let row = tbdy.insertRow(-1);
    //         let skill_info_array = this.get_skill_info(skill_name);
    //         skill_info_array.forEach(skill_info => {
    //             let cell = row.insertCell(-1);
    //             cell.innerHTML = skill_info;
    //         })
    //         this.append_skill_increment_button(row, 1, skill_name);
    //         this.append_skill_increment_button(row, -1, skill_name);
    //     }
    // }

    setup_ring_table(table_id) {
        var table = document.getElementById(table_id);
        let header = table.createTHead();
        let header_row = header.insertRow(0);

        var headings = ["Ring", "Trait", "Level"];
        for (let i = 0; i < headings.length; i++) {
            let cell = header_row.insertCell(i);
            cell.innerHTML = `<b><u>${headings[i]}</u></b>`;
        }

        this.fill_ring_table(table_id);
    }

    fill_ring_table(table_id) {
        let table = document.getElementById("trait_table");
        let tbdy = table.createTBody();
        tbdy.innerHTML = '';

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

                this.append_trait_increment_button(row, 1, trait_name);
                this.append_trait_increment_button(row, -1, trait_name);
            })
        })
    }

    // create_ring_table(table_id) {
    //     const table = document.getElementById(table_id);
    //     let header = table.createTHead();
    //     let header_row = header.insertRow(0);
        
    //     var headings = ["Ring", "Trait", "Level"];
    //     for (let i = 0; i < headings.length; i++) {
    //         let cell = header_row.insertCell(i);
    //         cell.innerHTML = `<b><u>${headings[i]}</u></b>`;
    //     }

    //     let tbdy = table.createTBody();

    //     rings.forEach( ring => {
    //         let first = true;
    //         ring.traits.forEach( trait_name => {
    //             let row = tbdy.insertRow(-1);
    //             if (first) {
    //                 let ring_type = row.insertCell(0);
    //                 ring_type.rowSpan = ring.traits.length;
    //                 ring_type.innerHTML = `<b>${ring.name}</b>`;
    //                 first = false;
    //             };
    //             row.insertCell().innerHTML = trait_name;
    //             row.insertCell().innerHTML = this.traits[trait_name];

    //             this.append_trait_increment_button(row, 1, trait_name);
    //             this.append_trait_increment_button(row, -1, trait_name);
    //         })
    //     })
    // }
}


function create_tables(ring_table_id, skill_table_id) {
    var player = new Character();
    player.skills["Acting"].rank += 1;
    player.skills["Medicine"].rank += 2;
    player.setup_ring_table(ring_table_id);
    player.setup_skill_table(skill_table_id);
}

