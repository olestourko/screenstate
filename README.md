#screenstate.js

A tiny responsive breakpoint tool, including an indicator to keep track of your current screen state for debugging.
[Example](http://olestourko.ca/screenstate/example.html)

####1: Include jquery, screenstate.js, screenstate.css

	
    <script type="text/javascript" src="jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="screenstate.js"></script>
    <link rel="stylesheet" type="text/css" href="screenstate.css"/>

			
####2: Init screenstate manager, setup screenstates
	
	var screenStateManager = new ScreenStateManager(true);		
	var desktop = screenStateManager.add(new ScreenState(768, 65536, '#ff4400'));
	var tablet = screenStateManager.add(new ScreenState(480, 767, '#00ff44'));
	var phone = screenStateManager.add(new ScreenState(0, 479, '#4400ff'));

####3: Setup callbacks for each screenstate
	
	desktop.addEnterCallback(function() { 
		console.log("Entered: Desktop Screen"); 
	});
	tablet.addEnterCallback(function() { 
		console.log("Entered: Tablet Screen"); 
	});
	phone.addEnterCallback(function() { 
		console.log("Entered: Phone Screen"); 
	});	
	
	desktop.addExitCallback(function() { 
		console.log("Exited: Desktop Screen"); 
	});
	tablet.addExitCallback(function() { 
		console.log("Exited: Tablet Screen"); 
	});
	phone.addExitCallback(function() { 
		console.log("Exited: Phone Screen"); 
	});
			
####4: Listen to window resize events

	window.addEventListener('resize', function() { screenStateManager.resize(); });