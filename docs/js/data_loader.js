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
		console.log("Adding callback")
		console.log(func);
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
			console.log(data_name + ":", url);
			this.load_data(url, data_name);
		}
		console.groupEnd();
	}

	load_data(url, data_name) {
		// Required to make storing the data part of the Promise
		var data_promise = new Promise((resolve, reject) => {

			fetch(url).then(response => {
				if (response.status != 200) {
					console.log(`Fetch request for url ${url} failed. ` +
					            `Status Code: ${response.status}.`);
					return;
				}
				return response.json();

			}).then(json_data => {
				this.data[data_name] = json_data;
				resolve(data_name);

			})
			.catch(err => {
				console.log("Error with url " + url + "\nFetch Error :-S", err);
				resolve(data_name);
			})
		})

		this.data_promises.push(data_promise);
	}

	// Load HTML Templates /////////////////////////////////////////////////////

	check_for_html_templates() {
		console.log("CHECKING FOR include-html");

		var elements_to_replace = document.querySelectorAll('[include-html]');

		for (let element of elements_to_replace) {

			let html_promise = new Promise((resolveFunc, reject) => {

				var file_name = element.getAttribute("include-html");
				element.removeAttribute("include-html");
				this.handle_load_html(element, file_name, resolveFunc)

			});

			this.html_promises.push(html_promise);
		}
	}

	handle_load_html(element, file_name, resolveFunc) {
		this.load_html_template_from_website(element, file_name, resolveFunc);
	}

	load_html_template_from_website(element, file_name, resolveFunc) {
		fetch("https://elliott-fogg.github.io/l5r/html/" + file_name)
		.then(response => {
			console.groupCollapsed("Load HTML file: " + file_name);
			console.log("Response URL: " + response.url);
			console.log("Response Status: " + response.status);
			console.groupEnd();
			if (response.status == 200) {
				return response.text();
			} else {
				this.element_failed_load(element, file_name, resolveFunc);
				return null;
			}
		}).then(html => {
			if (html) {

				var new_element = this.replace_element(element, html);

				if (new_element.hasAttribute("dataset.objectname")) {
					var object_to_call = element.firstChild.dataset.objectname;
					window.DH.execute_on_load(
					    Function(`new ${object_to_call}()`)
					);
					console.log(element);
				}
				this.check_for_html_templates();
				resolveFunc(file_name);
			}
		}).catch(err => {
			console.warn("Could not load HTML template.", err);
			this.element_failed_load(element, file_name);
			resolveFunc(file_name);
		});
	}

	element_failed_load(element, message=null) {
		element.innerHTML = "Failed to load element";
		if (message) {
			element.innerHTML += ` - ${message}`;
		}
	}

	replace_element(element, html) {
		console.log(element);
		var template = document.createElement("template");
		template.innerHTML = html;
		var new_element = template.content.firstElementChild.cloneNode(true);
		console.log(new_element);
		element.replaceWith(new_element);
		return new_element;
	}

	// Await all data to confirm loaded ////////////////////////////////////////

	async await_data() {
		let promise_all_array = [Promise.all(this.data_promises),
											Promise.all(this.html_promises)];
		Promise.all(promise_all_array).then((values) => {
			console.log(values);
			console.log(this.data_promises);
			console.log(this.html_promises);
			this.complete_function();
		});
	}

	complete_function() {
		console.groupCollapsed("Loading Data Complete!");

		for (let data_name in this.data) {
			console.log(`${data_name.toUpperCase()}:`, this.data[data_name]);
		}

		console.groupEnd();

		this.loaded = true;

		if (this.callbacks.length > 0) {
			console.log(this.callbacks);
			console.log("Executing Callbacks!");
			for (let i=0; i < this.callbacks.length; i++) {
				console.group(`Callback ${i+1}`);
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

	// async load_data(url, data_name) {
	// 	var promise = fetch(url);

	// 	this.data_promises.push(promise);

	// 	console.log(promise);
	// 	console.log(this.data_promises);

	// 	promise.then(response => {
	// 		if (response.status != 200) {
	// 			console.log(`Fetch request for url ${url} failed. ` +
	// 			            `Status Code: ${response.status}.`);
	// 			return;
	// 		}
	// 		return response.json();
	// 	}).then(json_data => {
	// 		this.data[data_name] = json_data;
	// 	})
	// 	.catch(err => {
	// 		console.log("Error with url " + url + "\nFetch Error :-S", err);
	// 	})
	// }