class CharacterCreator {

	constructor() {
        console.log("Initiating CharacterCreator");
        this.reset_character_data();
        if (localStorage["current_character"]) {
            this.load_current();
        }
        this.create_full_spell_list();
		this.refresh_displays();
	}

    refresh_displays() {
        // Reset Family, School, and Skill selects
        this.refresh_family_select();
        this.refresh_school_select();
        this.refresh_skill_selections();
        this.check_different_school();

        // Refresh Generic Displays
        this.update_traits();
        this.update_skills();
        this.update_gear();
        this.update_techniques();
        this.update_status();
        this.update_honor();
        this.update_glory();
        this.update_name();

        // Reset Advantages
        this.refresh_adv_selects();
        this.refresh_adv_display();

        // Reset Spells
        this.check_enable_spells()

        this.update_experience()
        this.update_insight()
    }

	// Character Data //////////////////////////////////////////////////////////

	reset_character_data() {
        this.name = "";
        this.info = {};
        this.family = "";
        this.school = "";
        this.skills = {
            "set": [],
            "choices": [],
            "chosen" : []
        };
        this.spells = {
            "count": 0,
            "choices": [],
            "learned": []
        };
        this.affinity = null;
        this.advantages = [];
        this.disadvantages = [];

        // Storage for calculated values
        this.temp = {};
	}

    get_personal_information() {
        var info_dict = {
            "physical": document.getElementById("physical_description").value,
            "family": document.getElementById("family_relations").value
        };
        return info_dict;
    }

    set_personal_information(info_dict) {
        document.getElementById("physical_description").value = info_dict["physical"];
        document.getElementById("family_relations").value = info_dict["family"];
    }

    save(autosave=false) {
        var save_data = {
            "name": this.name,
            "info": this.get_personal_information(),
            "family": this.family,
            "school": this.school,
            "skills": this.skills,
            "advantages": this.advantages,
            "disadvantages": this.disadvantages,
            "spells": this.spells,
            "affinity": this.affinity,
            // "gear": this.gear,
            // "effects": this.effects
        }

        var save_json = JSON.stringify(save_data);
        localStorage["current_character"] = JSON.stringify(save_data);

        var last_saved = document.getElementById("last_saved");
        var t = new Date();
        if (autosave) {
            last_saved.innerHTML = `(Autosaved at ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()})`
        } else {
            last_saved.innerHTML = `(Saved at ${t.toLocaleString()})`
        }
    }

    autosave() {
        if (window.options.check("autosave")) {
            this.save(true);
        } else {
            document.getElementById("last_saved").innerHTML = "";
        }
    }

    load_current() {
        if (!(localStorage["current_character"])) {
            alert("There is no saved character");
            return;
        }

        console.log("Character Found! Loading saved character...")

        var load_data = JSON.parse(localStorage["current_character"]);

        this.name = load_data.name;
        this.set_personal_information(load_data.info);
        this.family = load_data.family;
        this.school = load_data.school;
        this.skills = load_data.skills;
        this.advantages = load_data.advantages;
        this.disadvantages = load_data.disadvantages;
        this.spells = load_data.spells;
        this.affinity = load_data.affinity;
        this.gear = load_data.gear;
        this.effects = load_data.effects;
    }

    update_name() {
        var name_display = document.getElementById("character_name_display");

        if (this.name.length > 0) {
            name_display.innerHTML = this.name;
        } else {
            name_display.innerHTML = "new_character";
        }
    }

    // Traits and Skills ///////////////////////////////////////////////////////

    set_family(family) {
    	console.groupCollapsed(`Set Family - ${family}`);

    	this.family = family;

    	this.check_different_school();

        this.refresh_family_select(); // Set custom text displayed on select
        this.refresh_school_select(); // Update Order of School Select

        // Refresh Advantages Selection
        this.refresh_adv_selects();
        this.refresh_adv_display();

        // Refresh Traits Display (as that should be the only thing changed)
        this.update_traits();

        this.update_experience()
        this.update_insight()

        this.autosave();

        console.groupEnd();
    }

    set_school(school) {
        console.groupCollapsed(`Set School - ${school}`);

        // Update Character Info
        this.school = school;
        this.skills.set = window.DH.get_school_info(school, "skills");
        this.skills.choices = window.DH.get_school_info(school, "skill_choices");
        this.skills.chosen = Array(this.skills.choices.length).fill(null);
        this.affinity = window.DH.get_school_info(school, "affinity");
        this.spells.choices = window.DH.get_school_info(school, "spells");
        this.gear = window.DH.get_school_info(school, "gear");

        this.check_different_school();

        // Update Honor
        this.update_honor();

        // Disable Spells section if not Shugenja
        this.check_enable_spells();

        // Generate skill selection dropdowns for the selected school
        this.refresh_school_select();
        this.refresh_skill_selections();

        // Refresh Advantages Selection
        this.refresh_adv_selects();
        this.refresh_adv_display();

        // Refresh Displays
        this.update_skills();
        this.update_traits();
        this.update_gear();
        this.update_techniques();

        this.update_experience()
        this.update_insight()

        this.autosave();
    }

