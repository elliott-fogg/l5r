// Contemplating refactoring all the display functions to exist outside of the 
// Character class, and just call them from within the Character class. This 
// should make more sense, as the Character object is not meant to be inherent 
// to the page. Can leave some of the more in-depth display functions in 
// (e.g. Formatting the Skill Table) as these will never be done without a 
// Character object.

const ring_headings = ["Ring", "Rank"];
const trait_headings = ["Trait", "Rank"];
const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];

// Create Buttons //////////////////////////////////////////////////////////////

function create_increment_button(character, attr_type, attr_name, increase) {
    // When called from inside a Character object, 'this' should refer to the 
    // Character object itself.
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "inc_dec_btn";
    btn.value = (increase) ? "+" : "-";

    if (attr_type == "trait") {
        btn.onclick = function() {character.modify_trait(attr_name, increase);}
    }

    else if (attr_type == "skill") {
        btn.onclick = function() {character.modify_skill(attr_name, increase);}
    }

    else {
        alert("Unknown button type");
        return;
    }

    return btn; 
}

function create_skill_button(character, skill_name) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "label_button";
    btn.value = skill_name;

    btn.onclick = function() {
        character.roll_skill(skill_name);
        console.log("Clicking on skill " + skill_name);
    };

    return btn;
}

function create_emphasis_button(character, skill_name, emphasis) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "label_button";
    btn.value = emphasis;

    btn.onclick = function() {
        character.roll_skill(skill_name, emphasis);
        console.log("Clicking on emphasis " + emphasis);
    };

    return btn;
}

function create_ring_button(character, ring_name) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "label_button";
    btn.value = ring_name;

    btn.onclick = function() {
        character.roll_ring(ring_name);
    };

    return btn;
}


function create_trait_button(character, trait_name) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "label_button";
    btn.value = trait_name;

    btn.onclick = function() {
        character.roll_trait(trait_name);
    };

    return btn;
}

function create_add_emphasis_list(character, skill_name) {
    var emphasis_list = get_skill_info(skill_name)["emphases"];
    var current_emphases = character.skills[skill_name].emphases;
    var missing_emphases = emphasis_list.filter(function(em) {
        return (!(current_emphases.includes(em)));
    });

    if (missing_emphases.length == 0) {
        return;
    }

    var selectbox = document.createElement("select");
    selectbox.className = "add_emphasis_select"
    selectbox.onchange = function() {
        character.add_emphasis(skill_name, selectbox.value);
    };

    // Disabled select if character has reached maximum number of emphases
    // for this skill
    let max_emphases = Math.ceil(character.skills[skill_name].rank / 2);
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
        if (character.skills[skill_name].emphases.includes(em)) {
            return;
        }
        let option = document.createElement("option");
        option.value = em;
        option.label = em;
        selectbox.appendChild(option);
    });

    return selectbox;
}

// Button Functions ////////////////////////////////////////////////////////////

function start_character_creation() {
    new Skill_Choices("character_creation_div");
}

function check_storage() {
    if (typeof(localStorage) !== "undefined") {
        return true;
    } else {
        alert("Unfortunately your browser does not support Local Storage." + 
            "\nYou will be unable to save characters." + 
            "\nAn option will be added to export them to file.");
        return false;
    }
}

function save_character() {
    if (!(this.check_storage)) {return;}
    console.log("ATTEMPTING TO SAVE CHARACTER");
    // var save_name = window.prompt("Enter a name for this save slot:", "");

    // if (save_name == "") {
    //     console.log("Save cancelled");
    //     return;
    // }

    // var current_char = {};
    // current_char["traits"] = this.traits;
    // current_char["skills"] = this.skills;
    // current_char["experience"] = this.experience;
    // current_char["total_experience"] = this.total_experience;

    // var saved_characters;
    // var saved_string = localStorage.getItem("saved_characters");
    // if (saved_string == null) {
    //     saved_characters = {};
    // } else {
    //     saved_characters = JSON.parse(saved_string);
    // }
    // saved_characters[save_name] = current_char;

    // localStorage.setItem("saved_characters", JSON.stringify(saved_characters));
    // localStorage.setItem("current_character", JSON.stringify(current_char));
    // alert("Character saved!");
}

function load_character() {
    console.log("ATTEMPTING TO LOAD CHARACTER");

    // if (!(this.check_storage)) {return;}

    // console.log("Loading character");

    // var saved_string = localStorage.getItem("saved_characters");
    // if (saved_string == null) {
    //     alert("No saved characters could be found in this browser.");
    //     return;
    // }

    // var save_slot_name = window.prompt("Which character would you like to load?");

    // var saved_characters = JSON.parse(saved_string);
    // if (!(save_slot_name in saved_characters)) {
    //     alert(`There is no character data for slot ${save_slot_name}.`);
    //     return;
    // }

    // // Character exists, check formatting and then load
    // var current_char = saved_characters[save_slot_name];
    // this.skills = current_char["skills"];
    // this.traits = current_char["traits"];
    // this.experience = current_char["experience"];
    // this.total_experience = current_char["total_experience"];

    // click_nav_button("navbar_skills");
    // this.refresh_display();
}

// Functions to create HTML displays ///////////////////////////////////////////

