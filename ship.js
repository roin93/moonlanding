class Ship {
	constructor(fuelWeight, impact, weight, engineThrust, engineConsumption, rcsThrust, rcsConsumption) {
		this.impactVelocity = impact;
		this.weightShip = weight;
		
		// Engine
		this.Engine = new Engine(engineThrust, engineConsumption);
		this.RCS = new Engine(rcsThrust, rcsConsumption);
		this.engineActive = false;
		// We need to save if rcs is firering clockwise or anti-clockwise
		// 1  = clockwise
		// -1 = anti-clockwise
		// 0  = off
		this.RCSActive = 0;
		
		// Fuel
		this.fuelWeight = fuelWeight;
		
		this.fuel = 0;
		this.velocity = {x:0, y:0};
		// orientation of 0 is engine pointing to the bottom.
		this.orientation = 0;
		this.orientationChange = 0;
		this.position = {x:0, y:0};
	}
	
	get weight() {
		return this.weightShip + this.fuel * this.fuelWeight;
	};
	
	get height() {
		return this.position.y;
	};
	
	setStartingCondition(fuel, vel, height, orientation, orientationChange) {
		this.fuel = fuel;
		this.velocity.y = vel;
		this.position.y = height;
		this.orientation = orientation;
		this.orientationChange = orientationChange;
	}
	
	startEngine() {
		this.engineActive = true;
	}
	
	stopEngine() {
		this.engineActive = false;
	}
	
	rotateLeft() {
		this.RCSActive = -1;
	}
	
	rotateRight() {
		this.RCSActive = 1;
	}
	
	stopRCS() {
		this.RCSActive = 0;
	}
	
	// calculate the changes of internal values for the given time in seconds.
	// will just produce accurate results if called with small values for time because of approximate linearization.
	calculateChanges(time) {
		let fuelConsumption = 0;
		let thrustEngine = 0;
		let thrustRCS = 0;
		
		// Calculate the fuel consumption by the engine and RCS thrusters.
		if(this.engineActive)
		{
			fuelConsumption = this.Engine.consumption * time;
			thrustEngine = this.Engine.thrust;
		}
		if(this.RCSActive !== 0)
		{
			fuelConsumption += this.RCS.consumption * time;
			thrustRCS = this.RCS.thrust * this.RCSActive;
		}
		
		let weightBefore = this.weight;
		this.fuel -= fuelConsumption;
		// Calculate the mean weight which will be used for the mean acceleration calculation.
		let weightMean = (weightBefore + this.weight) / 2;
		
		// temporaly safe the orientation before any changes.
		//let orientationChangeBefore = this.orientationChange;
		let orientationBefore = this.orientation;
		let orientationChangeAcceleration = 0;
		// calculate the new orienatation.
		{
			orientationChangeAcceleration = thrustRCS / weightMean;
			this.orientation += this.orientationChange * time + orientationChangeAcceleration * time * time;
			if(this.orientation > 180)
				this.orientation - 360;
			if(this.orientation < -180)
				this.orientation + 360;
			this.orientationChange += orientationChangeAcceleration * time;
		}
		
		// Calculate the mean orientation for a linear acceleration vector.
		let meanOrientation = radians((orientationBefore + this.orientation) / 2);

		let acc = -thrustEngine / weightMean;
		
		let velocityBefore = this.velocity;
		// calculate the velocity change by thrust and weight change
		{
			this.velocity.x += sin(meanOrientation) * acc * time;
			this.velocity.y += cos(meanOrientation) * acc * time + gravity * time;
			//this.velocity += [sin(meanOrientation), cos(meanOrientation)] * acc * time + [0, -gravity] * time;
		}
		
		let positionBefore = this.position;
		// calculate position change
		{
			this.position.x += velocityBefore.x * time + sin(meanOrientation) * acc * time * time;
			this.position.y -= velocityBefore.y * time + cos(meanOrientation) * acc * time * time - gravity * time * time;
			//this.position += velocityBefore * time + [sin(meanOrientation), cos(meanOrientation)] * acc * time * time + [0, -gravity] * time * time;
		}
	}
}

/* var getMeanAngle = function(angle0, angleVelocity, angleAcceleration, time)
{
	let angle1 = angle0 + angleVelocity * time + angleAcceleration * time * time;
	return (angle0 + angle1) / 2;
} */

/* var vel = function(acc, angle, vel0) {
	return vel0 + [sin(angle), cos(angle)] * acc;
} */