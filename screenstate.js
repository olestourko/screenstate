function ScreenStateManager() {}
	ScreenStateManager.prototype.getCurrentScreenState = function() {
		for(var i = 0; i < this.screenState.length; i++) {
			if(this.screenState[i].containsX(window.innerWidth)) { return this.screenState[i]; }
		}
	}; 
	ScreenStateManager.prototype.init = function() {
		this.screenState = [];
		this.screenState.push(new ScreenState(1281, 65536));
		this.screenState.push(new ScreenState(1151, 1280));
		this.screenState.push(new ScreenState(978, 1150));
		this.screenState.push(new ScreenState(768, 977));
		this.screenState.push(new ScreenState(480, 767));
		this.screenState.push(new ScreenState(0, 479));
		this.lastScreenState = this.getCurrentScreenState();
	}
	ScreenStateManager.prototype.resize = function(_force) {
		var currentScreenState = this.getCurrentScreenState();
			if(!(currentScreenState.equals(this.lastScreenState)) || _force) {
				this.lastScreenState.runCallbackExit();
				currentScreenState.runCallbackEnter();
				this.lastScreenState = currentScreenState;
		}
	}
	function ScreenState(_minwidth, _maxwidth) {
		this.minwidth = _minwidth;
		this.maxwidth = _maxwidth;
	}
	ScreenState.prototype.callbackEnter = null;
	ScreenState.prototype.callbackExit = null;
	ScreenState.prototype.containsX = function(_x) {
		if(this.minwidth <= _x && this.maxwidth >= _x) return true;
		return false;
	}
	ScreenState.prototype.equals = function(_object) {
		if (!(_object instanceof ScreenState)) return false;
		if (this.minwidth == _object.minwidth && this.maxwidth == _object.maxwidth) { return true; }
		return false;
	}
	ScreenState.prototype.toString = function() {
		return "minwidth: " + this.minwidth + ", maxwidth: " + this.maxwidth;
	}
	ScreenState.prototype.runCallbackEnter = function() {
		if(typeof(this.callbackEnter) == "function") { this.callbackEnter(); }
	}
	ScreenState.prototype.runCallbackExit = function() {
		if(typeof(this.callbackExit) == "function") { this.callbackExit(); }
	}