    check_different_school() {
        var note = document.getElementById("different_clans_note");
        if (this.family && this.school) {
            var family_clan = window.DH.get_family_clan(this.family);
            var school_clan = window.DH.get_school_info(this.school, "clan");
            if (family_clan != school_clan) {
                note.style.display = "inline";
                // Advantage will be added in during Refresh Adv Display
                return;
            }
        }
        note.style.display = "none";
    }

	refresh_family_select() {
        console.groupCollapsed("Refresh Family Select");
		var family_select = document.getElementById("character_family_select");
		family_select.innerHTML = "";

		family_select.onchange = function() {
			this.set_family(family_select.value);
		}.bind(this);

        if (this.family == "") {
            family_select.classList.add("default");
            create_select_default(family_select, "Select a family...", true);
        } else {
            family_select.classList.remove("default");
            var clan_name = window.DH.get_family_clan(this.family);
            let select_show_value = `${this.family} (${clan_name})`;
            create_select_default(family_select, select_show_value);
        }

		var families_by_clan = window.DH.get_clan_families();

        console.log(families_by_clan);

        for (let clan of Object.keys(families_by_clan).sort()) {
            let clan_group = document.createElement("optgroup");
            clan_group.label = clan;
            for (let family of families_by_clan[clan].sort()) {
                let option = document.createElement("option");
                option.value = family;
                option.label = family;
                clan_group.appendChild(option);
            }

            // Only add clan if the number of families is > 0
            if (clan_group.childElementCount > 0) {
                family_select.appendChild(clan_group);
            }
        }
        console.groupEnd();
	}

    refresh_school_select() {
        var school_select = document.getElementById("character_school_select");
        school_select.innerHTML = "";

        school_select.onchange = function() {
            this.set_school(school_select.value);
        }.bind(this);

        // Set default text
        if (this.school == "") {
            create_select_default(school_select, "Select a school...", true);
        } else {
            let s_class = window.DH.get_school_info(this.school, "class");
            let s_clan = window.DH.get_school_info(this.school, "clan");
            create_select_default(school_select,
                                  `${this.school} (${s_clan} ${s_class})`);
        }

        var clan_schools = window.DH.get_clan_schools();

        console.log(clan_schools);

        if (this.family != "") {
            let chosen_clan = window.DH.get_family_clan(this.family);
            console.log(chosen_clan);
            if (chosen_clan in clan_schools) {
                let clan_group = document.createElement("optgroup");
                clan_group.label = chosen_clan;
                for (let school of clan_schools[chosen_clan]) {
                    let option = document.createElement("option");
                    option.value = school;
                    option.label = school;
                    clan_group.appendChild(option);
                }
                if (clan_group.childElementCount > 0) {
                    school_select.appendChild(clan_group);
                    let divider = document.createElement("optgroup");
                    divider.label = "--- Other Clans ---";
                    school_select.appendChild(divider);
                }

                delete clan_schools[chosen_clan];

            } else {
                console.warn(`'${chosen_clan} Clan' has no schools.`);
            }
        }

        for (let clan in clan_schools) {
            var clan_group = document.createElement("optgroup");
            clan_group.label = clan;
            for (let school of clan_schools[clan]) {
                let option = document.createElement("option");
                option.value = school;
                option.label = school;
                clan_group.appendChild(option);
            }
            if (clan_group.childElementCount > 0) {
                school_select.appendChild(clan_group);
            }
        }
    }

    refresh_skill_selections() {
    	var skill_choices_div = document.getElementById("skill_choices_div");
    	skill_choices_div.innerHTML = "";

        if (this.school == "" || this.skills.choices.length == 0) {
            // No school has been selected, or there aren't any choices to make
            skill_choices_div.innerHTML = "<span class='note'>None</span>";
            return;
        }

        console.groupCollapsed("Refresh Skill Selections");

        console.log(this.skills);

    	for (let i=0; i < this.skills.choices.length; i++) {

            var input_for_dropdown;
            var skill_name = this.skills.choices[i];

            if (this.skills.choices[i].includes("()")) {
                // Choosing an Emphasis
                skill_name = this.skills.choices[i].replace(" ()", "");
                input_for_dropdown = {};
                for (let em of window.DH.get_skill_info(skill_name)["emphases"]) {
                    let em_text = `${skill_name} (${em})`;
                    input_for_dropdown[em_text] = em_text;
                }
            } else {
                // Choosing a Skill
                var allowed_categories = [];
                if (this.skills.choices[i] != "Any") {
                    for (let cat of this.skills.choices[i].split("/")) {
                        allowed_categories.push(cat.trim());
                    }
                }

                var allowed_skills = window.DH.get_skill_list(allowed_categories);

                // Filter Skills to remove those already set or selected
                var filtered_skills = allowed_skills.filter(function(s) {
                    return (
                            !(s in this.skills.set) &&
                            !(this.skills.chosen.includes(s))
                    );
                }.bind(this));

                console.log(filtered_skills, allowed_categories);

                var input_for_dropdown = window.DH.create_skill_sublists(
                                                               filtered_skills);
            }

            var button_title, dropdown_class;
            if (this.skills.chosen[i] == null) {
                button_title = skill_name;
                dropdown_class = "italic";
            } else {
                button_title = this.skills.chosen[i];
                dropdown_class = null;
            }

            // Generate the callback function for the dropdown options
            var on_option_click = function(value) {
                this.set_skill_choice(value, i);
            }.bind(this);

            var dropdown_object = new CustomDropdown(button_title,
                                                     input_for_dropdown,
                                                     false,
                                                     dropdown_class,
                                                     on_option_click);

            var choice_div = document.createElement("div");
            choice_div.className = "choice_div";

            var label = document.createElement("label");
            label.innerHTML = `<u>${skill_name}:</u>`;
            label.style="margin-right: 5px"
            choice_div.appendChild(label);

            choice_div.appendChild(dropdown_object.dropdown);
            // dropdown_object.dropdown.style="display: inline";
            choice_div.style="margin-bottom: 5px"

            skill_choices_div.appendChild(choice_div);
    	}
        console.groupEnd();
    }

