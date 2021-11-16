self.addEventListener("message", function(e) {
	var data = e.data;
	var roll = data.roll;
	var keep = data.keep;
	var explode_range = data.explode_range;
	var emphasis = data.emphasis;

	postMessage(`Worker Started! Roll: ${roll}, Keep: ${keep}, X: ${explode_range}, Emphasis: ${emphasis}`);
	self.close();
});