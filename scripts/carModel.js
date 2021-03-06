/*
 * This is a factory that will produce cars to the given specification
 * A car can accelerate, brake, and turn.
 */

// Look at this link: http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
// for a good description of how to handle 2D cars.
CarGame.Car = function (spec) {
    var speed,
        topSpeed,
        direction,
        frontWheelVect = {},
        rearWheelVect = {},
        steerAngle,
        accelForce, // How much do we accelerate when we hit w?
        brakeForce, // How much do we slow down when we hit s?
        frictForce, // How much do we slow down usually?
        turnSpeed, // How quickly do we turn when pressing a or d?
        canvas = document.getElementById('id-canvas'),
        context = canvas.getContext('2d'),
        carImage,
        width,
        height,
        position = {},
        turningLeft,
        turningRight,
        playWidth, playHeight, wallSize, radius,
        crashed;

    (function initialize(spec){
        speed = spec.speed;
        topSpeed = spec.topSpeed;
        direction = spec.direction;
        accelForce = spec.accelForce;
        brakeForce = spec.brakeForce;
        frictForce = spec.frictForce;
        turnSpeed = spec.turnSpeed;
        carImage = spec.carImage;
        width = spec.width;
        height = spec.height;
        position = spec.position;
        steerAngle = 0;
        turningLeft = false;
        turningRight = false;
        playWidth = spec.playWidth;
        playHeight = spec.playHeight;
        wallSize = spec.wallSize;
        radius = (height)/2; // We'll underestimate the sphere for collision detection.
                             // Player would probably less mad if you cheat for him rather than against him
        crashed = false;
    }(spec));

    /*
     * Update our acceleration based on elapsed time if they're pressing on the gas
     */
    function accelerate(elapsedTime) {
        if(speed < topSpeed)
            speed += accelForce * elapsedTime/1000;
        else
            speed = topSpeed;
    }

    /*
     * Slow down when braking based on elapsed time
     */
    function brake(elapsedTime) {
        if(speed - brakeForce * elapsedTime/1000 > 0)
            speed -= brakeForce * elapsedTime/1000;
    }

    /*
     * Update our direction when turning based on elapsed time.
     */
    function turnLeft() {
       turningLeft = true;
    }

    function turnRight() {
        turningRight = true;
    }

    /*
     * Function that can be called externally to  tell the car it's crashed.
     */
    function crash() {
        crashed = true;
        speed = 0;
    }

    /*
     * Let us see if the car is crashed externally.
     */
    function isCarCrashed() {
        return crashed;
    }

    /*
     * Draw our car on the screen using our specified position, width, and height
     */
    function draw(){
        context.save();

        context.translate(position.x, position.y);
        context.rotate(direction + Math.PI); // Adding Pi flips the image so we're not appearing to drive backwards
        context.translate(-position.x, -position.y);

        context.drawImage(carImage, position.x - width/2, position.y - height/2, width, height);
        context.restore();
    }

    /*
     * Update our model based on elapsed time.
     */
    function update(elapsedTime) {
        elapsedTime /= 1000;
        // Recalculate our wheel positions based off of our new position.
        frontWheelVect.x = position.x + width/2 * Math.cos(direction);
        frontWheelVect.y = position.y + width/2 * Math.sin(direction);
        rearWheelVect.x = position.x - width/2 * Math.cos(direction);
        rearWheelVect.y = position.y - width/2 * Math.sin(direction);

        // Handle turning
        steerAngle = 0;
        if(turningLeft)
            steerAngle -= turnSpeed;
        if(turningRight)
            steerAngle += turnSpeed;
        if(speed > 0)
            speed -= frictForce * elapsedTime;
        if(speed < 0)
            speed = 0;
        if(isCarCrashed() === true)
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

        // Handle running into walls. We want this to be handled differently than hitting a boulder, since this isn't bad.
        if(position.x > playWidth + wallSize.width  - radius){
            position.x = playWidth + wallSize.width - 10 - radius;
            speed = 0;
        }
        if(position.x < wallSize.width + radius) {
            position.x = wallSize.width + radius + 10;
            speed = 0;
        }
        if(position.y > playHeight + wallSize.height - radius) {
            position.y = playHeight + wallSize.height - 10 - radius;
            speed = 0;
        }
        if(position.y < wallSize.height + radius) {
            position.y = wallSize.height + radius + 10;
            speed = 0;
        }

        // Turn this off so our input can activate again if need be next update
        turningLeft = false;
        turningRight = false;

    }
    return {
        position : position,
        radius : radius,
        accelerate : accelerate,
        brake : brake,
        turnLeft : turnLeft,
        turnRight : turnRight,
        update : update,
        draw : draw,
        crash : crash,
        isCarCrashed : isCarCrashed
    };

};
