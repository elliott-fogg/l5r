const trait_table_headings = ["Ring", "Rank", "Trait", "Rank"];
const skill_headings = ["Skill", "Rank", "Trait", "Roll", "Emphasis"];
const rings = {
    "Air": ["Awareness", "Reflexes"],
    "Earth": ["Stamina", "Willpower"],
    "Fire": ["Agility", "Intelligence"],
    "Water": ["Perception", "Strength"],
    "Void": ["Void"]
}

// Create Buttons //////////////////////////////////////////////////////////////

function create_inc_btn_with_hover(f, increase, hover_text) {
    var container = document.createElement("div");
    var button_div = document.createElement("div");
    button_div.className = (increase) ? "inc_button" : "dec_button";
    button_div.onclick = f;
    var hover_div = document.createElement("span");
    hover_div.className = "hover_box";
    hover_div.innerHTML = hover_text;

    container.appendChild(button_div);
    container.appendChild(hover_div);
    container.style="display: inline-block;"
    return container;
}

function set_inc_button_info(container_id, f, hover_text) {
    var container = document.getElementById(container_id);
    var button_div = container.getElementsByTagName("div")[0];
    button_div.onclick = f;
    var hover_div = container.getElementsByTagName("span")[0];
    hover_div.innerHTML = hover_text
}

