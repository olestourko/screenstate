	function ScreenStateManager(_debug) {
		this.screenState = [];
		this.debug = false;
		
		//Add a coloured indicator
		if (_debug) { 
			this.debug = true;
			jQuery("body").append('<div class="screenstate-indicator"/>');
			this.indicator = jQuery("body .screenstate-indicator");
		}
	}
	ScreenState.prototype.defaultColor = '#ffffff';
	ScreenStateManager.prototype.getCurrentScreenState = function() {
		for(var i = 0; i < this.screenState.length; i++) {
			if(this.screenState[i].containsX(window.innerWidth)) { return this.screenState[i]; }
		}
	}
	//Add screenstate
	/*	Todo: 
		-prevent insertion of overlapping screenstates (return false if they do)
		-provide function for removing screenstate
	*/
	ScreenStateManager.prototype.add = function(_screenState) {
		this.screenState.push(_screenState);
		this.lastScreenState = this.getCurrentScreenState();
		if(this.debug) {
			this.indicator.css("background-color", this.lastScreenState.color); 
		}
		return true;
	}
	ScreenStateManager.prototype.resize = function(_force) {
		var currentScreenState = this.getCurrentScreenState();
			if(!(currentScreenState.equals(this.lastScreenState)) || _force) {
				this.lastScreenState.runCallbackExit();
				currentScreenState.runCallbackEnter();
				this.lastScreenState = currentScreenState;
				//If debug is on, change indicator colors
				if (this.debug) { 
					if (currentScreenState.color != null) { this.indicator.css("background-color", currentScreenState.color); }
					else { this.indicator.css("background-color", this.defaultColor); }
				}
		}
	}
	function ScreenState(_minwidth, _maxwidth, _color) {
		this.minwidth = _minwidth;
		this.maxwidth = _maxwidth;
		//Todo: better validation for input color
		if (_color != null && typeof(_color) == 'string') { this.color = _color; }
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