    set_skill_choice(skill_name, skill_button) {
        console.log(`Skill Set: ${skill_name}; Button: ${skill_button}`);
        this.skills.chosen[skill_button] = skill_name;
    	this.refresh_skill_selections();
        this.update_skills();
        this.update_insight();
        this.autosave();
    }

    update_traits() {
        var traits_list = ["Awareness", "Reflexes", "Stamina", "Willpower",
                            "Agility", "Intelligence", "Perception", "Strength",
                            "Void"];

        // Create traits_dict and fill with default_value (2)
        var traits_dict = {}
        for (let trait of traits_list) {
            traits_dict[trait] = 2;
        }

        // Add in family bonus
        if (this.family) {
            let family_trait = window.DH.get_family_trait(this.family);
            traits_dict[family_trait] += 1;
        }

        // Add in school bonus
        if (this.school) {
            let school_trait = window.DH.get_school_info(this.school,
                                                         "attribute");
            traits_dict[school_trait] += 1;
        }

        this.temp.traits = traits_dict;

        var trait_tbody = document.getElementById("trait_tbody");
        trait_tbody.innerHTML = "";
        var template = document.createElement("template");
        for (let trait in traits_dict) {
            let value = traits_dict[trait];
            let value_html = (value > 2) ? `<b>${value}</b>` : `${value}`;
            let row_html = `<tr>
                                <td>${trait}</td>
                                <td style="text-align: center">${value_html}</td>
                            </tr>`;
            template.innerHTML = row_html.trim();
            trait_tbody.appendChild(template.content.firstChild);
        }
    }

