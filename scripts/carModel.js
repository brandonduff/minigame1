/*
 * This is a factory that will produce cars to the given specification
 * A car can accelerate, brake, and turn.
 */

// TODO: Clean this up.
// Look at this link: http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
// for a good description of how to handle 2D cars.
CarGame.Car = function (spec) {
    var speed;
    var acceleration;
    var direction;
    var frontWheelVect = {};
    var rearWheelVect = {};
    var steerAngle;
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
    var turningLeft;
    var turningRight;

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
        frontWheelVect.x = position.x + width/2 * Math.cos(direction);
        frontWheelVect.y = position.y + width/2 * Math.sin(direction);
        rearWheelVect.x = position.x - width/2 * Math.cos(direction);
        rearWheelVect.y = position.y - width/2 * Math.sin(direction);
        steerAngle = 0;
        turningLeft = false;
        turningRight = false;
    }(spec));

    /*
     * Update our acceleration based on elapsed time if they're pressing on the gas
     */
    function accelerate(elapsedTime) {
        if(speed < 20)
            speed += accelForce * elapsedTime; // let's make it per second
        else
            speed = 20;
    }

    /*
     * Slow down when braking based on elapsed time
     */
    function brake(elapsedTime) {
        if(speed - brakeForce * elapsedTime > 0)
            speed -= brakeForce * elapsedTime;
    }

    /*
     * Update our direction when turning based on elapsed time.
     */
    function turnLeft(elapsedTime) {
       turningLeft = true;
    }

    function turnRight(elapsedTime) {
        turningRight = true;
    }
    /*
     * Draw our car on the screen using our specified position, width, and height
     */
    function draw(){
        context.save();

        context.translate(position.x, position.y);
        context.rotate(direction);
        context.translate(-position.x, -position.y);

        context.drawImage(carImage, position.x - width/2, position.y - height/2, width, height);
        context.restore();
    }

    /*
     * Update our model based on elapsed time.
     * This is where we convert acceleration to speed, speed to position, etc.
     */
    function update(elapsedTime) {
        // Recalculate our wheel positions based off of our new position.
        frontWheelVect.x = position.x + width/2 * Math.cos(direction);
        frontWheelVect.y = position.y + width/2 * Math.sin(direction);
        rearWheelVect.x = position.x - width/2 * Math.cos(direction);
        rearWheelVect.y = position.y - width/2 * Math.sin(direction);

        // Handle turning
        steerAngle = 0;
        if(turningLeft)
            steerAngle -= Math.PI/5; // This should be a "fun" constant
        if(turningRight)
            steerAngle += Math.PI/5;
        if(speed > 0)
        {
            speed -= frictForce * elapsedTime;
        }
        if(speed < 0)
            speed = 0;
        // Calculate the position of our wheels.
        rearWheelVect.x += speed * elapsedTime * Math.cos(direction);
        rearWheelVect.y += speed * elapsedTime * Math.sin(direction);
        frontWheelVect.x += speed * elapsedTime * Math.cos(direction + steerAngle);
        frontWheelVect.y += speed * elapsedTime * Math.sin(direction + steerAngle);

        // Calculate our new car position and direction based off our wheel positions
        position.x = (frontWheelVect.x + rearWheelVect.x) / 2;
        position.y = (frontWheelVect.y + rearWheelVect.y) / 2;
        direction =  Math.atan2(frontWheelVect.y - rearWheelVect.y , frontWheelVect.x - rearWheelVect.x);

        // Turn this off so our input can activate again if need be next update
        turningLeft = false;
        turningRight = false;
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
