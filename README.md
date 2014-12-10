##screenstate.js

This is a tiny responsive breakpoint tool. It is intended to be used as a simple Javascript compliment to the ``@media screen and (max-width: xxx)`` in CSS.
Logic can be executed between screen breakpoint changes through either callbacks or event listeners. The tool also includes a toggleable debug indicator.

[Example](http://olestourko.ca/screenstate/example.html)

###Include necessary files

    <script type="text/javascript" src="screenstate.js"></script>
	<link rel="stylesheet" type="text/css" href="screenstate.css"/>
	
Optional: jQuery (for events)

	<script type="text/javascript" src="jquery-1.10.2.min.js"></script>

			
###Initialize Screenstate Manager and add ScreenStates
	
Ranges of screen resolutions are represented with the ScreenState object. For example, screens between 480px to 800px are represented by a ScreenState object with ``minWidth`` of 480 and ``maxWidth`` of 800.
The ScreenState constructor takes the parameters ``<minWidth>, <maxWidth>, <debugColor>, <name>``.
	
	var sSM = new ScreenStateManager(true);		
	var desktop = sSM.add(new ScreenState(768, 65536, '#ff4400', 'Desktop'));
	var tablet = sSM.add(new ScreenState(480, 767, '#00ff44', 'Tablet'));
	var phone = sSM.add(new ScreenState(0, 479, '#4400ff', 'Phone'));	
	
###Respond to breakpoint changes

You can respond to screenState changes by either adding a callback function to a ScreenState:
	
	desktop.addEnterCallback(function() { 
		console.log("Entered: Desktop Screen"); 
	});
	
	desktop.addExitCallback(function() { 
		console.log("Exited: Desktop Screen"); 
	});

Or by listening for ``"screenstate_enter"`` or ``"screenstate_exit"`` events on ``window``:

	jQuery(window).on("screenstate_enter", function(e, screenState) {
	... your logic goes here ..
	});
	
##Projects using screenstate.js
[www.williamashley.com](http://www.williamashley.com)