class Ship {
	constructor(fuel, fuelWeight) {
		this.impactVelocity = 11;
		this.weightShip = 1000;
		
		// Engine
		this.Engine = new Engine(10000, 10);
		this.RCS = new Engine(10, 0.1);
		this.engineActive = false;
		// We need to save if rcs is firering clockwise or anti-clockwise
		// 1  = clockwise
		// -1 = anti-clockwise
		// 0  = off
		this.RCSActive = 0;
		
		// Fuel
		this.fuelWeight = fuelWeight;
		
		this.fuel = 0;
		this.velocity = [0,0];
		// orientation of 0 is engine pointing to the bottom.
		this.orientation = 0;
		this.orientationChange = 0;
		this.position.x = 0;
		this.position.y = 0;
	}
	
	get weight() {
		return this.weightShip + this.fuel * this.fuelWeight;
	};
	
	get height() {
		return this.position.y;
	};
	
	setStartingCondition(fuel, vel, height, orientation, orientationChange) {
		this.fuel = fuel;
		this.velocity = vel;
		this.height = height;
		this.orientation = orientation;
		this.orientationChange = orientationChange;
	}
	
	startEngine() {
		engineActive = true;
	}
	
	stopEngine() {
		engineActive = false;
	}
	
	rotateLeft() {
		RCSActive = -1;
	}
	
	rotateRight() {
		RCSActive = 1;
	}
	
	stopRCS() {
		RCSActive = 0;
	}
	
	// calculate the changes of internal values for the given time in seconds.
	calculateChanges(time) {
		let fuelConsumption = 0;
		let thrustEngine = 0;
		let velocityChange = 0;
		let orientationChange = 0;
		let orientationChangeChange = 0;
		let thrustRCS = 0;
		
		let weightBefore = this.weight;
		let velocityBefore = this.velocity;
		let orientationChangeBefore = this.orientationChange;
		let orientationBefore = this.orientation;
		
		let positionBefore = this.position;
		
		if(this.engineActive)
		{
			fuelConsumption = this.Engine.consumption * time;
			thrustEngine = this.Engine.thrust;
		}
		if(RCSActive !== 0)
		{
			fuelConsumption += this.RCS.consumption * time;
			thrustRCS = this.RCS.thrust * RCSActive;
		}
		
		this.fuel -= fuelConsumption;
		
		let weightMean = (weightBefore - this.weight) / 2;
		
		// calculate the new orienatation and so on.
		{
			orientationChangeChange = thrustRCS / weightMean * time;
			this.orientation += (this.orientationChange + orientationChangeChange) / 2 * time;
			this.orientationChange += orientationChangeChange;
		}
		
		// calculate the velocity change by thrust and weight change
		{
			let acc = thrustEngine / weightMean;
			velocityChange = vel(acc, getMeanAngle(orientatioBefore, orientationChangeBefore, thrustRCS, time), [0, 0]);
			// gravity acceleration
			velocityChange += [0, -gravity * time * time];
			this.velocity -= velocityChange;
		}
		
		// calculate position change
		{
			// ufff
			// normally: x = x0 + v*t + a * t*t
			// now: x = x0 + v*t * a*t*t + a_ * t*t*t
			// where a_ the change of acceleration over time is (sin / cos) of the angle
			// problem the change of the angle is also accelerated by the rcs
			// so a_ is something like sin/cos of (angle0 + angle_change * t)
		}
		
		this.height = 0;
	}
}

var getMeanAngle = function(angle0, angleVelocity, angleAcceleration, time)
{
	let angle1 = angle0 + angleVelocity * time + angleAcceleration * time * time;
	return (angle0 + angle1) / 2;
}

var vel = function(acc, angle, vel0) {
	return vel0 + [sin(angle), cos(angle)] * acc;
}