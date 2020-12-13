class DataHandler {
	constructor(delay_ms=0, test_fail=false) {
		this.data = {
			"skills": {
				"path": "/json/skill_info.json",
			},
			"clans": {
				"path": "/json/clan_info.json",
			}
		}
		this.loaded = false;
		this.hostname = window.location.hostname;
		console.log("Real hostname: " + this.hostname);
		// Not entirely sure how this works at the moment, need to manually set it for now.
		this.hostname = "https://elliott-fogg.github.io/l5r";
		this.get_all_data(delay_ms, test_fail);
		this.check_for_data();
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

	calculate_time_taken() {
		for (let dn in this.data) {
			let t = this.data[dn]["end_time"] - this.data[dn]["start_time"];
			console.log(`${dn}, ${Math.round(t)}ms`);
		}
	}

	async get_all_data(delay_ms=0, test_fail=false) {
		var start = performance.now();
		var myPromises = [];

		for (let data_name in this.data) {
			let url = this.hostname + this.data[data_name]["path"];
			myPromises.push(this.get_load_data_promise(url, data_name));
		}

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

		console.log("Complete!");
		this.loaded = true
	}

	async get_load_data_promise(url, data_name) {
		console.log(url, data_name);
		return new Promise((resolve) => {
			this.load_data(resolve, url, data_name);
		});
	}

	async load_data(resolve, url, data_name) {
		console.log("Received request for " + data_name);
		this.data[data_name]["start_time"] = performance.now();
		var json_data = await this.get_data(url);
		this.data[data_name]["data"] = json_data;
		this.data[data_name]["end_time"] = performance.now();
		if (json_data) {
			resolve([data_name, true]);
		} else {
			resolve([data_name, false]);
		}

		// resolve([data_name, json_data != null]);
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
			console.log("Fetch Error :-S", err);
		});
	}

	async delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(function(){resolve()}, ms);
		})
	}
}