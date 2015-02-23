/*
 * This is a factory that will produce cars to the given specification
 * A car can accelerate, brake, and turn.
 */
CarGame.Car = function (spec) {
    var speed;
    var acceleration;
    var direction;
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
TODO:* Let's get this modeled correctly with vectors. We will have an acceleration vector
TODO:* That is due to our car moving forward. This will always be parallel to the direction
TODO:* the car. Our direction vector from turning will always be 90 degrees to that. Then
TODO:* we can just add them together to find the magnitude of the resultant vector and take
TODO:* the inverse tangent of the angles of the component vectors to find the angle of
TODO:* the resultant. Given this we should be able to get a new position.
TODO:* We will have to factor the velocity from this new vector into our old velocity to get
TODO:* our position and direction.
     */
    function turn(elapsedTime) {
        direction += turnSpeed * (elapsedTime / 1000);
        while(direction < 0) {
            direction += 2 * Math.PI;
        }
        if(direction > 2 * Math.PI) {
            direction -= 2 * Math.PI;
        }
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
        speed += acceleration * (elapsedTime / 1000);
        // For direction, our x-position change = speed * cos(direction), y-position change = speed*sin(direction)
        position.x += speed * Math.cos(direction);
        position.y += speed * Math.sin(direction);

    }
    return {
        accelerate : accelerate,
        brake : brake,
        turn : turn,
        update : update,
        draw : draw
    }

};
