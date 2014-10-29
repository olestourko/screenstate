	/**
	 * screenstate.js version 0.9.2
	 *
	 * @author Oles Tourko
	 */
	
	
	/******************************************************************/
	/*ScreenState Manager                                             */
	/******************************************************************/
	function ScreenStateManager(_debug) {
		this.screenState = [];
		if (_debug) { 
			var body = jQuery("body");
			body.append('<div class="screenstate-indicator"/>');
			this.indicator = body.find(".screenstate-indicator");
		}
	}
	
	ScreenStateManager.prototype = {
		container: jQuery('html'),
		getCurrentScreenState: function() {
			for(var i = 0; i < this.screenState.length; i++) {
				if(this.screenState[i].containsX(this.container.width())) { return this.screenState[i]; }
			}
		},
		add: function(_screenState) {
			if (this.overlaps(_screenState)) { return null; }
			this.screenState.push(_screenState);
			this.lastScreenState = this.getCurrentScreenState();
			this.updateIndicator(this.lastScreenState);
			return _screenState;
		},
		overlaps: function(_screenState) {
			for(var i = 0; i < this.screenState.length; i++) {
				if(this.screenState[i].containsX(_screenState.getMinWidth()) || this.screenState[i].containsX(_screenState.getMaxWidth())) { return true; }
			}
			return false;
		},
		resize: function(_force) {
			var currentScreenState = this.getCurrentScreenState();
			if(!currentScreenState || !this.lastScreenState) { return; }
			if(!(currentScreenState.equals(this.lastScreenState)) || _force) {	
				jQuery(window).trigger('screenstate_exit', [this.lastScreenState]);
				jQuery(window).trigger('screenstate_enter', [currentScreenState]);
				this.lastScreenState.runCallbackExit();
				currentScreenState.runCallbackEnter();
				this.lastScreenState = currentScreenState;
				this.updateIndicator(currentScreenState);
			}
		},
		updateIndicator: function(_screenState) {
			if (!this.indicator) return;
			if (_screenState == null) return;
			//Update color
			if(_screenState.color != null) { this.indicator.css("background-color", _screenState.color); }
			else { this.indicator.css("background-color", this.defaultColor); }
			//Update inner markup
			this.indicator.html('<div>' + _screenState.minwidth + ' - ' + _screenState.maxwidth + '</div>');
		}		
	}
	
	/******************************************************************/
	/*ScreenState objects                                             */
	/******************************************************************/
	function ScreenState(_minwidth, _maxwidth, _color) {
		this.enterCallbacks = new Array();
		this.exitCallbacks = new Array();
		this.minwidth = _minwidth;
		this.maxwidth = _maxwidth;
		if (_color != null && typeof(_color) == 'string') { this.color = _color; }
	}
	
	ScreenState.prototype = {
		defaultColor: '#ffffff',
		addEnterCallback: function(_callback) {
			if(typeof(_callback) == "function") {
				this.enterCallbacks.push(_callback);
			}		
		},
		addExitCallback: function(_callback) {
			if(typeof(_callback) == "function") { 
				this.exitCallbacks.push(_callback); 
			}
		},
		containsX: function(_x) {
			if(this.minwidth <= _x && this.maxwidth >= _x) return true;
			return false;
		},
		equals: function(_object) {
			if (!(_object instanceof ScreenState)) return false;
			if (this.minwidth == _object.minwidth && this.maxwidth == _object.maxwidth) { return true; }
			return false;
		},
		getMaxWidth: function() { 
			return this.maxwidth; 
		},
		getMinWidth: function() { 
			return this.minwidth;
		},
		toString: function() {
			return "minwidth: " + this.minwidth + ", maxwidth: " + this.maxwidth;
		},
		runCallbackEnter: function() {
			for(var i = 0; i < this.enterCallbacks.length; i++) {
				if(typeof(this.enterCallbacks[i]) == "function") { 
					this.enterCallbacks[i]();
				}
			}
		},
		runCallbackExit: function() {
			for(var i = 0; i < this.exitCallbacks.length; i++) {
				if(typeof(this.exitCallbacks[i]) == "function") { 
					this.exitCallbacks[i]();
				}
			}
		}
	}
