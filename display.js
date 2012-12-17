(function() {

/*
Display is a class that creates a viewport and canvas within a display element. 
readwrite:
readonly:
	display
	viewport
	canvas
	context
methods:
	constructor(element)		Create Display object
	destroy()					Destroy Display object
	resolution(width, height)	Get resolution without argument, set resolution with argument
	resize() 					Fix the viewport width and height using the display width and height
	fullscreen(enable) 			Toggle without argument, enable or disable with argument
private:
	_construct					Construct Display object
*/

var Display = function(element) {
	// create display
	this.display = element;
	this.display.innerHTML = '';
	
	// create viewport
	this.viewport = document.createElement('div');
	this.viewport.setAttribute('class', 'viewport');
	this.display.appendChild(this.viewport);
	
	// create canvas
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('tabindex', '-1');
	this.viewport.appendChild(this.canvas);
	
	// set context
	this.context = this.canvas.getContext('2d');
};
var p = Display.prototype; 

p.destroy = function() {
	this.display.innerHTML = '';
	this.display = null;
	this.viewport = null;
	this.canvas = null;
	this.context = null;
};

p.resolution = function(width, height) {
	if (width === undefined) {
		return {
			width: this.canvas.width,
			height: this.canvas.height
		};
	} else if (typeof width === 'object') {
		this.canvas.width = width.width;
		this.canvas.width = width.height;
	} else if (height) {
		this.canvas.width = width;
		this.canvas.height = height;
	} else {
		throw Error('Invalid arguments, expected (), (width, height) or ({width, height})');
	}
	this.canvas.aspect_ratio = this.canvas.width/this.canvas.height;
};

p.resize = function() {
	var dw = this.display.offsetWidth, dh = this.display.offsetHeight;
	var vw = this.viewport.offsetWidth, vh = this.viewport.offsetHeight;
	var ar = this.canvas.aspect_ratio;
	// respect the canvas aspect ratio
	var aspect_ratio = dw/dh;
	if (aspect_ratio > ar) {
		// width is relatively larger than height, limit width by height
		dw = Math.ceil(dh * ar);
	} else {
		// height is relatively larger than width, limit height by width
		dh = Math.ceil(dw / ar);
	}
	if(dw != vw) { this.viewport.style.width = dw + 'px'; }
	if(dh != vh) { this.viewport.style.height = dh + 'px'; }
};

p.fullscreen = function(enable) {
	var e = this.display;
	if (enable === undefined) {
		Fullscreen.toggle(e);
	} else if (enable) {
		Fullscreen.enable(e);
	} else {
		Fullscreen.disable();
	}
};

window.Display = Display;

}());