// constants ///////////////////////////////////////////////////////////////////
const ring_headings = ["Ring", "Rank"];
const trait_headings = ["Trait", "Rank"];
const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];


class CharacterDisplay extends CharacterInfo {

	constructor() {
		super();
        this.bind_set_exp_button();
        this.bind_save_and_load_buttons()
        this.bind_clan_only_checkbox();
        this.bind_new_character_button();
        this.refresh_display();
	}

	// Bind Buttons ////////////////////////////////////////////////////////////

    bind_new_character_button() {
        var new_char_btn = document.getElementById("new_char_btn");
        new_char_btn.onclick = function() {
            this.create_new_character()
        }.bind(this);
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

    bind_save_and_load_buttons() {
        var save_btn = document.getElementById("save_button");
        save_btn.onclick = function() {this.save_character()}.bind(this);
        var load_btn = document.getElementById("load_button");
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

        var emphasis_list = get_skill_emphases(skill_name);
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

    set_char_creation_stage(stage_name) {
        switch (stage_name) {
            case "restart": {
                console.log("NEW CHARACTER");
                var new_char_div = document.getElementById("create_new_character");
                new_char_div.classList.add("active");
                this.repopulate_family_select();
            }
            case "set_family": {
                this.repopulate_family_select(this.family);
                this.repopulate_school_select(this.clan());
            }
        }
    }

    create_new_character() {
        console.log("NEW CHARACTER");
        var new_char_div = document.getElementById("create_new_character");
        new_char_div.classList.add("active");
        this.repopulate_family_select();
        // Disable School Select
        // Remove all skill choices
        // Disable Generate Character
    }

    set_family_update_display() {
        console.log("FAMILY_UPDATE_DISPLAY");
        this.repopulate_family_select(this.family);
        this.repopulate_school_select(this.clan());
    }

    set_school_update_display() {
        // Populate skill choices
        this.create_skill_choice_selects();
    }

    set_skill_choice_update_display() {
        // Check if all skills are filled
        // If they are, enable the "Generate Character" button
    }

    generate_character_update_display() {
        // pop-up to confirm
        // Hide character creation
        // Show character info
        // Show skills-and-traits tab
        // Enable Save and Load buttons
    }

    reset

    repopulate_family_select(selected_family=null) {
        console.log("REPOPULATE_FAMILY_SELECT", selected_family);
        var sel = document.getElementById("select_char_family");
        sel.innerHTML = "";

        sel.onchange = function() {
            this.set_family(sel.value);
        }.bind(this);

        if (selected_family === null) {
            create_select_default(sel, "Select a family...");
        } else {
            let default_text = `${this.family.split("_")[1]} - ${this.clan()}`;
            create_select_default(sel, default_text, this.family);
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
                sel.appendChild(clan_group);
            }
        }
    }

    repopulate_school_select (enable=null) {
        console.log(clan_info);
        this.school = null;
        var sel = document.getElementById("select_char_school");
        sel.innerHTML = "";

        if (enable !== null) {
            sel.disabled = !(enable);
        }

        sel.onchange = function() {
            this.set_school(sel.value);
        }.bind(this);

        create_select_default(sel, "Select a school...");

        if (this.family) {
            var clan_only_schools = document.getElementById("clan_only_checkbox").checked;
            if (clan_only_schools) {

                // Only return schools for the characters clan
                var clan_schools = get_clan_schools(this.family);
                clan_schools.sort();
                for (let school of clan_schools) {
                    let option = document.createElement("option");
                    option.value = this.clan() + "_" + school;
                    option.label = school;
                    sel.appendChild(option);
                }

            } else {

                // Return schools from all clans, grouped, with char clan at top
                var clan_names = get_clans();
                if (this.family) {
                    clan_names = clan_names.filter(function(e) {
                                    return e !==this.clan()}.bind(this)).sort();
                }
                clan_names.unshift(this.clan());
                console.log(clan_names);

                for (let clan of clan_names) {
                    var clan_group = document.createElement("optgroup");
                    clan_group.label = clan;
                    for (let school of get_clan_schools(clan).sort()) {
                        let option = document.createElement("option");
                        option.value = clan + "_" + school;
                        option.label = school;
                        clan_group.appendChild(option);
                    }

                    if (clan_group.childElementCount > 0) {
                        sel.appendChild(clan_group);
                    }
                }
            }

        } else {
            // Character has no clan selected. School selection should not be 
            // possible.
            console.log("ERROR: School select clicked with no family set.")
        }
    }

    create_skill_choice_selects() {
        if (!(this.school)) {
            console.log("Attempting to create skill_choice_selects with no school");
            return;
        }

        var school_info = get_school_info(this.school);
        console.log("SCHOOL_INFO", school_info);

        var main_div = document.getElementById("skill_choice_selects");
        main_div.innerHTML = ""; // Reset the div 

        for (let skill_choice of school_info["skill_choices"]) {
            main_div.appendChild(this.create_single_skill_choice(skill_choice));
        }
    }

    create_single_skill_choice(choices_string="Any") {

        var choices;
        if (choices_string == "Any") {
            choices = [];
        } else {
            choices = choices_string.split("/");
        }

        var choice_skills = get_skills(choices);

        console.log("CHOICE_SKILLS", choice_skills)

        var available_skills = get_skills(choices).filter(function(s) {
            return !(s in this.skills);
        }.bind(this));
        var grouped_skills = create_skill_sublists(available_skills);
        console.log("GROUPED_SKILLS", grouped_skills);


        var self = this;
        var sss = create_dropdown_with_sublists(choices_string, grouped_skills);
        var sss_list = sss.getElementsByClassName("menu-option");
        for (let option of sss_list) {
            option.onclick = function() {
                console.log(option.dataset.value);
            }.bind(this);
        }

        return sss;

        return document.createElement("select");
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

    fill_character_info() {
        var div1 = this.create_info_div([["Name:", this.name],
                                         ["Clan:", this.clan],
                                         ["School:", this.school],
                                         ["Rank:", this.calculate_rank()]]);

        var div2 = this.create_info_div([["Insight:", this.calculate_insight()],
                                         ["Remaining Exp:", this.experience],
                                         ["Total Exp:", this.total_experience]]);

        var div3 = this.create_info_div([["Honor:", "HONOR_PLACEHOLDER"],
                                         ["Glory:", "GLORY_PLACEHOLDER"],
                                         ["Status:", "STATUS_PLACEHOLDER"],
                                         ["Shadowland Taint:", 
                                                    "TAINT_PLACEHOLDER"]]);

        var container = document.createElement("div");
        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(div3);
        container.id = "char_info_div"

        document.getElementById("char_info_div").replaceWith(container);
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

    // Populate Selects ////////////////////////////////////////////////////////

    populate_select_skill() {
        var select_skill = document.getElementById("select_add_skill");
        select_skill.innerHTML = ""; // Reset the options before repopulating

        var available_skills = get_skill_list().filter(function(s) {
            return !(s in this.skills);
        }.bind(this)).sort();

        var grouped_skills = create_skill_sublists(available_skills);
        var self = this;
        var sss = create_dropdown_with_sublists("Add a skill", grouped_skills)
        var sss_list = sss.getElementsByClassName("menu-option")
        for (let option of sss_list) {
            option.onclick = function() {
                this.add_skill(option.dataset.value);
            }.bind(this);
        }


        select_skill.replaceWith(sss);

        // select_skill.onchange = function() {
        //     this.add_skill(select_skill.value);
        // }.bind(this);

        // var default_option = document.createElement("option");
        // default_option.value = "NO_SKILL";
        // default_option.label = "Add a skill...";
        // default_option.style = "display:none";
        // default_option.selected = "selected";
        // select_skill.appendChild(default_option);

        // var addable_skills = all_skill_names.filter(function(s) {
        //     return !(s in this.skills);
        // }.bind(this)).sort();

        // addable_skills.forEach(skill_name => {
        //     let option = document.createElement("option");
        //     option.value = skill_name;
        //     option.label = skill_name;
        //     select_skill.appendChild(option);
        // });
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
        this.populate_select_skill();
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