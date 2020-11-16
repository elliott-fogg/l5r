// constants ///////////////////////////////////////////////////////////////////
const ring_headings = ["Ring", "Rank"];
const trait_headings = ["Trait", "Rank"];
const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];


class CharacterDisplay extends CharacterInfo {

	constructor(given_name, family_id, school_id, starting_skills, starting_traits) {
		super(given_name, family_id, school_id, starting_skills, starting_traits);
        // TODO: Display actions to take on character creation
        var new_char_div = document.getElementById("character_creation_div");
        new_char_div.classList.remove("active");
        var char_info_div = this.refresh_character_info();
        char_info_div.classList.add("active");
        // Enable the save and load buttons
        document.getElementById("save_char").disabled = false;
        document.getElementById("load_char").disabled = false;
        //
        // this.bind_set_exp_button();
        this.bind_save_and_load_buttons();
        this.bind_clan_only_checkbox();
        this.bind_new_character_button();
        this.refresh_display();
	}

	// Bind Buttons ////////////////////////////////////////////////////////////

    bind_new_character_button() {
        var new_char_btn = document.getElementById("new_char_btn");
        new_char_btn.onclick = function() {
            this.initiate_character_setup();
        }.bind(this);
    }

    bind_save_and_load_buttons() {
        // Disable Save button
        // Check if any existing characters are saved. If not, disable Load button.
        var save_btn = document.getElementById("save_char");
        save_btn.disabled = true;
        save_btn.onclick = function() {this.save_character()}.bind(this);
        var load_btn = document.getElementById("load_char");
        load_btn.onclick = function() {this.load_character()}.bind(this);
    }

    bind_clan_only_checkbox() {
        var co_box = document.getElementById("clan_only_checkbox");
        co_box.onchange = function() {
            this.repopulate_school_select();
        }.bind(this);
    }

    // Create (Incrementer / Create) Buttons ///////////////////////////////////

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
        var emphasis_list = get_skill_info(skill_name)["emphases"];
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

    // Create New Character ////////////////////////////////////////////////////

    initiate_character_setup() {
        var skill_choices_obj = new Skill_Choices("character_creation_div");
    }

    // Update Information Display //////////////////////////////////////////////

    create_info_div(label_value_pair_list) {
        var div = document.createElement("div");
        for (let label_value_pair of label_value_pair_list) {
            let [label_text, value_text] = label_value_pair;
            var label = document.createElement("p");
            label.className = "info_display_label";
            label.innerHTML = label_text;
            div.appendChild(label);
            var value = document.createElement("p");
            value.className = "info_display_value";
            value.innerHTML = value_text;
            div.appendChild(value);
            div.append(document.createElement("br"));
        }
        div.className = "info_display_div"
        return div;
    }

    create_add_exp_div() {
        var main_div = document.createElement("div");
        
        var exp_input = document.createElement("input");
        exp_input.type = "number";
        exp_input.defaultValue = 3;
        exp_input.pattern="\d*";
        exp_input.id = "exp_change_input";

        var exp_btn = document.createElement("input");
        exp_btn.type = "button";
        exp_btn.value = "Add Exp";
        exp_btn.id = "exp_change_btn";
        exp_btn.onclick = function() {
            var exp_to_add = parseInt(exp_input.value);
            var success = this.add_total_experience(exp_to_add);
            if (success) {
                exp_input.value = 3;
                this.refresh_display();
            }
        }.bind(this);

        exp_input.onkeyup = function() {
            if (exp_input.checkValidity()) {
                exp_btn.disabled = false;
            } else {
                exp_btn.disabled = true;
            }
        }

        main_div.appendChild(exp_input);
        main_div.appendChild(exp_btn);
        return main_div;
    }

    refresh_character_info() {
        var div1 = this.create_info_div([["Name:", this.get_display_name()],
                                         ["Clan:", this.get_clan()],
                                         ["School:", this.get_display_school()],
                                         ["Rank:", this.calculate_rank()]]);

        var div2 = this.create_info_div([["Insight:", this.calculate_insight()],
                                         ["Remaining Exp:", this.experience],
                                         ["Total Exp:", this.total_experience]]);
        var add_exp_div = this.create_add_exp_div();
        div2.appendChild(add_exp_div);

        var div3 = this.create_info_div([["Honor:", "HONOR_PLACEHOLDER"],
                                         ["Glory:", "GLORY_PLACEHOLDER"],
                                         ["Status:", "STATUS_PLACEHOLDER"],
                                         ["Shadowland Taint:", 
                                                    "TAINT_PLACEHOLDER"]]);

        var old_container = document.getElementById("character_info_container");
        var container = document.createElement("div");
        container.id = "character_info_container";
        var main_div = document.createElement("div");
        main_div.id = "character_info_div";
        main_div.appendChild(div1);
        main_div.appendChild(div2);
        main_div.appendChild(div3);
        container.appendChild(main_div);
        main_div.style = "display: flex";
        old_container.replaceWith(container);
        // TODO: Sort this mess out
        return container;
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
        row.insertCell(-1).innerHTML = display_trait(skill_name);

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

    // Populate Selects ////////////////////////////////////////////////////////

    refresh_add_skill_dropdown() {
        var available_skills = get_skill_list().filter(function(s) {
            return !(s in this.skills);
        }.bind(this)).sort();

        var grouped_skills = create_skill_sublists(available_skills);
        var dropdown = create_dropdown("Add a skill", grouped_skills);
        for (let option of dropdown.getElementsByClassName("menu-option")) {
            option.onclick = function() {
                this.add_skill(option.dataset.value);
            }.bind(this);
        }

        var old_dropdown = document.getElementById("add_skill_dropdown");
        dropdown.id = "add_skill_dropdown";
        old_dropdown.replaceWith(dropdown);
    }

    populate_select_skill() {
        var select_skill = document.getElementById("select_add_skill");
        select_skill.innerHTML = ""; // Reset the options before repopulating

        var available_skills = get_skill_list().filter(function(s) {
            return !(s in this.skills);
        }.bind(this)).sort();

        var grouped_skills = create_skill_sublists(available_skills);
        var self = this;
        var sss = create_dropdown("Add a skill", grouped_skills)
        var sss_list = sss.getElementsByClassName("menu-option")
        for (let option of sss_list) {
            option.onclick = function() {
                this.add_skill(option.dataset.value);
            }.bind(this);
        }


        select_skill.replaceWith(sss);
    }

    display_experience() {
        var lbl = document.getElementById("experience_label");
        lbl.innerHTML = `Current Experience: ` +
        `<span class='bolded'>${this.experience}</span>  ` +
        `(Total: ${this.total_experience})`;
    }

    display_skill_dice(skill_name) {
        let dice = this.calculate_skill_dice(skill_name);
        return `${dice[0]}k${dice[1]}`;
    }

    refresh_display() {
        this.fill_trait_table();
        this.fill_skill_table();
        this.display_experience();
        this.refresh_add_skill_dropdown();
        this.refresh_character_info();
    }

    test() {
        return "SUCCESS";
    }

// End Class

}

function create_select_default(selectbox_object, default_text, value=null) {
    var def_option = document.createElement("option");
    def_option.value = value;
    def_option.label = default_text;
    def_option.selected = "selected";
    def_option.hidden = "hidden";
    selectbox_object.appendChild(def_option);
}