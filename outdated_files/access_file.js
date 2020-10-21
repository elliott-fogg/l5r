function access_skills(textArea_id) {
	var ta = document.getElementById(textArea_id);
	var output_string = "Working...\n";
	
	var data = get_skills();
	output_string += data[0].name;
	// output_string += String(data);

	output_string += "End\n";
	ta.innerHTML = output_string;
}