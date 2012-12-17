(function() {

var Keyboard = function(element) {
	var self = this;
	
	this.element = element;
	this.last = {};
	this.current = {};
	this._keydown = function(e) {
		self.current[e.which] = true;
	};
	this._keyup = function(e) {
		delete self.current[e.which];
	};
	this._blur = function() {
		self.last = {};
		self.current = {};
	};
	
	this.element.addEventListener('keydown', this._keydown);
	this.element.addEventListener('keyup', this._keyup);
	this.element.addEventListener('blur', this._blur);
};
var p = Keyboard.prototype;

p.destroy = function() {
	this.element.removeEventListener('keydown', this._keydown);
	this.element.removeEventListener('keyup', this._keyup);
	this.element.removeEventListener('blur', this._blur);
};

p.down = function(key) { return this.current[key] ? true : false; };

p.up = function(key) { return this.current[key] ? false : true; };

p.pressed = function(key) { return !this.last[key] && this.current[key] ? true : false; };

p.released = function(key) { return this.last[key] && !this.current[key] ? true : false; };

p.done = function() {
	this.last = this.current;
	this.current = {};
	for(x in this.last) { this.current[x] = this.last[x]; }
};

window.Keyboard = Keyboard;

}());