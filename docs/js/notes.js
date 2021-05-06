class NotesObject {

	constructor() {
		console.log("Initiating Test Tabs");

		// Bind Save Note Button
		document.getElementById("note_save").onclick = this.save_note.bind(this);
		document.getElementById("note_new").onclick = this.new_note.bind(this);

		this.notes = [];
		this.load_from_localStorage();
		this.current = null;
		this.refresh_note_tabs();
	}

	add_note_tab(i) {
		var title = this.notes[i]["title"];
		var date = this.notes[i]["date"];

		var table = document.createElement("table");
		var row1 = document.createElement("tr");
		var row2 = document.createElement("tr");
		var cell_title = document.createElement("td");
		var cell_date = document.createElement("td");
		var blank_cell = document.createElement("td");
		var cell_trash = document.createElement("td");

		row1.appendChild(cell_title);
		row1.appendChild(cell_date);
		row2.appendChild(blank_cell);
		row2.appendChild(cell_trash);

		table.appendChild(row1);
		table.appendChild(row2);

		cell_title.className = "note_tab_title";
		cell_title.innerHTML = title;
		
		cell_date.className = "note_tab_date";
		cell_date.innerHTML = new Date(date).toLocaleDateString();

		var lock_svg = document.createElement("img");
		lock_svg.height = 20;
		lock_svg.classList.add("note_icon");
		if (this.notes[i].lock) {
			lock_svg.src = "images/lock.svg";
			lock_svg.classList.add("note_lock");
			lock_svg.onclick = function() {
				event.stopPropagation();
				this.notes[i].lock = false;
				this.refresh_note_tabs();
			}.bind(this);
		} else {
			lock_svg.src = "images/unlock.svg";
			lock_svg.classList.add("note_unlock");
			lock_svg.onclick = function() {
				console.log("Unlock Clicked", i);
				event.stopPropagation();
				this.notes[i].lock = true;
				if (i == this.current) {
					this.save_note();
				} else {
					this.refresh_note_tabs();
				}
			}.bind(this);
		}
		cell_trash.appendChild(lock_svg);

		cell_trash.className = "note_tab_trash";
		var trash_svg = document.createElement("img");
		trash_svg.src = "images/trash.svg";
		trash_svg.height = 15;
		trash_svg.className = "note_icon note_trash";
		trash_svg.onclick = function() {
			event.stopPropagation();
			event.preventDefault();
			this.delete_note(i);
		}.bind(this);
		cell_trash.appendChild(trash_svg);

		if (this.current == i) {
			table.classList.add("current");
		} else {
			table.onclick = function() {
				this.open_note(i);
			}.bind(this);
		}

		table.classList.add("note_tab");
		document.getElementById("note_selection").appendChild(table);
	}

	refresh_note_tabs() {
		console.log("Refreshing")
		console.log(this.notes);
		document.getElementById("note_selection").innerHTML = "";

		// Set Displayed Note
		var note_title = document.getElementById("note_input_title");
		var note_text = document.getElementById("note_input_text");

		if (this.current == null) {
			note_title.value = "";
			note_text.value = "";
			note_title.disabled = true;
			note_text.disabled = true;
			document.getElementById("note_save").disabled = true;
		} else {
			note_title.value = this.notes[this.current]["title"];
			note_text.value = this.notes[this.current]["text"];

			if (this.notes[this.current]["lock"]) {
				// Note is locked, disabled inputs?
				note_title.disabled = true;
				note_text.disabled = true;
				document.getElementById("note_save").disabled = true;
			} else {
				note_title.disabled = false;
				note_text.disabled = false;
				document.getElementById("note_save").disabled = false;
			}
		}

		// If no notes are created yet, present default text
		if (this.notes.length == 0) {
			document.getElementById("note_selection").innerHTML = "No Notes";
			return;
		}

		console.log(this.notes)

		// Sort Notes according to current criteria
		var indexed_notes = [];
		for (let [index, elem] of this.notes.entries()) {
			indexed_notes.push([index, elem]);
		}
		indexed_notes.sort(this.date_sort);

		// Display all note tabs
		for (let i=0; i<indexed_notes.length; i++) {
			let orig_index = indexed_notes[i][0];
			this.add_note_tab(orig_index);
		}
	}

	save_note() {
		var note_title = document.getElementById("note_input_title");
		var note_text = document.getElementById("note_input_text");

		if (note_title.value == "") {
			note_title.value = `Note ${this.notes.length}`;
		}

		this.notes[this.current]["title"] = note_title.value;
		this.notes[this.current]["text"] = note_text.value;
		this.notes[this.current]["date"] = new Date().toISOString();

		this.save_to_localStorage();

		this.refresh_note_tabs();
	}

	new_note() {
		var note_title = document.getElementById("note_input_title");
		var note_text = document.getElementById("note_input_text");

		note_title.value = this.new_note_title();
		note_text.value = "";

		this.notes.push({
			"title": note_title.value,
			"text": note_text.value,
			"date": new Date().toISOString(),
			"lock": false
		});

		this.current = this.notes.length - 1;
		this.refresh_note_tabs();
		console.log(this.notes);
	}

	new_note_title() {
		var default_title = "_new_note";
		var titles = [];
		for (let note of this.notes) {
			titles.push(note["title"]);
		}
		if (!(titles.includes(default_title))) {
			return default_title;
		} else for (let i=1; i>0; i++) {
			let note_title = `${default_title}(${i})`;
			if (titles.includes(note_title)) {
				continue;
			} else {
				return note_title;
			}
		}
	}

	open_note(i) {
		this.current = i;
		let note = this.notes[i];
		this.refresh_note_tabs();
	}

	delete_note(i) {
		console.log(i, this.current);
		if (this.current != null) {
			if (this.current == i) {
				console.log("Current Note Deleted");
				this.current = null;
			} else if (this.current > i) {
				this.current -= 1;
			}
		}
		this.notes.splice(i, 1);
		this.refresh_note_tabs();
	}

	save_to_localStorage() {
		localStorage["notes"] = JSON.stringify(this.notes);
	}

	load_from_localStorage() {
		if (window.localStorage.hasOwnProperty("notes")) {
			this.notes = JSON.parse(localStorage["notes"]);
		} else {
			console.log("No notes found locally.");
		}
	}

	// Sorting Methods /////////////////////////////////////////////////////////

	date_sort(a, b) {
		if (a[1].date < b[1].date) {
			return 1;
		}
		return -1;
	}
}


function localStorageSpace() {
	console.log("test");
	var allStrings = "";
	console.groupCollapsed("localStorage keys");
	for (var key in window.localStorage) {
		if (window.localStorage.hasOwnProperty(key)) {
			allStrings += window.localStorage[key];
			console.groupCollapsed(key);
			console.log(window.localStorage[key]);
			console.groupEnd();
		}
	}
	console.groupEnd();

	var total_size = 0;
	if (allStrings) {
		// (num_Chars * 16bits/char) / (bits/kilobyte)
		// Javascript stores chars in UTF-16, so each char needs 2 bytes
		total_size += (allStrings.length * 16) / (8 * 1024)
		total_size += 3 // Overhead for constructing LocalStorage object
		return `${total_size} KB`
	} else {
		return 'Empty (0 KB)';
	}
}
