class CharacterAccess {

	constructor(data_handler) {
		this.data = data_handler;

		if (!("current_character" in localStorage)) {
			this.set_value(["name"], null);
			this.set_value(["family_id"], null);
			this.set_value(["school_id"], null);
			this.set_value(["total_experience"], 40);
			this.set_value(["trait_bonuses", "family"], null);
			this.set_value(["trait_bonuses", "school"], null);
			this.set_value(["starting_skills", "school"], []);
			this.set_value(["starting_skills", "choices"], []);
			this.set_value(["starting_skills", "chosen"], []);
			this.set_value(["spells", "count"], 0);
			this.set_value(["spells", "learned"], []);
			this.set_value(["spells", "choices"], []);
			this.set_value(["affinity"], null);
			this.set_value(["deficiency"], null);
			this.set_value([""])
		}
	}

	// Base Getters and Setters ////////////////////////////////////////////////
	get_value(keyPath) {
		console.group("get_value");
		console.log(keyPath);
		var data = JSON.parse(localStorage["current_character"]);

		if (keyPath == null) {return data}
		else if (!(Array.isArray(keyPath))) {
			console.error("Cannot get value, provided keyPath is not an array.");
			console.error("keyPath:", JSON.stringify(keyPath));
			return;
		}

		for (let key of keyPath) {
			data = data[key];
		}
		console.groupEnd();
		return data;

	}

	set_value(keyPath, value) {
		console.groupCollapsed("Set_Value");
		var data = JSON.parse(localStorage["current_character"]);
		console.log(data);
		var obj = data;

		var lastKeyIndex = keyPath.length - 1;
		for (let i=0; i<lastKeyIndex; i++) {
			let key = keyPath[i];
			if (!(key in obj)) {
				obj[key] = {};
			}
			obj = obj[key];
			console.log(i, obj);
		}
		obj[keyPath[lastKeyIndex]] = value;
		console.log("OBJ", obj);
		console.log("DATA", data);

		localStorage["current_character"] = JSON.stringify(data);

		console.groupEnd();
	}

	append_value(keyPath, value) {
		console.groupCollapsed("append_value");
		var data = JSON.parse(localStorage["current_character"]);
		var subdata = data;
		for (let key of keyPath) {
			subdata = subdata[key];
		}
		console.log(subdata);
		if (Array.isArray(subdata)) {
			subdata.push(value);
			console.log(data);
			localStorage["current_character"] = JSON.stringify(data);
		} else {
			console.error("Data not an array, could not append", "Data:", subdata);
		}
		console.groupEnd()
	}

}