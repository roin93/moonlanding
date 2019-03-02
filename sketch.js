/**
 * author: roin93
 * date: 02.03.2019
 */

// Gravity on the moon is roughtly 1/6 of earth gravity
const gravity = 9.81 / 6;

//#####
//## working variables.
//## This variables will change while the game / simulation is running
//#####
var currentHeight;
var currentVelocity;
var currentOrientation;
var currentOrientationChange;
var currentFuel;
var currentWeight;

//#####
//## Starting conditions
//#####
var startingHeight = 20000;
var startingVelocity = [0, 2000];
var startingOrientation = 0;
var startingFuel = 1000;


// 1.25kg per unit fuel
var weightFuel = 1.25;


//p5 function which is called after loading all html and js-data.
function setup() {
	//## Canvas
	{
		var canvas = createCanvas(windowWidth  / 2, windowHeight  / 2);
		// Move the canvas so it’s inside our <div id="playarea">.
		canvas.parent('playarea');
	}
	
	//#####
	//## Setting currentValues to the starting values.
	//#####
	currentHeight = startingHeight;
	currentVelocity = startingVelocity;
	currentOrientation = startingOrientation;
	currentOrientationChange = 0;
	currentFuel = startingFuel;
	currentWeight = calculateWeight();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);
}

// Calculate the weight of the ship
function calculateWeight() {
	return weightShip + currentFuel * weightFuel;
}