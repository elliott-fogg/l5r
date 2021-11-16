importScripts("js/dice_roller.js");

class DiceRollerPlotFunctions extends DiceRollerBaseFunctions {

	constructor() {
		super();
	}

	process_data(roll, keep, explode_range, emphasis) {
		var raw_data = this.generate_roll_data(roll, keep, x_range, emphasis);
		var roll_prob = this.determine_roll_probability(raw_data);
		var roll_text = `${roll}k${keep}${emphasis ? " with Emphasis" : ""}`;
		var explode_text = `Exploding on: ${x_range.join(", ")}`;
		var chart_titles = {
			"axisX": "Roll Value",
			"roll_text": roll_text,
			"explode_text": explode_text
		};

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

		return {
			"normal": {
				"chart_titles": chart_titles,
				"data": formatted_data
			},
			"cumulative": {
				"chart_titles": c_chart_titles,
				"data": c_formatted_data
			}
		}
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

	generate_roll_data(roll, keep, explode_range, emphasis) {
		var roll_data = [];

		for (let i=0; i<this.sample_size; i++) {
			roll_data.push(this.minimal_roll(roll, keep, explode_range, emphasis));
		}

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
}


self.addEventListener("message", function(e) {
	var dr = new DiceRollerPlotFunctions();
	var d = e.data;

	postMessage(`Worker Started! Roll: ${d.roll}, Keep: ${d.keep}, X: ${d.explode_range}, Emphasis: ${d.emphasis}`);
	var output = dr.process_data(d.roll, d.keep, d.explode_range, d.emphasis);
	postMessage("Worker Finished!");
	postMessage(output);
	
	self.close();
});