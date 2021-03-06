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
let targetPrecision;

let shipSize = 40;

var lastDraw;
var currentOrientation = 0;



//p5 function which is called after loading all html and js-data.
function setup() {
	//## Canvas
	{
		var canvas = createCanvas(windowWidth  / 2, windowHeight  / 1.15);
		// Move the canvas so it’s inside our <div id="playarea">.
		canvas.parent('playarea');
		background(0);
		noStroke(); // no other lines.
		textAlign(CENTER, CENTER);
	}
	noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth/2, windowHeight/1.15);
}

function draw() {
	if(!gameRunning)
		return;
	
	background(0);
	
	displayText();
	
	push();
	fill(255);
	
	// calculate current position
	let y = map(ship.height, startingHeight, 0, 0, height - shipSize);
	let x = map(ship.position.x, -5000, 5000, 0, width - shipSize); 
	
	// save time which will be needed for this frame.
	let timeElapsed = millis() - lastDraw;
	lastDraw = millis();
	// call update for the ship
	ship.calculateChanges(timeElapsed / 1000);
	let orientationChange = currentOrientation - ship.orientation;
	
	translate(x, y)
	rotate(radians(orientationChange));
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
	pop();
	
	let checked = checkForEnd();
	if(checked != 0)
	{
		endGame(checked == 1);
	}
	
}

function start() {
	// gravity
	gravity					= parseFloat(document.querySelector('[name="gravity"]').value);
	
	let startingFuel		= parseFloat(document.querySelector('[name="Treibstoffmenge"]').value);
	let startingVelocity	= parseFloat(document.querySelector('[name="startingVelocity"]').value);
	startingHeight			= parseFloat(document.querySelector('[name="startingHeight"]').value);
	let startingOrientation	= parseFloat(document.querySelector('[name="startingOrientation"]').value);
	currentOrientation = startingOrientation;
	targetX					= parseFloat(document.querySelector('[name="targetX"]').value);
	targetY					= parseFloat(document.querySelector('[name="targetY"]').value);
	targetPrecision         = parseFloat(document.querySelector('[name="targetPrecision"]').value);
	
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

function checkForEnd() {
	if(ship.height > targetY)
		return 0;
	
	// next to ground.
	// Upside down were nice.
	if(ship.orientation > 15 || ship.orientation < -15)
		return -1;
	
	// not crashed?
	if(sqrt(ship.velocity.x * ship.velocity.x + ship.velocity.y * ship.velocity.y) < ship.impactVelocity)
		return 1;
	
	// next to the target?
	if(ship.height <= targetY && abs(ship.position.x - targetX) <= targetPrecision)
		return 1;
	
	// did not hit the target
	return -1;
}

function endGame(won) {
	// print Message on playarea
	push();
	translate(width / 2, height / 2);
	
	textSize(30);
	if(won)
	{
		fill(20,200,20);
		text('Game won!', 0,0);
		console.log('won');
	} else {
		fill(200,20,20);
		text('Crashed!', 0,0);
		console.log('crashed');
	}
	pop();
	gameRunning = false;
}

function displayText() {
	push();
	translate(width * 0.85, height * 0.05);
	fill(255);
	// Aktuelle Höhe:
	textSize(14);
	text('Hoehe: ' + str(int(ship.height)) + ' m', 0, 0);
	// Geschwindigkeit
	text('Geschwindigkeit x: ' + str(int(ship.velocity.x)) + ' m/s', 0, 15);
	text('Geschwindigkeit y: ' + str(int(ship.velocity.y)) + ' m/s', 0, 30);
	// Treibstoff:
	text('Treibstoffmenge: ' + str(int(ship.fuel)) + ' units', 0, 45);
	
	pop();
}

// listener
function keyPressed() {
	if(!gameRunning)
		return false;
	
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
	//return false;
}

function keyReleased() {
	if(!gameRunning)
		return false;
	
	if(key === RIGHT_ARROW || key === LEFT_ARROW)
		ship.stopRCS();
	else
		ship.stopEngine();
	// prevent failures
	//return false;
}