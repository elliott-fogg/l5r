function all_spells_change_page(event) {

	var all_spells_tabs = document.querySelectorAll(".all_spells_tab");
	for (let tab of all_spells_tabs) {
		tab.classList.remove("active");
	}

	event.target.classList.add("active");
	var selected_page = event.target.innerHTML;

	for (let page_name of ["Air", "Earth", "Fire", "Water", "Void"]) {
		let elem = document.getElementById(`${page_name}-spells-content`);
		elem.classList.remove("active");
	}
	var select_elem = document.getElementById(`${selected_page}-spells-content`);
	select_elem.classList.add("active");
}

function all_spells_open_rank(event) {
	var dom_summary = event.target;
	var dom_details = dom_summary.parentNode;
	var dom_container = dom_details.parentNode;
	var all_details = dom_container.querySelectorAll("details");
	for (let rank_details of all_details) {
		if (rank_details != dom_details) {
			rank_details.open = false;
		}
	}
}
