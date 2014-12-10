	/**
	 * @author Oles Tourko
	 */
	
	/******************************************************************/
	/*ScreenState Manager                                             */
	/******************************************************************/
	function ScreenStateManager(_debug) {
		this.screenState = [];
		if (_debug) {
			this.indicator = document.createElement("div");
			this.indicator.className = "screenstate-indicator";
			document.body.appendChild(this.indicator);
		}
		var _this = this;
		window.addEventListener('resize', function() {
			_this.resize(false, _this);
		});
		this.unusedColors = this.generateColors();
		console.log(this.unusedColors);
	}
	
	ScreenStateManager.prototype = {
		container: window,
		getCurrentScreenState: function() {
			for(var i = 0; i < this.screenState.length; i++) {
				if(this.screenState[i].containsX(this.container.innerWidth)) { return this.screenState[i]; }
			}
		},
		add: function(_screenState) {
			if (this.overlaps(_screenState)) { return null; }
			this.screenState.push(_screenState);
			//Assign a color to the screenState if it has none set
			if(_screenState.color == null) {
				_screenState.color = this.unusedColors.shift();
			}
			
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
		resize: function(_force, _this) {
			if(!_this) {
				_this = this;
			}		
			var currentScreenState = _this.getCurrentScreenState();
			if(!currentScreenState || !_this.lastScreenState) { return; }
			if(!(currentScreenState.equals(_this.lastScreenState)) || _force) {
				
				if(typeof jQuery !== "undefined") {
					jQuery(window).trigger('screenstate_exit', [_this.lastScreenState]);
					jQuery(window).trigger('screenstate_enter', [currentScreenState]);
				}
				
				_this.lastScreenState.runCallbackExit();
				currentScreenState.runCallbackEnter();
				_this.lastScreenState = currentScreenState;
				_this.updateIndicator(currentScreenState);
			}
		},
		updateIndicator: function(_screenState) {
			if (!this.indicator) return;
			if (_screenState == null) return;
			//Update color
			if(_screenState.color != null) { 
				this.indicator.style.backgroundColor = _screenState.color;
			}
			else {
				this.indicator.style.backgroundColor = this.defaultColor;
			}
			//Update inner markup
			this.indicator.innerHTML = '<div>' + _screenState.toString() + '</div>';
		},
		//TODO: Replace the array loop with a hashmap
		getScreenState: function(_name) {
			for(var i = 0; i <this.screenState.length; i++) {
				if(this.screenState[i].name == _name) { return this.screenState[i]; }
			}
			return null;
		},
		generateColors: function() {
			var getPermutations = function(a, b, length) {
				var permutations = [];
				if(length > 2) {
					var recursivePermutations = getPermutations(a, b, length - 1);
					for(var i = 0; i < recursivePermutations.length; i++) {
						permutations.push(a + recursivePermutations[i]);
						permutations.push(b + recursivePermutations[i]);
					}					
				} else {
					permutations.push(a + a);
					permutations.push(a + b);
					permutations.push(b + a);
					permutations.push(b + b);					
				}
				return permutations;
			}	
			var colors = getPermutations('f', '0', 3).slice(1, -1);
			colors = colors.concat(getPermutations('f', '4', 3).slice(1, -1))
			for(var i = 0; i < colors.length; i++) {
				colors[i] = '#' + colors[i];
			}
			
			return colors.sort(function(a, b) { return a - b; });
		}
	}
	
	/******************************************************************/
	/*ScreenState objects                                             */
	/******************************************************************/
	//function ScreenState(_minwidth, _maxwidth, _color, _name) {
	function ScreenState(params) {
		this.enterCallbacks = new Array();
		this.exitCallbacks = new Array();
		this.minwidth = params["minWidth"];
		this.maxwidth = params["maxWidth"];
		this.name = params["name"];
		this.color = params["color"];
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
			var output = "";
			if(this.name.length > 0) { output += this.name + ": "; } 
			return output + this.minwidth + " - " + this.maxwidth;
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
