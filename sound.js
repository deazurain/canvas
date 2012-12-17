/*
 * Sound API
 * Loses about 90% of the functionality, 0% if you hack your way around it but provides
 * the ability to easily load, cache play and pause sound effects and loops. An effect 
 * is played and thrown away. A loop is a resumeable loop. 
 * 
 * Author: Mick van Gelderen
 * Date: 14 December 2012
 */
 
 (function() {
	
	var Sound = {
		context: null,
		buffers: {}
	};
	
	// aliases
	var context, buffers;
	
	Sound.initialize = function() {
		if (typeof AudioContext == "function") {
			this.context = new AudioContext();
		} else if (typeof webkitAudioContext == "function") {
			this.context = new webkitAudioContext();
		} else {
			throw new Error('Browser does not support AudioContext');
		}
		context = Sound.context;
		buffers = Sound.buffers;
	};
	
	Sound.load = function(key, url, callback) {
		// Caching
		if(buffers[key] !== undefined) { return; }
		buffers[key] = null;
		
		// Load an audio file asynchronously
        var r = new XMLHttpRequest();
        r.open("GET", url, true);
        r.responseType = "arraybuffer";
		r.onload = function() {
            context.decodeAudioData(r.response,
				function success(buffer) {
					buffers[key] = buffer;
					if(callback) { callback(key); }
				},
				function failure(error) {
					throw Error(error);
				}
			);
        };

        r.send();
	};
	
	Sound.source = function(key) {
		var s = context.createBufferSource();
		s.buffer = buffers[key];
		s.connect(context.destination);
		return s;
	};
	
	window.Sound = Sound;
	
	Sound.Effect = function(key) {
		this.key = key;
	};
	
	Sound.Effect.prototype.play = function() {
		var source = Sound.source(this.key);
		source.noteOn(0);
	};
	
	Sound.Loop = function(key) {
		this.key = key;
		this.start = context.currentTime;
		this.stop = context.currentTime;
		this.offset = 0;
		this.duration = buffers[key].duration;
	};
	
	Sound.Loop.prototype.play = function(offset) {
		this.offset = offset || this.offset;
		
		// stop ever playing sounds
		if(this.sr) { this.sr.noteOff(0); }
		if(this.sl) { this.sl.noteOff(0); }
		
		this.start = context.currentTime;
		
		this.sr = Sound.source(this.key);
		this.sl = Sound.source(this.key);
		this.sl.loop = true;

		var d = this.duration;
		this.sr.noteGrainOn(this.start, this.offset, d - this.offset);
		this.sl.noteOn(this.start + d - this.offset);
	};
	
	Sound.Loop.prototype.pause = function() {
		this.stop = context.currentTime;
		
		this.offset += this.stop - this.start;
		while(this.offset > this.duration) {
			this.offset -= this.duration;
		}
		
		this.sr.noteOff(this.stop); this.sr = null;
		this.sl.noteOff(this.stop); this.sl = null;
	};
	
 }())