CarGame.Car = (function() {
    var speed;
    var acceleration;
    var direction;
    var accelForce; // How much do we accelerate when we hit w?
    var brakeForce; // How much do we slow down when we hit s?
    var frictForce; // How much do we slow down usually?
    var turnSpeed; // How quickly do we turn when pressing a or d?

    initialize = (function() {
	speed = spec.speed;
	direction = spec.direction;
	acceleration = spec.acceleration;
	accelForce = spec.accelForce;
	brakeForce = spec.brakeForce;
	frictForce = spec.frictForce;
	turnSpeed = spec.turnSpeed;
    }());
    
    /*
     * Update our acceleration based on elapsed time if they're pressing on the gas
     */
    function accelerate(elapsedTime) {
	acceleration += accelForce * (elapsedTime / 1000); // let's make it per second
    }

    /*
     * Slow down when braking based on elapsed time
     */
    function brake(elapsedTime) {
	acceleration -= brakeForce * (elapsedTime / 1000);
    }	

    /*
     * Update our direction when turning based on elapsed time.
     */
    function turn(elapsedTime) {
	direction += turnSpeed * (elapsedTime / 1000);
    }

    /*
     * Update our model based on elapsed time.
     * This is where we convert acceleration to speed, speed to position, etc.
     */
    function update(elapedTime) {

	// Let's add some stuff for git
	// some diffs
    }

}(spec));
