(function() {

var requestFullScreen = Tool.prefixed(document.documentElement, 'requestFullScreen');
var cancelFullScreen = Tool.prefixed(document, ['exitFullScreen', 'cancelFullScreen', 'cancelFullscreen']);
var isFullScreen = Tool.prefixed(document, 'isFullScreen');
var currentFullScreenElement = Tool.prefixed(document, 'currentFullScreenElement');

if(!requestFullScreen) { throw Error('Browser does not support enabling fullscreen'); }
if(!cancelFullScreen) { throw Error('Browser does not support disabling fullscreen'); }
if(!isFullScreen) { throw Error('Browser does not support checking if fullscreen is enabled'); }
if(!currentFullScreenElement) { throw Error('Browser does not support finding the fullscreen element'); }

var Fullscreen = {
	enable: function(element) {
		if(requestFullScreen === 'webkitRequestFullScreen') {
			element[requestFullScreen](Element.ALLOW_KEYBOARD_INPUT);
		} else {
			element[requestFullScreen]();
		}
	},
	disable: function() {
		document[cancelFullScreen]();
	},
	toggle: function(element) {
		this.enabled() ? this.disable() : this.enable(element);
	},
	enabled: function() {
		return document[isFullScreen];
	},
	element: function() {
		return document[currentFullScreenElement];
	}
};

// Export
window.Fullscreen = Fullscreen;

}());