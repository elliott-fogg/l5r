class DataLoader {
	constructor() {
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
		
		this.data = {}

		this.loaded = false;
		this.data_promises = [];
		this.html_promises = [];
		this.callbacks = [];

		this.additional_init();

		this.start_time = performance.now();

		console.log(`window.location: '${window.location}'`);
		console.log(`window.location.hostname: '${window.location.hostname}'`);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";

		this.get_all_data();
		this.check_for_html_templates();
		this.await_data();
	}

	additional_init() {

	}

	execute_on_load(func) {
		if (this.loaded) {
			func();
		} else {
			this.callbacks.push(func);
		}
	}

	// Load Data ///////////////////////////////////////////////////////////////

	async get_all_data() {
		var start = performance.now();

		console.groupCollapsed("Checking for Data...");
		for (let data_name in this.paths) {
			let url = this.hostname + this.paths[data_name];
			this.load_data(url, data_name);
		}
		console.groupEnd();
	}

	async load_data(url, data_name) {
		var promise = fetch(url);

		this.data_promises.push(promise);

		promise.then(response => {
			if (response.status != 200) {
				console.log(`Fetch request for url ${url} failed. ` +
				            `Status Code: ${response.status}.`);
				return;
			}
			return response.json();
		}).then(json_data => {
			this.data[data_name] = json_data;
		})
		.catch(err => {
			console.log("Error with url " + url + "\nFetch Error :-S", err);
		})
	}

	// Load HTML Templates /////////////////////////////////////////////////////

	check_for_html_templates() {
		console.log("CHECKING FOR include-html");
		var elements_to_replace = document.querySelectorAll('[include-html]');
		for (let element of elements_to_replace) {
			var file_name = element.getAttribute("include-html");
			element.removeAttribute("include-html");
			this.load_html_template_from_website(element, file_name);
		}
	}

	load_html_template_from_website(element, file_name) {
		var promise = fetch("https://elliott-fogg.github.io/l5r/html/" +
		                    file_name);

		this.html_promises.push(promise);

		promise.then(response => {
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

	// Await all data to confirm loaded ////////////////////////////////////////

	async await_data() {
		await Promise.all([Promise.all(this.data_promises), Promise.all(this.html_promises)])
		.then(x => {
			console.log(x);
		})
		this.complete_function();
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
			for (let i=0; i < this.callbacks.length; i++) {
				console.group(`Callback ${i}`);
				console.group("Callback Function:");
				console.log(this.callbacks[i]);
				console.groupEnd();

				this.callbacks[i]();

				console.groupEnd();
			}
		}
	}

// End Class
}