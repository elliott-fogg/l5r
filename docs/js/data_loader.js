class DataLoader {
	constructor(delay_ms=0, test_fail=false) {
		this.paths = {
			"skills": "/json/skills.json",
			"schools": "/json/base_schools.json",
			"families": "/json/base_families.json",
			"advantages": "/json/advantages.json",
			"disadvantages": "/json/disadvantages.json",
			"spells": "/json/spells.json",
			"universal_spells": "/json/universal_spells.json",
			"kata": "/json/kata.json"
		}
		
		this.times = {}
		this.data = {}

		this.loaded = false;
		this.callbacks = [this.check_for_html_templates.bind(this)];
		this.start_time = performance.now();
		console.log(`window.location: '${window.location}'`);
		console.log(`window.location.hostname: '${window.location.hostname}'`);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";
		this.get_all_data(delay_ms, test_fail);
	}

	execute_on_load(func) {
		if (this.loaded) {
			func();
		} else {
			this.callbacks.push(func);
		}
	}

	complete_function() {
		console.groupCollapsed("Loading Data Complete!");

		for (let data_name in this.data) {
			console.log(`${data_name.toUpperCase()}:`, this.data[data_name]);
		}

		console.groupEnd();

		this.loaded = true;

		if (this.callbacks.length > 0) {
			console.log("Executing Callbacks!");
			for (let callback of this.callbacks) {
				console.group("Callback");
				console.group("Callback function");
				console.log(callback);
				console.groupEnd();

				callback();

				console.groupEnd();
			}
		}
	}

	check_for_data(max_s=10, i=0) {
		if (this.loaded || i > 10) {
			this.calculate_time_taken();
			console.log(this.data);
			return;
		} else {
			console.log("Pinging for loading data...");
			i += 1;
			setTimeout(function(){this.check_for_data(max_s, i)}.bind(this), 1000);
		}
	}

	async delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(function(){resolve()}, ms);
		})
	}

	calculate_time_taken() {
		for (let dn in this.data) {
			let t = this.data[dn]["end_time"] - this.data[dn]["start_time"];
			console.log(`${dn}, ${Math.round(t)}ms`);
		}
	}

	async get_all_data(delay_ms=0, test_fail=false) {
		var start = performance.now();
		var myPromises = [];

		console.groupCollapsed("Checking for Data...");

		for (let data_name in this.paths) {
			let url = this.hostname + this.paths[data_name];
			myPromises.push(this.get_load_data_promise(url, data_name));
		}

		console.groupEnd();

		// Optionally add fail cases for testing.
		if (test_fail) {
			myPromises.push(this.get_load_data_promise(
			                	"/json/second_dud_file.json", "dud_file"));
		}

		// Optionally add a Promise that will take time to complete, to 
		// test if the other Promises complete asynchronously.
		if (delay_ms > 0) {
			myPromises.push(this.delay(delay_ms))
		}

		await Promise.all(myPromises)
		.then(x => {
			for (let y of x) {
				if (y) {
					if (y[1] == false) {
						alert(`WARNING: Failed to load data for '${y[0]}'.`);
					}
				}
			}
		})
		.catch(function(err) {
			console.log("Hello", err);
		});

		this.complete_function();
	}

	async get_load_data_promise(url, data_name) {
		return new Promise((resolve) => {
			this.load_data(resolve, url, data_name);
		});
	}

	async load_data(resolve, url, data_name) {
		console.log(`Received request for ${data_name}:\n${url}`);
		this.times["start"] = performance.now();
		var json_data = await this.get_data(url);
		this.data[data_name] = json_data;
		this.times["end"] = performance.now();

		if (json_data) {
			resolve([data_name, true]);
		} else {
			resolve([data_name, false]);
		}
	}

	async get_data(url) {
		return fetch(url).then(function(response) {
			if (response.status !== 200) {
				console.log(`Fetch request for url '${url}' failed. ` + 
				            `Status Code: ${response.status}.`);
				return;
			}
			return response.json();
		})
		.catch(function(err) {
			console.log("Error with url " + url + "\nFetch Error :-S", err);
		});
	}

	// Load HTML Templates /////////////////////////////////////////////////////

	check_for_html_templates() {
		var elements_to_replace = document.querySelectorAll('[include-html]');
		for (let i=0; i < elements_to_replace.length; i++) {
			console.log(this);
			var element = elements_to_replace[i];
			var file_name = element.getAttribute("include-html");
			element.removeAttribute("include-html");
			this.load_html_template_from_website(element, file_name);
		}
	}

	load_html_template_from_website(element, file_name) {
		fetch("https://elliott-fogg.github.io/l5r/html/" + file_name)
		.then(response => {
	    	console.log(response.url, response.status);
	    	if (response.status == 200) {
	    		return response.text();
	    	} else {
	    		this.element_failed_load(element, file_name);
	    		return null;
	    	}
		}).then(html => {
			if (html) {
				element.innerHTML = html;
				this.check_for_html_templates();
			}
	    }).catch(err => {
	    	console.warn("Could not load HTML template.", err);
	    	this.element_failed_load(element, file_name);
		});
	}

	element_failed_load(element, message=null) {
		element.innerHTML = "Failed to load element";
		if (message) {
			element.innerHTML += ` - ${message}`;
		}
	}

// End Class
}