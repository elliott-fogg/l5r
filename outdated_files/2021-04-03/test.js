class CharacterAccess {

	get_value(keyPath) {
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

function test_main() {
	console.log("Test file working");

	var test = {
		"Skills": {
	  		"Default": ["Kenjutsu", "Acting", "Tea Ceremony"],
	    	"Choices": ["High", "High/Low"],
	    	"Chosen": ["Knives"],
	    	"Valid": true
	  	}
	}

	localStorage["current_character"] = JSON.stringify(test);
	var char = new CharacterAccess();

	console.log(char.get_value(["Skills", "Choices"]));
	console.log(char.get_value());
	char.set_value(["Skills", "Chosen", 2], "Jumpsuits");
	console.log(char.get_value());
	char.append_value(["Skills", "Chosen"], "Catapults");
	console.log(char.get_value());
	char.set_value(["Skills", "Choices"], ["Low"]);
	console.log(char.get_value());
	
}