(function() {

/*
Interface, functions that may be implemented differently so that
the Timer is easily adaptable to a different underlying timing system
*/
var Interface = {
	time: function() { return Date.now(); },
	schedule: function(callback, offset) { return setTimeout(callback, offset); },
	revoke: function(timer) { return clearTimeout(timer); }
};

/*
Timer object. Easy timing :)
readwrite:
	fps			Desired frames per second
	callback	Function that is called with desired fps
readonly:
	last		Last time the callback was called
	enabled		Whether or not the timer is enabled
methods:
	start()		Start the timer
	stop()		Stop the timer immediately
private:
	_timer		The timer object itself
	_schedule	Internal method to schedule the callbacks
*/

var Timer = function(callback, fps) {
	this.fps = fps || 60; // desired fps
	this.callback = callback || function() {}; // callback function
	this.enabled = false;
};

var p = Timer.prototype;

p.start = function() {
	// Timer  must be disabled to stop it
	if(this.enabled) { return; }
	this.enabled = true;
	
	this.last = Interface.time();
	this._schedule();
};

p.stop = function() {
	// Timer must be enabled to stop it
	if(!this.enabled) { return; }
	this.enabled = false;
	// Stop the timed function
	Interface.revoke(this._timer);
};

// Private stuff, do not use these properties or methods directly. 
p._schedule = function() {
	var self = this;
	this._timer = Interface.schedule(function() {
		var now = Interface.time(); // current time
		var delta = now - self.last; // delta time in miliseconds
		self.last = now;
		self.callback(delta);
		if (self.enabled) { self._schedule(); }
	}, 1000/this.fps);
};

// Exports
window.Timer = Timer;

}());