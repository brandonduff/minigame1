/*
 * This is a factory that will produce cars to the given specification
 * A car can accelerate, brake, and turn.
 */

// TODO: Actually, let's make our speed and acceleration one number and our direction have an x and y.
// Then position.x can be elaspedTime * speed * position.x
// Then we can use 1/2at^2 + vt + pos to calculate our new position for x and y
CarGame.Car = function (spec) {
    var speed;
    var acceleration;
    var direction = {};
    var accelForce; // How much do we accelerate when we hit w?
    var brakeForce; // How much do we slow down when we hit s?
    var frictForce; // How much do we slow down usually?
    var turnSpeed; // How quickly do we turn when pressing a or d?
    var canvas = document.getElementById('id-canvas'),
        context = canvas.getContext('2d');
    var carImage;
    var width;
    var height;
    var position = {};
    var center = {};

    (function initialize(spec){
        speed = spec.speed;
        direction = spec.direction;
        acceleration = spec.acceleration;
        accelForce = spec.accelForce;
        brakeForce = spec.brakeForce;
        frictForce = spec.frictForce;
        turnSpeed = spec.turnSpeed;
        carImage = spec.carImage;
        width = spec.width;
        height = spec.height;
        position = spec.position;
        center = spec.center;
    }(spec));

    /*
     * Update our acceleration based on elapsed time if they're pressing on the gas
     */
    function accelerate(elapsedTime) {
        if(speed < 20)
            acceleration += accelForce * elapsedTime; // let's make it per second
    }

    /*
     * Slow down when braking based on elapsed time
     */
    function brake(elapsedTime) {
        if(speed > 0)
            acceleration -= brakeForce * elapsedTime;
    }

    /*
     * Update our direction when turning based on elapsed time.
     * TODO: This could all be wrong
     * Let's get this modeled correctly with vectors. We will have an acceleration vector
     * that is due to our car moving forward. This will always be parallel to the direction of
     * the car. Our direction vector from turning will always be 90 degrees to that. Then
     * we can just add them together to find the magnitude of the resultant vector and take
     * the inverse tangent of the angles of the component vectors to find the angle of
     * the resultant. Given this we should be able to get a new position.
     * We will have to factor the velocity from this new vector into our old velocity to get
     * our position and direction.
     */
    function turnLeft(elapsedTime) {
        direction = Math.PI;
    }

    function turnRight(elapsedTime) {
        direction = 0;
    }
    /*
     * Draw our car on the screen using our specified position, width, and height
     */
    function draw(){
        context.drawImage(carImage, position.x, position.y, width, height);
    }

    /*
     * Update our model based on elapsed time.
     * This is where we convert acceleration to speed, speed to position, etc.
     */
    function update(elapsedTime) {
        if(speed < 20)
            speed += acceleration * (elapsedTime / 1000);
        // For direction, our x-position change = speed * cos(direction), y-position change = speed*sin(direction)
        position.x += speed;// * Math.cos(direction);
        position.y += speed;

    }
    return {
        accelerate : accelerate,
        brake : brake,
        turnLeft : turnLeft,
        turnRight : turnRight,
        update : update,
        draw : draw
    };

};
