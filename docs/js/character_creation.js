class CharacterCreator {

	constructor() {
        console.log("Initiating CharacterCreator");
        this.reset_character_data();
        if (localStorage["current_character"]) {
            this.load_current();
        }
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
        this.family_id = "";
        this.school_id = "";
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
            "family_id": this.family_id,
            "school_id": this.school_id,
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
        this.family_id = load_data.family_id;
        this.school_id = load_data.school_id;
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

    set_family(family_id) {
    	console.groupCollapsed(`Set Family - ${family_id}`);

    	this.family_id = family_id;

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

    set_school(school_id) {
        console.groupCollapsed(`Set School - ${school_id}`);

        // Update Character Info
        this.school_id = school_id;
        this.skills.set = window.DH.get_school_info(school_id, "skills");
        this.skills.choices = window.DH.get_school_info(school_id, "skill_choices");
        this.skills.chosen = Array(this.skills.choices.length).fill(null);
        this.affinity = window.DH.get_school_info(school_id, "affinity");
        this.spells.choices = window.DH.get_school_info(school_id, "spells");
        this.gear = window.DH.get_school_info(school_id, "gear");

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
        if (this.family_id && this.school_id) {
            var family_clan = this.family_id.split("_")[0];
            var school_clan = this.school_id.split("_")[0];
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

		if (this.family_id == "") {
            family_select.classList.add("default");
			create_select_default(family_select, "Select a family...", true);
		} else {
            family_select.classList.remove("default");
			var [clan_name, family_name] = this.family_id.split("_");
			let select_show_value = `${family_name} (${clan_name})`;
			create_select_default(family_select, select_show_value);
		}

		var families_by_clan = window.DH.get_clan_families();

        console.log(families_by_clan);

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
        if (this.school_id === "") {
            create_select_default(school_select, "Select a school...", true);
        } else {
            let s_class = window.DH.get_school_info(this.school_id, "class");
            let [s_clan, s_name] = this.school_id.split("_");
            create_select_default(school_select,
                                  `${s_name} (${s_clan} ${s_class})`);
        }

        var clan_schools = window.DH.get_clan_schools();

        if (this.family_id != "") {
            let chosen_clan = this.family_id.split("_")[0];
            if (chosen_clan in clan_schools) {
                let clan_group = document.createElement("optgroup");
                clan_group.label = chosen_clan;
                for (let school of clan_schools[chosen_clan]) {
                    let option = document.createElement("option");
                    option.value = `${chosen_clan}_${school}`;
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
                option.value = `${clan}_${school}`;
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

        if (this.school_id == "" || this.skills.choices.length == 0) {
            // No school has been selected, or there aren't any choices to make
            skill_choices_div.innerHTML = "<span class='note'>None</span>";
            return;
        }

        console.groupCollapsed("Refresh Skill Selections");

    	for (let i=0; i < this.skills.choices.length; i++) {
    		var allowed_skills;
    		if (this.skills.choices[i] == "Any") {
    			allowed_skills = window.DH.get_skill_list();
    		} else {
                let allowed_categories = [];
                for (let cat of this.skills.choices[i].split("/")) {
                    allowed_categories.push(cat.trim());
                }
                console.log("Allowed categories:", allowed_categories);
    			allowed_skills = window.DH.get_skill_list(allowed_categories)
    		}

    		// Only allow skills that aren't already part of the school's 
    		// starting skills, and also haven't already been chosen in a 
    		// different skill choice dropdown.
    		var filtered_skills = allowed_skills.filter(function(s) {
    			return (!(s in this.skills.set) &&
    			        !(this.skills.chosen.includes(s))
    			);
    		}.bind(this));

    		var grouped_skills = window.DH.create_skill_sublists(filtered_skills);

    		var button_title;
    		if (this.skills.chosen[i] == null) {
    			button_title = `${this.skills.choices[i]}`;
    		} else {
    			button_title = this.skills.chosen[i];
    		}

    		// Generate the callback function for the dropdown options
    		var on_option_click = function(value) {
    			this.set_skill_choice(value, i);
    		}.bind(this);

            console.groupCollapsed("Skill Stages");
            console.log("Allowed Skills", allowed_skills);
            console.log("Filtered Skills", filtered_skills);
            console.log("Grouped Skills", grouped_skills);
            console.groupEnd("Skill Stages");

            var dropdown_object = new CustomDropdown(button_title,
                                                     grouped_skills,
                                                     false,
                                                     on_option_click);

            if (this.skills.chosen[i] == null) {
                dropdown_object.dropdown.classList.add("italic");
            }

            

            var choice_div = document.createElement("div");
            choice_div.className = "choice_div";

            var label = document.createElement("label");
            label.innerHTML = `<u>${this.skills.choices[i]}:</u>`;
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
    	console.log(`Clicked on '${skill_name}'`, skill_button);
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
        if (this.family_id) {
            let family_trait = window.DH.get_family_trait(this.family_id);
            traits_dict[family_trait] += 1;
        }

        // Add in school bonus
        if (this.school_id) {
            let school_trait = window.DH.get_school_info(this.school_id,
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

        var starting_skills = this.skills.set;
        console.log("Starting Skills:", starting_skills);

        if (starting_skills.length == 0) {
            console.log("NO SKILLS YET");
            template.innerHTML = "<tr><td class='note' colspan='3'>None</td></tr>";
            skill_tbody.appendChild(template.content.firstChild);
        }

        for (let skill in starting_skills) {
            let skill_info = starting_skills[skill];
            var row_html = `<tr><td>${skill}</td>
                            <td>${skill_info.rank}</td>
                            <td>${skill_info.emphases.join(", ")}</td></tr>`;
            row_html = row_html.trim();
            template.innerHTML = row_html;
            skill_tbody.appendChild(template.content.firstChild);
        }

        var chosen_skills = this.skills.chosen;

        for (let skill of chosen_skills) {
            if (skill == null) {continue};
            var row_html = `<tr><td>${skill}</td><td>1</td><td></td></tr>`;
            row_html = row_html.trim();
            template.innerHTML = row_html;
            skill_tbody.appendChild(template.content.firstChild);
        }

        console.groupEnd();
    }

    update_honor() {
        var honor = 0;

        // Check for school honor
        if (this.school_id != "") {
            let school_honor = window.DH.get_school_info(this.school_id, "honor");
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
        return insight;
    }

    update_insight() {
        document.getElementById("insight_display").innerHTML = this.calculate_insight();
        this.update_insight_rank();
    }

    update_insight_rank() {
        var rank = Math.max(Math.floor(1 + (this.temp.insight - 125) / 25), 1);
        document.getElementById("rank_display").innerHTML = rank;
    }

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
        if (this.family_id && this.school_id) {
            if (this.family_id.split("_")[0] != this.school_id.split("_")[0]) {
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
                    if (this.family_id) {
                        let clan = this.family_id.split("_")[0];
                        if (clan == value) {
                            total_discount = Math.max(amount, total_discount);
                        }
                    }


                } else if (type == "class") {
                    if (this.school_id) {
                        let classes = window.DH.get_school_info(this.school_id,
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

        var text_cell = document.createElement("td");
        text_cell.appendChild(create_collapsible_div(title, text, "hidden"));
        row.appendChild(text_cell);

        var cost_cell = document.createElement("td");
        cost_cell.innerHTML = cost;
        cost_cell.className = "center v-top";
        row.appendChild(cost_cell);

        if (index >= 0) {
            var delete_cell = document.createElement("td");
            delete_cell.classList.add("delete_cell");
            // delete_cell.classList.add("v-top");
            delete_cell.innerHTML = "<span class='delete_button'>x</span>";
            delete_cell.onclick = this.delete_advantage.bind(this, advantage, index);
            delete_cell.title = "Delete Advantage";
            row.appendChild(delete_cell);
        }

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

        if (this.school_id) {
            if (window.DH.get_school_info(this.school_id, "class").includes("Shugenja")) {
                spells_container.classList.remove("hidden");
                spells_container.classList.remove("disabled");
                spells_container.title = "";
                this.refresh_spells_info();
                return;
            }
        }

        // Default Option (If no school has been picked, or it isn't a Shugenja)
        spells_container.classList.add("hidden");
        spells_container.classList.add("disabled");
        spells_container.title = "A Shugenja school is required to use Spells";
    }

    refresh_spell_dropdown() {
        console.groupCollapsed("Refreshing Spell Dropdown");
        // Get unlearned spells
        var learned_spells = new Set();
        for (let s of this.spells.learned) {
            learned_spells.add(s["title"]);
        }

        var new_spells = Object.keys(window.DH.data.spells).filter(s => {
            if (learned_spells.has(s)) {
                return false;
            }
            return true;
        })

        var grouped_spells = window.DH.group_spells(new_spells);
        console.log("Grouped Spells:", grouped_spells);

        var on_spell_click = function(value) {
            console.log("Spell selected - ", value);
            this.confirm_spell(value);
        }.bind(this);

        var spell_dropdown = document.getElementById("spell_dropdown");
        spell_dropdown.innerHTML = "";

        var dropdown_obj = new CustomDropdown("Add Spell", grouped_spells,
                                              false, on_spell_click)

        spell_dropdown.appendChild(dropdown_obj.dropdown);

        console.groupEnd();
    }

    async confirm_spell(spell_name) {
        var spell = window.DH.data.spells[spell_name];
        console.log(spell);

        var modal = new ModalWindow();
        modal.add_title(`Add spell '${spell_name}'?`);

        let subtitle = `${spell.element} ${spell.mastery_level}`;
        if (spell.keywords.length > 0) {
            console.log("KEYWORDS", spell.keywords);
            subtitle += ` (${spell.keywords.join(", ")})`;
        }
        modal.add_subtitle(subtitle);

        var description = "";
        description += `<b>Range:</b> ${spell.range}<br>`;
        description += `<b>Area of Effect:</b> ${spell.aoe}<br>`;
        description += `<b>Duration:</b> ${spell.duration}<br>`;

        if (spell.raises) {
            description += `<b>Raises:</b> ${spell.raises.join(", ")}<br>`;
        }

        if (spell.special) {
            description += `<b>Special:</b> ${spell.special}<br>`;
        }

        description += "<br>" + spell.description;
        modal.add_description(description);

        var input_data = await modal.get_user_input();

        if (input_data == null) {
            return;
        } else {
            this.spells.learned.push(window.DH.data.spells[spell_name]);
            this.refresh_spells_info();
            this.autosave();
        }
    }

    refresh_spells_info() {
        this.refresh_spells_table();
        this.refresh_spell_dropdown();

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
                console.log("AFFINITY SELECTED");
                console.log(this);
                this.affinity = `Any_${sel_affinity.value}`;
            }.bind(this);
        } else {
            sel_affinity.style.display = "none";
            p_affinity.style.display = "inline";
            p_affinity.innerHTML = this.affinity;
        }

        // Refresh Deficiency display
        var p_deficiency = document.getElementById("p_deficiency");
        if (this.school_id) {
            p_deficiency.innerHTML = window.DH.get_school_info(this.school_id,
                                                               "deficiency");
        } else {
            p_deficiency.innerHTML = "None";
        }

        // Refresh Spell Choices
        if (this.school_id) {
            let choices = window.DH.get_school_info(this.school_id, "spells");
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

        for (let spell_name in window.DH.data.universal_spells) {
            spells_tbody.appendChild(this.create_spell_object(
                        window.DH.data.universal_spells[spell_name], -1));
        }

        for (let i in this.spells.learned) {
            let spell = this.spells.learned[i];
            spells_tbody.appendChild(this.create_spell_object(spell, i));
        }

        console.groupEnd();
    }

    create_spell_object(spell, index=-1) {
        let row = document.createElement("tr");

        // Cell 1 - Spell Information
        let c1 = document.createElement("td");
        
        var spell_name = spell.title;
        if (spell.keywords.length > 0) {
            spell_name += ` (${spell.keywords.join(", ")})`;
        }
        
        var content = [];
        
        var spell_details = document.createElement("p");
        spell_details.innerHTML = `Range: ${spell.range}<br>
                                    Area of Effect: ${spell.aoe}<br>
                                    Duration: ${spell.duration}<br>`
        content.push(spell_details);
        
        if (spell.raises.length > 0) {
            let raises_ul = document.createElement("ul");
            for (let r of spell.raises) {
                let li = document.createElement("li");
                li.innerHTML = r;
                raises_ul.appendChild(li);
            }
            let raises = create_collapsible_div("Raises", [raises_ul], "hidden");
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
        
        c1.appendChild(create_collapsible_div(spell_name, content, "spell hidden"));
        
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

        // If indicated, add a Delete button
        if (index >= 0) {
            let delete_btn = document.createElement("td");
            delete_btn.classList.add("delete_cell");
            delete_btn.innerHTML = "<span class='delete_button'>x</span>";
            delete_btn.onclick = this.delete_spell.bind(this, index);
            delete_btn.title = "Delete Spell";
            row.appendChild(delete_btn);
        }

        return row;
    }

    delete_spell(index) {
        this.spells.learned.splice(index, 1);
        this.refresh_spells_info();
        this.autosave();
    }

    // Gear ////////////////////////////////////////////////////////////////////

    update_gear() {
        this.update_koku();

        var gear_p = document.getElementById("gear_display");
        gear_p.innerHTML = "";
        if (this.school_id == "") {
            gear_p.innerHTML = "None";
        } else {
            var ul = document.createElement("ul");
            var gear = window.DH.get_school_info(this.school_id, "gear");
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
        if (this.school_id != "") {
            let school_koku = window.DH.get_school_info(this.school_id, "koku");
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
        
        if (this.school_id) {
            techniques_div.innerHTML = "";
            var techniques = window.DH.get_school_info(this.school_id, "techniques");
            
            for (let i in techniques) {
                let content = document.createElement("p");
                content.innerHTML = techniques[i].effect;
                let div = create_collapsible_div(`Rank ${i}: ${techniques[i].name}`,
                                                    [content], "bold hidden");
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