function create_increment_button(character, attr_type, attr_name, increase) {
    // When called from inside a Character object, 'this' should refer to the 
    // Character object itself.
    var div = document.createElement("div");
    div.className = (increase) ? "inc_button" : "dec_button";

    if (attr_type == "trait") {
        div.onclick = function() {
            character.modify_trait(attr_name, increase);
            refresh_display(character);
        }
    }

    else if (attr_type == "skill") {
        div.onclick = function() {
            character.modify_skill(attr_name, increase);
            refresh_display(character);
        }
    }

    else {
        alert("Unknown button type");
        return;
    }

    return div; 
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

function refresh_character_info(character) {
    document.getElementById("info_name").innerHTML = character.get_display_name();
    document.getElementById("info_clan").innerHTML = character.get_clan();
    document.getElementById("info_school").innerHTML = character.get_display_school();
    document.getElementById("info_rank").innerHTML = character.calculate_rank();
    document.getElementById("info_exp").innerHTML = character.experience;
    document.getElementById("info_insight").innerHTML = character.calculate_insight();

    var exp_btn = document.getElementById("exp_change_button");
    var exp_input = document.getElementById("exp_change_input");
    exp_btn.onclick = function() {
        var exp_to_add = parseInt(exp_input.value);
        var success = character.add_total_experience(exp_to_add);
        if (success) {
            exp_input.value = 3;
            refresh_display(character);
        }
    }
}

function create_trait_table() {
    var table = document.getElementById("trait_table");
    while (table.firstChild) {table.removeChild(table.firstChild)};

    var thead = table.createTHead();
    var headings = thead.insertRow(-1);
    for (let i = 0; i < trait_table_headings.length; i++) {
        let cell = headings.insertCell(i);
        cell.innerHTML = `<b><u>${trait_table_headings[i]}</u></b>`;
        cell.classList = (i == 1) ? "border_right" : "";
    }

    var tbody = table.createTBody();
    for (let ring_name in rings) {
        tbody.appendChild(document.createComment(` ${ring_name} ring `));
        let row1 = tbody.insertRow(-1);
        row1.className = `ring_row_${ring_name}`;
        var rowspan = Math.max(rings[ring_name].length, 1);

        let cell1 = row1.insertCell(-1);
        cell1.rowSpan = rowspan;
        let ring_button = document.createElement("input");
        ring_button.type = "button";
        ring_button.value = ring_name;
        ring_button.id = `ring-btn-${ring_name}`;
        ring_button.className = "label_button";
        cell1.appendChild(ring_button);

        let cell2 = row1.insertCell(-1);
        cell2.rowSpan = rowspan;
        cell2.className = "border_right";
        let ring_rank = document.createElement("p");
        ring_rank.id = `ring-rank-${ring_name}`;
        ring_rank.className = "rank_value";
        cell2.appendChild(ring_rank);

        let first = true;
        for (let trait_name of rings[ring_name]) {

            let current_row;
            if (first) {
                current_row = row1;
            }
            else {
                current_row = tbody.insertRow(-1);
                current_row.className = `ring_row_${ring_name}`;
            }

            first = false;

            let trait_button = document.createElement("input");
            trait_button.type = "button";
            trait_button.value = trait_name;
            trait_button.id = `trait-btn-${trait_name}`;
            trait_button.className = "label_button";
            current_row.insertCell(-1).appendChild(trait_button);

            let trait_rank = document.createElement("p");
            trait_rank.className = "rank_value";
            trait_rank.id = `trait-rank-${trait_name}`;
            current_row.insertCell(-1).appendChild(trait_rank);

            let inc_dec_cell = current_row.insertCell(-1);
            for (let bool of [true, false]) {
                let f = function () {}
                let msg = "Button not yet bound";
                let arrow_btn = create_inc_btn_with_hover(f, bool, msg);
                arrow_btn.id = (bool) ? `${trait_name}-inc-btn` :
                    `${trait_name}-dec-btn`;
                inc_dec_cell.appendChild(arrow_btn);
            }
        }

        // Exception case for when a ring has no traits (e.g. Void);
        // In this case the ring itself must be stored as a trait;
        if (rings[ring_name].length == 0) {
            row1.insertCell(-1);
            row1.insertCell(-1);
        let inc_dec_cell = row1.insertCell(-1);
        for (let bool of [true, false]) {
            let f = function () {}
            let msg = "Button not yet bound";
            let arrow_btn = create_inc_btn_with_hover(f, bool, msg);
            arrow_btn.id = (bool) ? `${ring_name}-inc-btn` :
                `${ring_name}-dec-btn`;
            inc_dec_cell.appendChild(arrow_btn);
            inc_dec_cell.style="height: 100%"
            }
        }
    }
}

function update_trait_table(character) {
    var table = document.getElementById("trait_table");
    for (let ring_name in rings) {

        // Set onclick function for ring button
        document.getElementById(`ring-btn-${ring_name}`).onclick = function() {
            console.log(`Rolling ${ring_name}!`);
        }

        // Set value for ring rank
        document.getElementById(`ring-rank-${ring_name}`).innerHTML =
            character.calculate_ring(ring_name);

        // Iterate through traits
        for (let trait_name of rings[ring_name]) {
            // Set function and hover_text for inc_ and dec_ buttons
            for (let bool of [true, false]) {
                let f = function() {
                    character.modify_trait(trait_name, bool);
                    refresh_display(character);
                }
                let msg = character.get_increment_button_message("trait",
                                                             trait_name,
                                                             bool);
                let div_id = (bool) ? `${trait_name}-inc-btn` :
                    `${trait_name}-dec-btn`;
                set_inc_button_info(div_id, f, msg);
            }

            // Set onclick function for trait button
            document.getElementById(`trait-btn-${trait_name}`).onclick =
            function() {
                console.log(`Rolling ${trait_name}!`);
            }

            // Set value of trait rank
            document.getElementById(`trait-rank-${trait_name}`).innerHTML =
                character.traits[trait_name];
        }

        // Update the inc_ dec_ buttons for rings that have no traits
        if (rings[ring_name].length == 0) {
            for (let bool of [true, false]) {
                let f = function() {
                    character.modify_trait(ring_name, bool);
                    refresh_display(character);
                }
                let msg = character.get_increment_button_message("trait",
                                                                 ring_name,
                                                                 bool);
                let div_id = (bool) ? `${ring_name}-inc-btn` :
                    `${ring_name}-dec-btn`;
                set_inc_button_info(div_id, f, msg);
            }
        }
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
    // rank_div.appendChild(create_increment_button(
    //                         character, "skill", skill_name, true));
    // rank_div.appendChild(create_increment_button(
    //                         character, "skill", skill_name, false));
    let f_inc_skill = function () {character.modify_skill(skill_name, true);}
    let f_dec_skill = function () {character.modify_skill(skill_name, false);}

    let inc_skill_msg = character.get_increment_button_message("skill", skill_name, true);
    let dec_skill_msg = character.get_increment_button_message("skill", skill_name, false);


    rank_div.appendChild(create_inc_btn_with_hover(f_inc_skill, true, inc_skill_msg));
    rank_div.appendChild(create_inc_btn_with_hover(f_dec_skill, false, dec_skill_msg));
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
    update_trait_table(character);
    fill_skill_table(character);
    refresh_add_skill_dropdown(character);
    refresh_character_info(character);
}

function create_select_default(selectbox_object, default_text, italic=false) {
    var def_option = document.createElement("option");
    def_option.label = default_text;
    def_option.selected = "selected";
    def_option.hidden = "hidden";
    if (italic) {
        selectbox_object.classList.add("default");
    } else {
        selectbox_object.classList.remove("default");
    }
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

function load_dummy_character() {
    console.log("TESTING")

    const GIVEN_NAME = "Kokomo";
    const FAMILY_ID = "Crab_Hida";
    const SCHOOL_ID = "Crab_Hida Bushi School";
    const TRAITS = {
            "Awareness": 2, "Reflexes": 2, "Stamina": 3, "Willpower": 2,
            "Agility": 2, "Intelligence": 2, "Perception": 2, "Strength": 3,
            "Void": 2
        }

    var school_info = get_school_info(SCHOOL_ID);
    var starting_skills = school_info["skills"];

    for (let skill_name of ["Battle"]) {
        var skill_info = get_skill_info(skill_name);
        starting_skills[skill_name] = {
            "rank": 1,
            "trait": skill_info["trait"],
            "class": skill_info["class"],
            "emphases": []
        }
    }

    window.character = new CharacterInfo(GIVEN_NAME,
                                         FAMILY_ID,
                                         SCHOOL_ID,
                                         starting_skills,
                                         TRAITS);

    // Change displayed header div
    set_character_div("info");

    refresh_display(window.character);

    console.log("JSON", window.character.output_as_json());
}

function check_exp_input() {
    var exp_btn = document.getElementById("exp_change_btn");
    if (this.checkValidity()) {exp_btn.disabled = false;}
    else {exp_btn.disabled = true;}
}

////////////////////////////////////////////////////////////////////////////////

function set_character_div(tab_name) {
    var creation_div = document.getElementById("character_creation_div");
    var info_div = document.getElementById("character_info_div");
    switch (tab_name) {
        case "none": {
            creation_div.classList.remove("active");
            info_div.classList.remove("active");
            break;
        }
        case "creation": {
            creation_div.classList.add("active");
            info_div.classList.remove("active");
            break;
        }
        case "info": {
            creation_div.classList.remove("active");
            info_div.classList.add("active");
        }
    }
}

////////////////////////////////////////////////////////////////////////////////

function load_data_from_storage() {
    window.current_character = JSON.parse(localStorage.getItem("current_character"));
    window.saved_characters = JSON.parse(localStorage.getItem("saved_characters"));
}

function save_data_to_storage() {
    localStorage.setItem("current_character", JSON.stringify(window.current_character));
    localStorage.setItem("saved_characters", JSON.stringify(window.saved_characters));
    refresh_characters_button();
}

function update_current_character() {
    var char_json = window.character.output_as_json();
    window.current_character = char_json;
}

function refresh_characters_button() {
    var char_button = document.getElementById("characters_button");
    var dropdown_data = {};
    for (let char_name of Object.keys(window.saved_characters)) {
        dropdown_data[char_name] = {
            "Load": `load_${char_name}`,
            "Delete": `delete_${char_name}`
        }
    }
    var dropdown = new dropdown_with_sublists("Characters", dropdown_data, load_or_delete);
    var dropdown_dom = dropdown.get_element();
    dropdown_dom.id = "characters_button";
    dropdown_dom.style = "display: inline-block";
    char_button.replaceWith(dropdown_dom);
}

function load_or_delete(input) {
    console.log(input);
    var [action, char_name] = input.split("_");
    if (action == "delete") {
        if (window.confirm(`Are you sure you want to delete ${char_name}?`)) {
            delete_character(char_name);
        }
    } else if (action == "load") {
        load_character(char_name);
    }
}

function load_character(character_name) {
    if (!(Object.keys(window.saved_characters).includes(character_name))) {
        alert(`Could not find saved data for character ${character_name}`);
        return;
    }

    console.log("LOADING " + character_name);
    var char_json = window.saved_characters[character_name];
    var char = load_character_from_json(char_json);
    refresh_display(char);
}

function delete_character(character_name) {
    console.log("DELETING " + character_name);
    delete window.saved_characters[character_name];
    save_data_to_storage();
}

function save_character() {
    var char = window.character;
    var json_data = char.output_as_json();

    console.log("WINDOW_CHAR", json_data);
    window.saved_characters[json_data["save_name"]] = json_data;

    save_data_to_storage();
}

function check_for_current_character() {
    load_data_from_storage();
    if (window.current_character != null) {
        console.log("FOUND IT");
        window.character = load_character_from_json(window.current_character);
        refresh_display(window.character);
    }
}

function get_current_date() {
    var d = new Date();
    console.log(`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`)
}