function create_info_div(label_value_pair_list) {
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

function create_add_exp_div(character) {
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
        var success = character.add_total_experience(exp_to_add);
        if (success) {
            exp_input.value = 3;
            character.refresh_display();
        }
    };

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

function refresh_character_info(character) {
    var div1 = create_info_div([["Name:", character.get_display_name()],
                                     ["Clan:", character.get_clan()],
                                     ["School:", character.get_display_school()],
                                     ["Rank:", character.calculate_rank()]]);

    var div2 = create_info_div([["Insight:", character.calculate_insight()],
                                     ["Remaining Exp:", character.experience],
                                     ["Total Exp:", character.total_experience]]);
    var add_exp_div = create_add_exp_div(character);
    div2.appendChild(add_exp_div);

    var div3 = create_info_div([["Honor:", "HONOR_PLACEHOLDER"],
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
    return container;
}

function fill_trait_table(character) {
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
                ring_type.appendChild(create_ring_button(character, ring_name));

                // Show Ring rank value
                let ring_rank = row.insertCell(-1);
                ring_rank.rowSpan = rings[ring_name].length;
                ring_rank.innerHTML = character.calculate_ring(ring_name);
                ring_rank.className = "border_right";

                first = false;
            };

            // Create Trait Name Button
            row.insertCell(-1).appendChild(create_trait_button(
                                                        character, trait_name));

            // Create div for Trait Rank value with Incrementer Buttons
            let trait_rank_cell = row.insertCell(-1);
            let trait_rank_div = document.createElement("div");

            let trait_rank_text = document.createElement("p");
            trait_rank_text.className = "rank_value"
            trait_rank_text.innerHTML = character.traits[trait_name];
            trait_rank_div.appendChild(trait_rank_text);
            trait_rank_div.appendChild(create_increment_button(
                                        character, "trait", trait_name, true));
            trait_rank_div.appendChild(create_increment_button(
                                        character, "trait", trait_name, false));
            trait_rank_cell.appendChild(trait_rank_div);
        })
    }
}

function fill_skill_table(character, show_all_skills=false) {
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
    let skill_name_list = Object.keys(character.skills).sort();

    skill_name_list.forEach(skill_name => {
        fill_skill_row(character, tbdy.insertRow(-1), skill_name);
    })
}

function fill_skill_row(character, row, skill_name) {
    // Clickable Skill Name
    row.appendChild(create_skill_button(character, skill_name)); // Clickable Name

    // Rank value with incrementer buttons
    var rank_div = document.createElement("div");
    var skill_rank = document.createElement("p");
    skill_rank.className = "rank_value";
    skill_rank.innerHTML = String(character.skills[skill_name].rank);
    rank_div.appendChild(skill_rank);
    // Add Increment Buttons
    rank_div.appendChild(create_increment_button(
                            character, "skill", skill_name, true));
    rank_div.appendChild(create_increment_button(
                            character, "skill", skill_name, false));
    row.insertCell(-1).appendChild(rank_div);

    // Associated Trait
    row.insertCell(-1).innerHTML = display_trait(skill_name);

    // Text representation of associated dice roll
    row.insertCell(-1).innerHTML = character.display_skill_dice(skill_name);

    // Add Emphases
    var emphasis_div = document.createElement("div");
    character.skills[skill_name].emphases.forEach(em => {
        let btn = create_emphasis_button(character, skill_name, em);
        emphasis_div.appendChild(btn);
    })
    // Add Emphasis Select Box
    var emphasis_select = create_add_emphasis_list(character, skill_name);
    if (!(emphasis_select == null)) {
        emphasis_div.appendChild(emphasis_select);
    }
    row.insertCell(-1).appendChild(emphasis_div);
}

function refresh_add_skill_dropdown(character) {
    var available_skills = get_skill_list().filter(function(s) {
        return !(s in character.skills);
    }).sort();

    var grouped_skills = create_skill_sublists(available_skills);
    var dropdown = create_dropdown("Add a skill", grouped_skills);
    for (let option of dropdown.getElementsByClassName("menu-option")) {
        option.onclick = function() {
            character.add_skill(option.dataset.value);
        };
    }

    var old_dropdown = document.getElementById("add_skill_dropdown");
    dropdown.id = "add_skill_dropdown";
    old_dropdown.replaceWith(dropdown);
}

function refresh_display(character) {
    console.log("CHARACTER", character);
    fill_trait_table(character);
    fill_skill_table(character);
    refresh_add_skill_dropdown(character);
    refresh_character_info(character);
}

function create_select_default(selectbox_object, default_text, value=null) {
    var def_option = document.createElement("option");
    def_option.value = value;
    def_option.label = default_text;
    def_option.selected = "selected";
    def_option.hidden = "hidden";
    selectbox_object.appendChild(def_option);
}

// function bind_save_and_load_buttons() {
//     // Disable Save button
//     // Check if any existing characters are saved. If not, disable Load button.
//     var save_btn = document.getElementById("save_char");
//     save_btn.disabled = true;
//     save_btn.onclick = function() {this.save_character()}.bind(this);
//     var load_btn = document.getElementById("load_char");
//     load_btn.onclick = function() {this.load_character()}.bind(this);
// }



