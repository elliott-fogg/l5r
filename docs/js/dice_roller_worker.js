onmessage = function(e) {
	console.log(e);
	postMessage("WORKER STARTED: " + e);
	self.close();
}