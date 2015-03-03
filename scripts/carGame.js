/*
 * This is where the core of our game is. Holds objects and handles interaction
 * between them.
 */
CarGame.core = (function() {
    var arena,
        car,
        boulders = [],
        timers = [],
        myKeyboard = CarGame.input.Keyboard(),
        canvas, context,
        collisionDetection = CarGame.collisionDetection,
        lastTimeStamp;
    /*
     * Do our one-time initialization stuff
     */
    function initialize() {

        canvas = document.getElementById('id-canvas');
        context = canvas.getContext('2d');
        arena = CarGame.carArena({
            borderImage : CarGame.images['images/Background.png'],
            width : canvas.width,
            height : canvas.height,
            yOffset : 100 // This is the difference in height pixels between our arena and our whole canvas
        });

        car = CarGame.Car({
            carImage: CarGame.images['images/Car.png'],
            speed: 0,
            topSpeed : 400,
            direction: 0,
            accelForce: 400,
            brakeForce: 300,
            frictForce: 100,
            turnSpeed: Math.PI/4, // pi/4 is the only thing that makes sense for this
            width : 50,
            height : 20,
            position : {x : arena.width /2 - 50/2,
                        y : arena.height /2 - 20/2},
            playHeight : arena.playHeight,
            playWidth : arena.playWidth,
            wallSize : arena.wallSize
        });

       var boulder = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x: 1, y: 0},
           speed : 200,
           position : {x: 250, y: 200},
           rotation : 0,
           rotationSpeed : 5,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });
        var boulder2 = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x: -1, y: 0},
           speed : 200,
           position : {x: 500, y: 200},
           rotation : 0,
           rotationSpeed : 5,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });
         var boulder3 = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x : 1, y : 1},
           speed : 200,
           position : {x: 100, y: 350},
           rotation : 0,
           rotationSpeed : 5,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });
        var boulder4 = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x : 0.75, y : -.5},
           speed : 200,
           position : {x: 800, y: 300},
           rotation : 0,
           rotationSpeed : 5,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
        });
        for(var i = 0; i < 40; i++){
           timers.push(CarGame.Timer({
               lifeTime : 2,
               width : 24,
               position : {x : i * 24 + 5, y : canvas.height - (arena.yOffset * 0.4) + 5 },
               height : 24,
               image : CarGame.images['images/Clock.png']
           }));
        }

        boulders.push(boulder, boulder2, boulder3, boulder4);
        for(var i = 0; i < boulders.length; i++){
            boulders[i].setPosition(arena.getNextWallPosition(boulders, boulders[i].radius, i));
        }
        lastTimeStamp = performance.now();
        // Register input
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, car.accelerate);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_S, car.brake);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, car.turnLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, car.turnRight);

        requestAnimationFrame(gameLoop);
    }

    /*
     * Function to clear the canvas before drawing again. Can get artifacts if not done.
     */
    function clear(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    /*
     * Function to draw our level indicator on the top. Seemed silly to split this out to a module.
     */
    function drawLevelIndicator(){
        context.fillStyle = "yellow";
        context.fillRect(.15 * canvas.width, 0,.75 * canvas.width,.4 * arena.yOffset);
    }

    /*
     * Function to draw our timers below our arena.
     */
    function drawTimers(){
        context.fillStyle = "yellow";
        context.fillRect(0, canvas.height - arena.yOffset *.4, canvas.width, arena.yOffset);
        for(var i = 0; i < timers.length; i++){
           timers[i].draw();
        }
    }



    /*
     * Swap the directions of two boulders. Used when a collision occurs.
     */
    function swapBoulderDirections(obj1, obj2){
        var tempx = obj1.direction.x;
        var tempy = obj1.direction.y;
        obj1.direction.x = obj2.direction.x;
        obj1.direction.y = obj2.direction.y;
        obj2.direction.x = tempx;
        obj2.direction.y = tempy;

        // If our boulders get caught inside each other in between frames, we'll inch them away
        // until they're no longer stuck.
        while(collisionDetection.detectCollision(obj1, obj2) === true){
            obj1.position.x += obj1.direction.x *.1;
            obj1.position.y += obj1.direction.y * .1;
            obj2.position.x += obj2.direction.x * .1;
            obj2.position.y += obj2.direction.y * .1;
        }
    }

    /*
     * Do all of our updates on our models. This level should just be calling our models'
     * update functions
     * We'll also do collision detection between objects here.
     */
    function update(elapsedTime){
        for(var n = 0; n < boulders.length; n++){
           for(var j = n + 1; j < boulders.length; j++){
               if(collisionDetection.detectCollision(boulders[n], boulders[j]))
                   swapBoulderDirections(boulders[n], boulders[j]);
           }
           if(collisionDetection.detectCollision(car, boulders[n]))
               car.crash();
        }
        car.update(elapsedTime);
        for(var i = 0; i < boulders.length; i++)
            boulders[i].update(elapsedTime);
        if(timers.length > 0) {
            timers[0].update(elapsedTime);
            if (timers[0].isExpired() === true) {
                timers.splice(0, 1);
            }
        }
    }

    /*
     * Do all of our rendering. This level should just be calling our models' render functions.
     */
    function render() {
        clear();
        arena.draw();
        drawLevelIndicator();
        drawTimers();
        car.draw(arena.yOffset);
        for(var i = 0; i < boulders.length; i++)
            boulders[i].draw();
    }

    /*
     * This is our gameLoop function!
     */
    function gameLoop(time) {
        var elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        myKeyboard.update(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize
    }

}());
