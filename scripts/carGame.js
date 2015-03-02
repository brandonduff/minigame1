/*
 * This is where the core of our game is. Holds objects and handles interaction
 * between them.
 */
CarGame.core = (function() {
    var arena,
        car,
        boulders = [],
        myKeyboard = CarGame.input.Keyboard();
    /*
     * Do our one-time initialization stuff
     * TODO: Randomize boulder starting positions and directions
     */
    function initialize() {

        var canvas = document.getElementById('id-canvas');
        arena = CarGame.carArena({
            borderImage : CarGame.images['images/Background.png'],
            width : canvas.width,
            height : canvas.height
        });

        car = CarGame.Car({
            carImage: CarGame.images['images/Car.png'],
            speed: 0,
            topSpeed : 50,
            direction: 0,
            accelForce: 10,
            brakeForce: 10,
            frictForce: 3,
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
           speed : 30,
           position : {x: 250, y: 200},
           rotation : 0,
           rotationSpeed : 0.7,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });
        var boulder2 = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x: -1, y: 0},
           speed : 30,
           position : {x: 500, y: 200},
           rotation : 0,
           rotationSpeed : 0.7,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });
         var boulder3 = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x : 1, y : 1},
           speed : 30,
           position : {x: 100, y: 350},
           rotation : 0,
           rotationSpeed : 0.7,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });
        var boulder4 = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : {x : 0.75, y : -.5},
           speed : 30,
           position : {x: 800, y: 300},
           rotation : 0,
           rotationSpeed : 0.7,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
        });

        boulders.push(boulder, boulder2, boulder3, boulder4);
        // We can decide how ma
        // Register input
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, car.accelerate);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_S, car.brake);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, car.turnLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, car.turnRight);

        requestAnimationFrame(gameLoop);
    }

    /*
     * Take two objects with a position and radius and see if they collide
     */
    function detectCollision(obj1, obj2)
    {
        // Pythagorean theorem to find distance
        var distance = Math.sqrt(
            ((obj1.position.x - obj2.position.x) * (obj1.position.x - obj2.position.x)) +
            ((obj1.position.y - obj2.position.y) * (obj1.position.y - obj2.position.y))
        );
        return (distance < obj1.radius + obj2.radius);
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
        while(detectCollision(obj1, obj2) === true){
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
               if(detectCollision(boulders[n], boulders[j]))
                   swapBoulderDirections(boulders[n], boulders[j]);
           }
        }
        car.update(elapsedTime);
        for(var i = 0; i < boulders.length; i++)
            boulders[i].update(elapsedTime);
    }

    /*
     * Do all of our rendering. This level should just be calling our models' render functions.
     */
    function render() {
        arena.draw();
        car.draw();
        for(var i = 0; i < boulders.length; i++)
            boulders[i].draw();
    }

    /*
     * This is our gameLoop function!
     */
    function gameLoop(time) {
        var elapsedTime = performance.now() - time;
        myKeyboard.update(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize
    }

}());
