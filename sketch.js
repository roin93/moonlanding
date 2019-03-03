/**
 * author: roin93
 * date: 02.03.2019
 */

// Gravity on the moon is roughtly 1/6 of earth gravity
var gravity = 9.81 / 6;

// 1.25kg per unit fuel
var weightFuel = 1.25;

var ship;

var gameRunning = false;

let startingHeight;
let targetX;
let targetY;

let shipSize = 40;

var lastDraw;


//p5 function which is called after loading all html and js-data.
function setup() {
	//## Canvas
	{
		var canvas = createCanvas(windowWidth  / 2, windowHeight  / 1.15);
		// Move the canvas so it’s inside our <div id="playarea">.
		canvas.parent('playarea');
		background(0);
		noStroke(); // no other lines.
	}
	noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth/2, windowHeight/1.15);
}

function draw() {
	if(gameRunning === false)
		return;
	
	background(0);
	
	// calculate current position
	y = map(ship.height, startingHeight, 0, 0, (height-shipSize));
	
	// save time which will be needed for this frame.
	let timeElapsed = millis() - lastDraw;
	lastDraw = millis();
	// call update for the ship
	ship.calculateChanges(timeElapsed / 1000);
	
	translate(width / 2, y)
	beginShape();
	{
		// top
		vertex(0, 0);
		// right bottom
		vertex(20, shipSize / 4 * 3);
		// right before engine
		vertex(3, shipSize / 4 * 3);
		// right bottom engine
		vertex(5, shipSize);
		// left bottom engine
		vertex(-5, shipSize);
		// left before engine
		vertex(-3, shipSize / 4 * 3);
		// left bottom
		vertex(-20, shipSize / 4 * 3);
		// closing will be done alone.
	}
	endShape(CLOSE);
	//triangle(0, 0, -20, 20, 20, 20);
	//rect(-5, 20, 10, 15);
}

function start() {
	// gravity
	gravity					= parseFloat(document.querySelector('[name="gravity"]').value);
	
	let startingFuel		= parseFloat(document.querySelector('[name="Treibstoffmenge"]').value);
	let startingVelocity	= parseFloat(document.querySelector('[name="startingVelocity"]').value);
	startingHeight			= parseFloat(document.querySelector('[name="startingHeight"]').value);
	let startingOrientation	= parseFloat(document.querySelector('[name="startingOrientation"]').value);
	targetX					= parseFloat(document.querySelector('[name="targetX"]').value);
	targetY					= parseFloat(document.querySelector('[name="targetY"]').value);
	
	let thrustEngine		= parseFloat(document.querySelector('[name="thrustEngine"]').value);
	let consumptionEngine	= parseFloat(document.querySelector('[name="ConsumptionEngine"]').value);
	let thrustRCS			= parseFloat(document.querySelector('[name="thrustRCS"]').value);
	let consumptionRCS		= parseFloat(document.querySelector('[name="ConsumptionRCS"]').value);
	
	let shipWeight			= parseFloat(document.querySelector('[name="shipWeight"]').value);
	let impactVelocity		= parseFloat(document.querySelector('[name="impactVelocity"]').value);
	
	ship = new Ship(weightFuel, impactVelocity, shipWeight, thrustEngine, consumptionEngine, thrustRCS, consumptionRCS);
	ship.setStartingCondition(startingFuel, startingVelocity, startingHeight, startingOrientation, 0);
	
	loop();
	gameRunning = true;
	lastDraw = millis();
}

// listener
function keyPressed() {
	if(keyCode === LEFT_ARROW) {
		ship.rotateLeft();
	} else if(keyCode === RIGHT_ARROW) {
		ship.rotateRight();
	} else {
		ship.stopRCS();
	}
	if(keyCode === UP_ARROW) {
		ship.startEngine();
	} else if(keyCode === DOWN_ARROW) {
		ship.stopEngine();
	}
	
	// prevent failures
	return false;
}

function keyReleased() {
	if(key === RIGHT_ARROW || key === LEFT_ARROW)
		ship.stopRCS();
	else
		ship.stopEngine();
	// prevent failures
	return false;
}