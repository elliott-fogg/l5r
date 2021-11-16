// Dice Rolling Function ///////////////////////////////////////////////////////

class DiceRollerWithPlot extends DiceRollerController{

	constructor() {
		super();

		this.p_plot = null;
		this.c_plot = null;
		this.chart_type = "normal";

		var self = this;
		document.getElementById("plot_type_select").onchange = function() {
			self.set_plot_type();
		}

		this.create_plot();
	}


	// Chart Plotting //////////////////////////////////////////////////////////

	on_input_change(change_id) {
		DiceRollerController.prototype.on_input_change.call(this, change_id);
		this.initiate_worker();
	}

	minimal_roll(roll, keep, explode_range, emphasis) {
		var dice = [];
		for (let i=0; i < roll; i++) {
			var die_roll = this.roll_d10();

			if (emphasis && die_roll == 1) {
				die_roll = this.roll_d10();
			}

			var total = die_roll;

			while (explode_range.includes(die_roll)) {
				die_roll = this.roll_d10();
				total += die_roll;
			}

			dice.push(total);
		}

		dice = dice.sort((a,b) => b-a)

		var selected_dice = dice.slice(0, keep);

		var final_result = 0;

		for (let i of selected_dice) {
			final_result += i
		}

		return final_result
	}

	initiate_worker() {
		var [roll, keep, x_range, _, emphasis, _] = this.get_roll_input();

		var worker_input = {
			"roll": roll,
			"keep": keep,
			"explode_range": x_range,
			"emphasis": emphasis
		}

		var self = this;
		this.worker = new Worker("js/dice_roller_worker.js");
		this.worker.addEventListener("message", function(e) {
			self.process_worker_data(e.data);
		})

		this.worker.postMessage(worker_input);
	}

	process_worker_data(data) {
		if (typeof data === "string") {
			console.log(data);
		} else {
			this.create_plots_from_worker_output(data);
		}
	}

	create_plots_from_worker_output(data) {
		console.log(data);
		this.generate_plot(data["normal"]["data"],
		                   data["normal"]["chart_titles"],
		                   probabilityChart);
		this.generate_plot(data["cumulative"]["data"],
		                   data["cumulative"]["chart_titles"],
		                   probabilityChart);
	}

	create_plot() {
		var [roll, keep, x_range, _, emphasis, _] = this.get_roll_input();

		this.plot_input = {
			"roll": roll,
			"keep": keep,
			"x_range": x_range,
			"emphasis": emphasis
		}

		var raw_data = this.generate_roll_data(roll, keep, x_range, emphasis);
		var roll_prob = this.determine_roll_probability(raw_data);

		var roll_text = `${roll}k${keep}${emphasis ? " with Emphasis" : ""}`;
		var explode_text = `Exploding on: ${x_range.join(", ")}`;
		var chart_titles = {
			"axisX": "Roll Value",
			"roll_text": roll_text,
			"explode_text": explode_text
		} 

		console.log("Expected value: ", raw_data.reduce((a,b) => a+b, 0)/raw_data.length)

		// Cumulative Probability Plot
		var cumulative_prob = this.determine_cumulative_probability(roll_prob);
		var c_formatted_data = this.format_roll_data(cumulative_prob);
		var c_chart_titles = chart_titles;

		c_chart_titles["title"] = "Cumulative Roll Probability";
		c_chart_titles["axisY"] = "Chance of rolling >= value";
		this.generate_plot(c_formatted_data, c_chart_titles, "cumulativeChart", true);

		// Probability Plot
		var formatted_data = this.format_roll_data(roll_prob);
		chart_titles["title"] = "Roll Probability";
		chart_titles["axisY"] = "Chance of rolling value";
		this.generate_plot(formatted_data, chart_titles, "probabilityChart");
	}

	generate_roll_data(roll, keep, explode_range, emphasis) {
		var roll_data = [];

		console.log("Starting sampling...");

		for (let i=0; i<this.sample_size; i++) {
			roll_data.push(this.minimal_roll(roll, keep, explode_range, emphasis));
		}

		console.log("Sampling complete.");

		return roll_data;
	}

	determine_roll_probability(roll_data) {
		var max_val = 10, min_val = 10;
		for (let i of roll_data) {
			if (i > max_val) {max_val = i};
			if (i < min_val) {min_val = i};
		}

		var roll_counts = {};
		for (let i=min_val; i<=max_val; i++) {
			roll_counts[i] = 0;
		}

		for (let r of roll_data) {
			roll_counts[r] += 1;
		}

		for (let val in roll_counts) {
			roll_counts[val] = roll_counts[val] / this.sample_size;
		}

		return roll_counts;
	}

	determine_cumulative_probability(roll_counts) {
		var cumsum_prob = {};
		var sorted_keys = Object.keys(roll_counts).sort((a, b) => b-a);
		var running_total = 0;
		for (let k of sorted_keys) {
			running_total += roll_counts[k];
			cumsum_prob[k] = running_total;
		}
		return cumsum_prob;
	}

	format_roll_data(roll_counts) {
		var formatted_data = []
		for (let k in roll_counts) {
			if (roll_counts[k] == 0) {
				formatted_data.push({x: parseInt(k), y: null});
			} else {
				formatted_data.push({x: parseInt(k), y:roll_counts[k]});
			}
		}

		return formatted_data;
	}

	generate_plot(data, chart_titles, chart_id, c_plot=false) {
		var striplines = [];
		if (c_plot) {
			striplines = [{value: 0.5, color: "red", lineDashType: "dash",
							label: "50%"}];
		}

		var chart = new CanvasJS.Chart(chart_id, {
			animationEnabled: false,
			theme: "light2",
			title: {
				text: chart_titles["title"],
				fontSize: 30
			},
			subtitles: [
				{
					text: chart_titles["roll_text"],
					fontSize: 24
				},
				{
					text: chart_titles["explode_text"]
				}
			],
			axisY: {
				title: chart_titles["axisY"],
				titleFontColor: "black",
				valueFormatString: "##.##%",
				minimum: 0,
				maximum: c_plot ? 1 : null,
				stripLines: striplines
			},
			axisX: {
				title: chart_titles["axisX"],
				minimum: 0,
				titleFontColor: "black",
				gridThickness: 1
			},
			data: [{
				type: "line",
				indexLabelFontSize: 16,
				connectNullData: true,
				nullDataLineDashType: "shortDot",
				yValueFormatString: "##.######%",
				dataPoints: data
			}]
		});

		if (c_plot) {
			this.c_plot = chart;
		} else {
			this.p_plot = chart;
		}
		chart.render();
	}

	set_plot_type() {
		var p_plot = document.getElementById("probabilityChart");
		var c_plot = document.getElementById("cumulativeChart");

		var type_select = document.getElementById("plot_type_select");
		this.chart_type = type_select.value;
		if (this.chart_type == "normal") {
			p_plot.classList.remove("hidden");
			c_plot.classList.add("hidden");
			if (this.p_plot != null) {
				this.p_plot.render();
			}
		} else {
			p_plot.classList.add("hidden");
			c_plot.classList.remove("hidden");
			if (this.c_plot != null) {
				this.c_plot.render();
			}
		}
	}

// End Class

}
