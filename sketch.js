/**
 * author: roin93
 * date: 02.03.2019
 */
 
 var width = windowWidth  / 2;
 var height = windowHeight / 2;

//p5 function which is called after loading all html and js-data.
function setup() {
	//Prevents p5 from spawning a new canvas
	var canvas = createCanvas(width, height);
 
	// Move the canvas so it’s inside our <div id="playarea">.
	canvas.parent('playarea');
}

function draw() {
	background(0);
}