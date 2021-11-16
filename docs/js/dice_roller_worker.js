onmessage = function(e) {
	postMessage("WORKER STARTED!");
	self.close();
}