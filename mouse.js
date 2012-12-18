(function() {

/*
Mouse is a class coordinates relative to the element provided in the
constructor. 
	readwrite:
		relative									Element that the coordinates are calculated relatively to
	readonly:
		x
		y
	methods:
		constructor(element)			Set x and y relative to element. 
	private:
*/

var Mouse = function(element) {
	var self = this;

	this.element = element;
	this.relative = element;
	this.x = 0;
	this.y = 0;
	this._mousemove = function(e) {
		var ox = self.relative.offsetLeft;
		var oy = self.relative.offsetTop;
		if (Fullscreen.enabled()) {
			var f = Fullscreen.element();
			ox -= f.offsetLeft;
			oy -= f.offsetTop;
		}
		self.x = e.pageX - ox;
		self.y = e.pageY - oy;
	};
	
	element.addEventListener('mousemove', this._mousemove);
};
var p = Mouse.prototype;

p.destroy  = function() {
	this.element.removeEventListener('mousemove', this._mousemove);
}

// exports
window.Mouse = Mouse;

}());
