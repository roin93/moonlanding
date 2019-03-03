/**
 * author: roin93
 * date: 02.03.2019
 */

// Gravity on the moon is roughtly 1/6 of earth gravity
var gravity = 9.81 / 6;

// 1.25kg per unit fuel
var weightFuel = 1.25;

var ship;


//p5 function which is called after loading all html and js-data.
function setup() {
	//## Canvas
	{
		var canvas = createCanvas(windowWidth  / 2, windowHeight  / 1.15);
		// Move the canvas so it’s inside our <div id="playarea">.
		canvas.parent('playarea');
	}
}

function windowResized() {
  resizeCanvas(windowWidth/2, windowHeight/1.15);
}

function draw() {
	background(0);
}

function start() {
	// gravity
	gravity					= parseFloat(document.querySelector('[name="gravity"]').value);
	
	let startingFuel		= parseFloat(document.querySelector('[name="Treibstoffmenge"]').value);
	let startingVelocity	= parseFloat(document.querySelector('[name="startingVelocity"]').value);
	let startingHeight		= parseFloat(document.querySelector('[name="startingHeight"]').value);
	let startingOrientation	= parseFloat(document.querySelector('[name="startingOrientation"]').value);
	let targetX				= parseFloat(document.querySelector('[name="targetX"]').value);
	let targetY				= parseFloat(document.querySelector('[name="targetY"]').value);
	
	let thrustEngine		= parseFloat(document.querySelector('[name="thrustEngine"]').value);
	let consumptionEngine	= parseFloat(document.querySelector('[name="ConsumptionEngine"]').value);
	let thrustRCS			= parseFloat(document.querySelector('[name="thrustRCS"]').value);
	let consumptionRCS		= parseFloat(document.querySelector('[name="ConsumptionRCS"]').value);
	
	let shipWeight			= parseFloat(document.querySelector('[name="shipWeight"]').value);
	let impactVelocity		= parseFloat(document.querySelector('[name="impactVelocity"]').value);
}