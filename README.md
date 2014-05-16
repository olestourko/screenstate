screenstate.js
==============
A tiny responsive breakpoint tool

Usage:
	1. Include jquery, screenstate.js, screenstate.css
			``
			<script type="text/javascript" src="jquery-1.10.2.min.js"></script>
			<script type="text/javascript" src="screenstate.js"></script>
			<link rel="stylesheet" type="text/css" href="screenstate.css"/>
			``
	2. Init screenstate manager, setup screenstates
			``
			var screenStateManager = new ScreenStateManager();
			screenStateManager.add(new ScreenState(1024, 65536, '#ff0000'));	//color optional, for debugging
			screenStateManager.add(new ScreenState(00, 1023, '#00ff00'));
			screenStateManager.init(true);	//pass true for debugging
			window.addEventListener('resize', function() { screenStateManager.resize(); });
			``
	3. Setup callbacks for each screenstate
			``
			screenStateManager.screenState[0].callbackEnter = function() { console.log("entered screen state 0"); };
			screenStateManager.screenState[1].callbackEnter = function() { console.log("entered screen state 1"); };
			
			screenStateManager.screenState[0].callbackExit = function() { console.log("entered screen state 0"); };
			screenStateManager.screenState[1].callbackExit= function() { console.log("entered screen state 1"); };
			``