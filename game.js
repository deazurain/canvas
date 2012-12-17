(function() {

/*
Object is a class that 
	readwrite:
		logic(delta)
		render()
	readonly:
		display
		timer
		keyboard
		mouse
	methods:
	private:
*/

var Game = function(element) {
	var self = this;
	this.display = new Display(element);
	this.keyboard = new Keyboard(element);
	this.mouse = new Mouse(element);
	this.timer = new Timer(function(delta) {
		self.display.resize();
		self.logic(delta);
		self.keyboard.done();
		self.display.context.clearRect(0, 0, self.display.canvas.width, self.display.canvas.height);
		self.render();
	});
	this.display.resolution(1440, 900);
};
var p = Game.prototype;

p.start = function() {
	this.timer.start();
}

p.stop = function() {
	this.timer.stop();
}

// Exports
window.Game = Game;

}());