    update_skills() {
        console.groupCollapsed("Updating Skills");
        console.log("this.skills:", this.skills);
        var skill_tbody = document.getElementById("skill_tbody");
        skill_tbody.innerHTML = "";
        var template = document.createElement("template");

        var all_skills = [];

        // Add all school skills
        for (let skill_name in this.skills.set) {
            all_skills.push(this.skills.set[skill_name]);
        }

        // Add any chosen skills
        for (let skill_string of this.skills.chosen) {
            if (skill_string == null) {continue};
            var matches = skill_string.match(/([^(]+)(?:\((.+)\))?/);
            let skill_name = matches[1];
            var emphasis = matches[2]; // Need to watch for Undefineds here
            all_skills.push({
                "name": skill_name,
                "emphases": [emphasis],
                "rank": 1
            });
        }

        console.log("All Skills:", all_skills);

        if (all_skills.length == 0) {
            console.log("No Skills Present");
            skill_tbody.innerHTML = "<tr><td class='note' colspan='3'>None</td></tr>";
            return;
        }

        for (let skill of all_skills) {
            var row_html = `<tr><td>${skill.name}</td>
                            <td>${skill.rank}</td>
                            <td>${skill.emphases.join(", ")}</td></tr>`;
            template.innerHTML = row_html.trim();
            skill_tbody.appendChild(template.content.firstChild);
        }

        console.groupEnd();
    }

    update_honor() {
        var honor = 0;

        // Check for school honor
        if (this.school != "") {
            let school_honor = window.DH.get_school_info(this.school, "honor");
            honor += parseFloat(school_honor);
        }

        // Check for Virtuous Advantage (hack job for now)
        for (let adv of this.advantages) {
            if (adv.title == "Virtuous") {
                honor += 1;
            }
        }

        var honor_display = document.getElementById("honor_rank");
        honor_display.innerHTML = Math.round(honor * 10) / 10;
    }

    update_glory() {
        var glory = 1;

        // Check for Fame Advantage (hack job for now)
        for (let adv of this.advantages) {
            if (adv.title == "Fame") {
                glory += 1;
            }
        }

        var glory_display = document.getElementById("glory_rank");
        glory_display.innerHTML = Math.round(glory * 10) / 10;
    }

    calculate_status() {
        var status = 1;

        // Check for Imperial Spouse, and Social Position advantages
        for (let adv of this.advantages) {
            if (adv.title == "Imperial Spouse") {
                status += 0.5;
            } else if (adv.title == "Social Position") {
                status += 1;
            }
        }

        return Math.round(status * 10) / 10;
    }

    update_status() {
        var status_display = document.getElementById("status_rank");
        status_display.innerHTML = this.calculate_status();
    }

    calculate_experience() {
        var experience = 40;
        return experience - this.temp.advantages_cost +
            this.temp.disadvantages_refund;
    }

    update_experience() {
        document.getElementById("experience_display").innerHTML = this.calculate_experience();
    }

    calculate_insight() {
        var insight = 0;

        // Rings
        var traits = this.temp.traits;
        insight += 10 * Math.min(traits.Awareness, traits.Reflexes);
        insight += 10 * Math.min(traits.Stamina, traits.Willpower);
        insight += 10 * Math.min(traits.Agility, traits.Intelligence);
        insight += 10 * Math.min(traits.Perception, traits.Strength);
        insight += 10 * traits.Void;

        // Skills
        for (let s in this.skills.set) {
            insight += this.skills.set[s].rank;
        }
        for (let s of this.skills.chosen) {
            if (s != null) {
                insight += 1;
            }
        }

        this.temp.insight = insight;
        this.temp.insight_rank = Math.max(Math.floor(1 + (insight - 125) / 25), 1);
    }

    calculate_insight_rank() {
        return Math.max(Math.floor(1 + (this.temp.insight - 125) / 25), 1);
    }

    update_insight() {
        this.calculate_insight();
        document.getElementById("insight_display").innerHTML = this.temp.insight;
        document.getElementById("rank_display").innerHTML = this.temp.insight_rank;
        // this.update_insight_rank();
    }

    // update_insight_rank() {
    //     document.getElementById("rank_display").innerHTML = this.calculate_insight_rank();
    // }

    // Advantages and Disadvantages ////////////////////////////////////////////

    // Adding
    add_adv_item(title, text, cost, discounts, advantage) {
        var data = {
            "title": title,
            "text": text,
            "cost": cost,
            "discounts": discounts
        }
        if (advantage) {
            this.advantages.push(data);
        } else {
            this.disadvantages.push(data);
        }
        this.refresh_adv_selects();
        this.refresh_adv_display();

        // Refresh displays that can be affected by Advantages
        this.update_adv_affected_displays()
    }

    // Refreshing Select
    refresh_adv_selects() {
        console.groupCollapsed("Refreshing Advantages Selects");

        var adv_select = document.getElementById("advantage_select");
        var adv_data = this.filter_advantages();
        adv_select.innerHTML = "";
        create_select_default(adv_select, "Select an Advantage...", true);

        for (let item of adv_data) {
            let opt = document.createElement("option");
            opt.innerHTML = item;
            opt.value = item;
            adv_select.appendChild(opt);
        }
        adv_select.onchange = this.adv_onselect.bind(this, true);

        var dis_select = document.getElementById("disadvantage_select");
        var dis_data = this.filter_disadvantages();
        dis_select.innerHTML = "";
        create_select_default(dis_select, "Select a Disadvantage...", true);

        for (let item of dis_data) {
            let opt = document.createElement("option");
            opt.innerHTML = item;
            opt.value = item;
            dis_select.appendChild(opt);
        }
        dis_select.onchange = this.adv_onselect.bind(this, false);

        console.groupEnd()
    }

    async adv_onselect(advantage) {
        console.groupCollapsed("Advantage/Disadvantage Selected");

        var adv_data;
        if (advantage) {
            adv_data = window.DH.data.advantages;
        } else {
            adv_data = window.DH.data.disadvantages;
        }
        
        var item = event.target.value;
        var item_data = adv_data[item];
        console.log("Loading AdvantagesModal - ", item);

        console.log("ADV DATA", item_data);

        var modal = new AdvantagesModal(item_data);

        var input_data = await modal.get_user_input();

        if (input_data) {
            console.log("Input Data:", input_data);
            this.add_adv_item(input_data["title"], input_data["text"],
                              input_data["cost"], input_data["discount"],
                              advantage);
            this.autosave();
        } else {
            console.log("Advantage cancelled");
            this.refresh_adv_selects();
        }
    }

    refresh_adv_display() {
        var adv_sort = function(a,b) {
            if (a["title"] < b["title"]) {
                return -1;
            } else {
                return 1;
        }};

        // Sort Advantages
        var advantages = this.advantages.sort(adv_sort);
        var disadvantages = this.disadvantages.sort(adv_sort);

        // Clear Advantage Displays
        var adv_tbody = document.getElementById("adv_tbody");
        adv_tbody.innerHTML = "";
        var dis_tbody = document.getElementById("disadv_tbody");
        dis_tbody.innerHTML = "";

        // Create an object for each advantage
        let template = document.createElement("template");

        var total_cost = 0;

        // Check for Different School advantage
        if (this.family && this.school) {
            if (window.DH.get_family_clan(this.family) != 
                            window.DH.get_school_info(this.school, "clan")) {

                total_cost += 5;
                adv_tbody.appendChild(this.create_adv_object("Different School",
                    "You have trained in the school of a Clan that is not your own.",
                    5))
            }
        }

        // Create an object for each advantage
        for (let i in advantages) {
            var item = advantages[i];
            console.log(item);
            let cost = this.calculate_adv_cost(item.cost, item.discounts, true);
            let row = this.create_adv_object(item.title, item.text, cost,
                                             i, true);
            adv_tbody.appendChild(row);
            total_cost += cost;
        }
        template.innerHTML =    `<tr>
                                    <td><i>Total:</i></td>
                                    <td class="center"><i>${total_cost}</i></td>
                                </tr>`
        adv_tbody.appendChild(template.content.firstChild);

        // Create an object for each disadvantage
        var total_refund = 0;
        for (let i in disadvantages) {
            let item = disadvantages[i];
            let cost = this.calculate_adv_cost(item.cost, item.discounts, false);
            let row = this.create_adv_object(item.title, item.text, cost,
                                             i, false);
            dis_tbody.appendChild(row);
            total_refund += cost;
        }

        let row = document.createElement("tr");
        let cell1 =  document.createElement("td");
        cell1.innerHTML = "<i>Total:</i>";
        row.appendChild(cell1);
        let cell2 = document.createElement("td");
        if (total_refund <= 10) {
            cell2.innerHTML = `<i>${total_refund}</i>`;
        } else {
            cell2.innerHTML = "<label title='Cannot be refunded more than 10" + 
                " exp points from Disadvantages.'><span class='error'>10" +
                "</span></label>";
        }
        cell2.className = "center";
        row.appendChild(cell2);
        dis_tbody.appendChild(row);
        
        this.temp.advantages_cost = total_cost;
        this.temp.disadvantages_refund = Math.min(total_refund, 10);
    }

    calculate_adv_cost(cost, discounts, advantage) {
        // Make the assumption here that a character's clan is determined by
        // their family.

        console.log("Calculate Advantage Cost");
        console.log(cost, discounts, advantage);

        // Check cost for PLAYER values
        var PLAYER_match = [...cost.matchAll(/PLAYER_(\w+)/g)];
        console.log(PLAYER_match);
        if (PLAYER_match.length > 0) {
            for (let match of PLAYER_match) {
                console.log(match);
                let original = match[0];
                let value = match[1];

                if (value == "status") {
                    cost = cost.replace(original, String(this.calculate_status()));
                } else {
                    console.warn("PLAYER attribute not recognised - ", original);
                }
            }
        }

        cost = eval(cost);

        // Extract Discounts - NOTE:
        //  Discounts never stack, so just taking the highest should be fine.
        //  Will make an exception for Advantage bonuses (Blissful Betrothal).
        var total_discount = 0;

        if (discounts.length > 0) {
            for (let d_string of discounts.split(" ")) {
                let [type, value, amount] = d_string.split("_");
                console.log(type, value, amount);

                if (amount == null) {
                    amount = 1;
                }

                if (type == "clan") {
                    if (this.family) {
                        let clan = window.DH.get_family_clan(this.family);
                        if (clan == value) {
                            total_discount = Math.max(amount, total_discount);
                        }
                    }


                } else if (type == "class") {
                    if (this.school) {
                        let classes = window.DH.get_school_info(this.school,
                                                                "class")
                            .split("/");
                        if (classes.includes(value)) {
                            total_discount = Math.max(amount, total_discount);
                        }
                    }


                } else if (type == "adv") {
                    for (let adv of this.advantages) {
                        if (this.advantages[adv].title == value) {
                            total_discount += amount;
                            break;
                        }
                    }


                } else {
                    if (d_string != "") {
                        console.warn("Discount not recognised - ", d_string);
                    }
                }
            }
        }

        if (advantage) {
            return cost - total_discount;
        } else {
            return cost + total_discount;
        }
    }

    create_adv_object(title, text, cost, index=-1, advantage=null) {
        var row = document.createElement("tr");

        var trash_icon;
        if (index >= 0) {
            trash_icon = document.createElement("img");
            trash_icon.src = "images/trash2.svg";
            trash_icon.classList.add("icon-red");
            trash_icon.height = 14;
            trash_icon.onclick = function() {
                console.log("Delete Advantage:", index);
                this.delete_advantage(advantage, index);
                event.stopPropagation();
            }.bind(this);
            trash_icon.title = `Delete ${advantage} Advantage`;
        }

        var text_cell = document.createElement("td");
        var title_p = document.createElement("p");
        title_p.innerHTML = title;
        text_cell.appendChild(create_collapsible_div([title_p, trash_icon],
                                                     text, "closed"));
        row.appendChild(text_cell);

        var cost_cell = document.createElement("td");
        cost_cell.innerHTML = cost;
        cost_cell.className = "center v-top";
        row.appendChild(cost_cell);

        return row;
    }

    delete_advantage(advantage, index) {
        if (advantage) {
            this.advantages.splice(index, 1);
        } else {
            this.disadvantages.splice(index, 1);
        }
        this.refresh_adv_selects();
        this.refresh_adv_display();
        this.update_adv_affected_displays();
        this.autosave();
    }

    filter_advantages() {
        var advantages = Object.keys(window.DH.data.advantages);
        
        // Get current advantages
        var current_advantages = new Set();
        for (let item of this.advantages) {
            current_advantages.add(item["title"]);
        }

        var valid_advantages = advantages.filter(name => {
            if (current_advantages.has(name)) {
                if (window.DH.data.advantages[name].allow_multiple) {
                    return true;
                }
                return false;
            }
            return true;
        });

        console.log(valid_advantages);

        return valid_advantages;
    }

    filter_disadvantages(disadvantage_data) {
        var disadvantages = Object.keys(window.DH.data.disadvantages);

        // Get current disadvantages
        var current_disadvantages = new Set();
        for (let item of this.disadvantages) {
            current_disadvantages.add(item["title"]);
        }

        var valid_disadvantages = disadvantages.filter(name => {
            if (current_disadvantages.has(name)) {
                if (window.DH.data.disadvantages[name].allow_multiple) {
                    return true;
                }
                return false;
            }
            return true;
        });

        console.log(valid_disadvantages);

        return valid_disadvantages;
    }

    update_adv_affected_displays() {
        this.update_koku();
        this.update_honor();
        this.update_glory();
        this.update_status();
        this.update_experience()
    }

    // Spells //////////////////////////////////////////////////////////////////

    check_enable_spells() {
        var spells_container = document.getElementById("spells_container");

        if (this.school) {
            if (window.DH.get_school_info(this.school, "class").includes("Shugenja")) {
                spells_container.classList.remove("closed");
                spells_container.classList.remove("disabled");
                spells_container.title = "";
                this.refresh_spells_info();
                return;
            }
        }

        // Default Option (If no school has been picked, or it isn't a Shugenja)
        spells_container.classList.add("closed");
        spells_container.classList.add("disabled");
        spells_container.title = "A Shugenja school is required to use Spells";
    }

    refresh_spells_info() {
        this.purge_spells();
        this.refresh_spells_table();
        this.refresh_full_spell_list();

        // Refresh Affinity display
        var p_affinity = document.getElementById("p_affinity");
        var sel_affinity = document.getElementById("sel_affinity");

        if (this.affinity.includes("Any")) {
            sel_affinity.style.display = "inline";
            p_affinity.style.display = "none";

            if (this.affinity == "Any") {
                this.affinity = "Any_Air";
            }
            let chosen = this.affinity.split("_")[1];
            sel_affinity.value = chosen;

            sel_affinity.onchange = function() {
                this.affinity = `Any_${sel_affinity.value}`;
                this.refresh_spells_info();
            }.bind(this);
        } else {
            sel_affinity.style.display = "none";
            p_affinity.style.display = "inline";
            p_affinity.innerHTML = this.affinity;
        }

        // Refresh Deficiency display
        var p_deficiency = document.getElementById("p_deficiency");
        if (this.school) {
            p_deficiency.innerHTML = window.DH.get_school_info(this.school,
                                                               "deficiency");
        } else {
            p_deficiency.innerHTML = "None";
        }

        // Refresh Spell Choices
        if (this.school) {
            let choices = window.DH.get_school_info(this.school, "spells");
            if (choices) {
                var p_spell_choices = document.getElementById("p_spell_choices");
                p_spell_choices.innerHTML = choices.join(", ");
            }
        }
    }

    refresh_spells_table() {
        console.groupCollapsed("Refresh Spells Table");
        console.log("Learned Spells", this.spells.learned);
        var spells_tbody = document.getElementById("spells_tbody");
        spells_tbody.innerHTML = "";

        if (this.spells.learned.length == 0) {
            let row = document.createElement("tr");
            let cell = document.createElement("td");
            cell.innerHTML = "None";
            cell.classList.add("note");
            cell.colspan = 3;
            row.appendChild(cell);
            spells_tbody.appendChild(row);
            return;
        }

        var enumerated_spells = [];
        for (let [index, spell_name] of this.spells.learned.entries()) {
            enumerated_spells.push([index, spell_name]);
        }

        enumerated_spells.sort((a, b) => this.spell_sort(a[1], b[1]));

        console.log(enumerated_spells);

        for (let [index, spell_name] of enumerated_spells) {
            let spell = this.spells.learned[index];
            spells_tbody.appendChild(this.create_spell_object(spell, index));
        }

        console.groupEnd();
    }

    purge_spells() {
        var spell_surplus = this.spell_choices_surplus();
        for (let e in spell_surplus) {
            if (spell_surplus[e] > 0) {
                alert("Spell Limits were exceeded. All chosen spells have been removed.");
                this.spells.learned = [];
                return;
            }
        }

        // Remove all spells without the required level / affinity
        var valid_spells = [];
        var invalid_spells = [];
        for (let spell of this.spells.learned) {
            if (this.spell_valid(spell.element, spell.mastery_level)) {
                valid_spells.push(spell);
            } else {
                invalid_spells.push(spell.title);
            }
        }

        this.spells.learned = valid_spells;
        if (invalid_spells.length > 0) {
            alert("Some chosen spells are no longer valid for your current " +
                  "Insight Rank and/or Affinity, and will be removed.");
            alert(`The follow spells will be removed:\n${invalid_spells.join('\n')}`);
        }
    }

    check_spell_choices() {
        var spell_counts = this.count_chosen_spells();

        var spell_limits;
        // Special Case for Isawa Shugenja (need to find way to codify)
        if (this.school == "Phoenix_Isawa Shugenja") {
            spell_limits = {"Air": 3, "Earth": 3, "Fire": 3, "Water": 3,
                            "Void": 3}
        } else {
            spell_limits = window.DH.get_spell_choices_table(this.school);
        }

        for (let e in spell_limits) {
            if (spell_counts[e] > spell_limits[e]) {
                return 1;
            } else if (spell_counts[e] < spell_limits[e]) {
                return -1;
            }
        }
        return 0;
    }

    count_chosen_spells() {
        var spell_counts = {"Air": 0, "Earth": 0, "Fire": 0, "Water": 0,
                            "Void": 0}

        for (let spell of this.spells.learned) {
            spell_counts[spell.element] += 1;
        }
        return spell_counts;
    }

    spell_choices_surplus() {
        var chosen_spells = this.count_chosen_spells();
        var spell_choices = window.DH.get_spell_choices_table(this.school);
        var spell_surplus = {};
        for (let element in chosen_spells) {
            spell_surplus[element] = chosen_spells[element] - 
                                                        spell_choices[element];
        }
        return spell_surplus;
    }

    spell_valid(element, level) {
        if (this.temp.insight_rank == undefined) {this.calculate_insight()};
        var char_level = this.temp.insight_rank;

        if (this.affinity.includes(element)) {
            char_level += 1;
        };
        var deficiency = window.DH.get_school_info(this.school, "deficiency");
        if (deficiency.includes(element)) {
            char_level -= 1;
        }

        return char_level >= level;
    }

    create_spell_object(spell, index=-1) {
        let row = document.createElement("tr");

        // Cell 1 - Spell Information
        let c1 = document.createElement("td");
        var trash_icon = null;
        if (index >= 0) {
            trash_icon = document.createElement("img");
            trash_icon.src = "images/trash2.svg";
            trash_icon.classList.add("icon-red");
            trash_icon.height = 14;
            trash_icon.onclick = function() {
                console.log("Delete Spell:", index);
                this.delete_spell(index);
                event.stopPropagation();
            }.bind(this);
        }

        console.log(spell, trash_icon);
        c1.appendChild(this.create_spell_collapsible(spell, trash_icon));
        row.appendChild(c1);

        // Cell 2 - Mastery Level
        let c2 = document.createElement("td");
        c2.innerHTML = spell.mastery_level;
        c2.className = "center v-top";
        row.appendChild(c2);

        // Cell 3 - Elements
        let c3 = document.createElement("td");
        c3.innerHTML = spell.element;
        c3.className = "v-top nowrap";
        row.appendChild(c3);

        return row;
    }

    spell_sort(spell_a, spell_b) {
        if (spell_a.element > spell_b.element) {
            return 1;
        } else if (spell_a.element < spell_b.element) {
            return -1;
        } else {

            if (spell_a.mastery_level > spell_b.mastery_level) {
                return 1;
            } else if (spell_a.mastery_level < spell_b.mastery_level) {
                return -1;
            } else {

                if (spell_a.title >= spell_b.title) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
    }

    create_spell_collapsible(spell, button=null) {
        // Creating the title
        var title_content = [];

        var spell_name = spell.title;
        if (spell.keywords.length > 0) {
            spell_name += ` (${spell.keywords.join(", ")})`;
        }
        var title_text = document.createElement("p");
        title_text.innerHTML = spell_name;
        title_content.push(title_text);

        if (button != null) {
            title_content.push(button);
        }

        var content = [];

        var spell_details = document.createElement("p");
        spell_details.innerHTML = `<span class="b">Range:</span> ${spell.range}<br>
                                    <span class="b">Area of Effect:</span> ${spell.aoe}<br>
                                    <span class="b">Duration:</span> ${spell.duration}<br>`
        content.push(spell_details);

        if (spell.raises && spell.raises.length > 0) {
            let raises_ul = document.createElement("ul");
            for (let r of spell.raises) {
                let li = document.createElement("li");
                li.innerHTML = r;
                raises_ul.appendChild(li);
            }
            let raises = create_collapsible_div("Raises", [raises_ul], "closed bold");
            content.push(raises);
        }

        if (spell.special) {
            let special = document.createElement("p");
            special.innerHTML = spell.special;
            content.push(special);
        }
        
        let description = document.createElement("p");
        description.innerHTML = spell.description;
        content.push(description);

        return create_collapsible_div(title_content, content, "spell closed")
    }

    add_spell(spell_name) {
        this.spells.learned.push(window.DH.data.spells[spell_name]);
        this.refresh_spells_info();
        this.autosave();
    }

    delete_spell(index) {
        this.spells.learned.splice(index, 1);
        this.refresh_spells_info();
        this.autosave();
    }

    create_full_spell_list() {
        var all_spells_div = document.getElementById("all_spells");
        for (let element of ["Air", "Earth", "Fire", "Water", "Void"]) {
            var element_contents = [];
            for (let level of [1, 2, 3, 4, 5, 6]) {
                var level_spells = document.createElement("div");
                level_spells.id = `all_spells_${element}_${level}_contents`;
                var level_div = create_collapsible_div(`Level ${level}`,
                                                       [level_spells],
                                                       "closed");
                level_div.id = `all_spells_${element}_${level}_container`;
                element_contents.push(level_div);
            }
            var element_div = create_collapsible_div(element, element_contents,
                                                     "closed");
            element_div.id = `all_spells_${element}_container`;
            all_spells_div.appendChild(element_div);
        }
    }

    refresh_full_spell_list() {
        var spell_surplus = this.spell_choices_surplus();
        console.log(spell_surplus);

        var learned_spells = [];
        for (let s of this.spells.learned) {
            learned_spells.push(s.title);
        }

        var spells = {
            "Air": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
            "Earth": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
            "Fire": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
            "Water": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]},
            "Void": {1:[], 2:[], 3:[], 4:[], 5:[], 6:[]}
        }

        // Split Spells up into Elements
        for (let spell_name in window.DH.data.spells) {
            let spell_info = window.DH.data.spells[spell_name];
            spells[spell_info.element][spell_info.mastery_level].push(spell_info);
        }

        // Sort spells within each element
        for (let element in spells) {

            if (this.spell_valid(element, 1)) {
                document.getElementById(`all_spells_${element}_container`).classList.remove("grey");
            } else {
                document.getElementById(`all_spells_${element}_container`).classList.add("grey");
            }

            for (let level in spells[element]) {
                
                var content_div = document.getElementById(`all_spells_${element}_${level}_contents`);
                content_div.innerHTML = "";
                var allowed = this.spell_valid(element, level);
                var surplus = spell_surplus[element] >= 0;

                let container_id = `all_spells_${element}_${level}_container`;
                if (allowed) {
                    document.getElementById(container_id).classList.remove("grey");
                } else {
                    document.getElementById(container_id).classList.add("grey");
                }

                // Iterate through spells
                for (let spell of spells[element][level]) {

                    // If spell is already added, skip it
                    if (learned_spells.includes(spell.title)) {
                        continue;
                    }

                    let spell_add = document.createElement("input");
                    spell_add.type = "button";
                    spell_add.value = "Add";

                    if (allowed && !surplus) {
                        spell_add.onclick = function() {
                            this.add_spell(spell.title);
                            event.stopPropagation();
                        }.bind(this);
                    } else {
                        spell_add.disabled = true;
                        if (!allowed) {
                            spell_add.title = "Cannot Take Spell";
                        } else {
                            spell_add.title = `${element} spell limit reached.`;
                        }
                    }

                    var spell_div = this.create_spell_collapsible(spell,
                                                                  spell_add);
                    content_div.appendChild(spell_div);
                }
            }
        }
    }

    // Gear ////////////////////////////////////////////////////////////////////

    update_gear() {
        this.update_koku();

        var gear_p = document.getElementById("gear_display");
        gear_p.innerHTML = "";
        if (this.school == "") {
            gear_p.innerHTML = "None";
        } else {
            var ul = document.createElement("ul");
            var gear = window.DH.get_school_info(this.school, "gear");
            for (let item of gear) {
                let li = document.createElement("li");
                li.innerHTML = item;
                ul.appendChild(li);
            }
            gear_p.appendChild(ul);
        }
    }

    update_koku() {
        var koku = 0.;

        // Check for School Koku
        if (this.school != "") {
            let school_koku = window.DH.get_school_info(this.school, "koku");
            koku += parseFloat(school_koku);
        }

        // Check for Wealthy Advantage (hack job for now)
        for (let adv of this.advantages) {
            if (adv.title == "Wealthy") {
                koku += 2 * parseInt(adv.cost);
            }
        }

        var money_p = document.getElementById("money_display");
        money_p.innerHTML = `${Math.round(koku * 10) / 10} Koku`;
    }

    // Techniques //////////////////////////////////////////////////////////////

    update_techniques() {
        var techniques_div = document.getElementById("techniques_div");
        
        if (this.school) {
            techniques_div.innerHTML = "";
            var techniques = window.DH.get_school_info(this.school, "techniques");
            
            for (let i in techniques) {
                let content = document.createElement("p");
                content.innerHTML = techniques[i].effect;
                let div = create_collapsible_div(`Rank ${i}: ${techniques[i].name}`,
                                                    [content], "bold closed");
                techniques_div.appendChild(div);
            }
        } else {
            // No school is selected, cannot have any techniques
            techniques_div.innerHTML = "<span class='note'>None</span>";
        }
    }

    ////////////////////////////////////////////////////////////////////////////

}

// Page Functions //////////////////////////////////////////////////////////////

function change_character_name() {
    var new_name = window.prompt("Enter a new name for this character:");
    if (new_name == null || new_name == "") {
        return;
    }
    window.character.name = new_name;
    window.character.update_name();
    window.character.autosave();
}

function complete_character() {
    alert("Sorry, this function is not available at this time.");
    window.character.save();
}

function start_over() {
    console.log("Start Over");
    window.character.reset_character_data();
    window.character.refresh_displays();
}

function save_character() {
    console.log("Manual Save");
    window.character.save();
}

function load_character() {
    console.log("Manual Load");
    window.character.load_current();
    window.character.refresh_displays();
}

function clear_save_data() {
    console.log("Clearing Save Data");
    delete localStorage["current_character"];
    delete localStorage["page_options"]
    location.reload();
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