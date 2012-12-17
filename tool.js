(function() {

/*
Tool is an object that provides some utility javascript functions. 
readwrite:
	prefixes							An array of prefixes used to find prefixed functions
readonly:
methods:
	arrize								Turn object into array if it's not an array
	prefixed(object, names)				Returns the key of a possible prefixed property of method of
										an object. Example Tool.prefixed(document, 'cancelFullScreen');
										might return 'webkitCancelFullScreen'. 
private:
	_prefixed_single(object, name)		See method prefixed. 
*/

var Tool = {};
var p = Tool;

p.prefixes = ['webkit', 'moz', 'ms', 'o'];

p.arrize = function(object) {
	if (object instanceof Array) { return object; }
	return [object];
};

p.prefixed = function(object, names) {
	names = this.arrize(names);
	for (var i = 0, l = names.length, key; i < l; i++) {
		key = this._prefixed_single(object, names[i]);
		if (key) { return key; }
	}
};

p._prefixed_single = function(object, name) {
	if (name in object) { return object[name]; }
	n = name.substr(0,1).toUpperCase() + name.substr(1);
	for (var i = 0, l = this.prefixes.length; i < l; i++) {
		var key = this.prefixes[i] + n;
		if (key in object) { return key; }
	}
};

// Export
window.Tool = Tool;

}());