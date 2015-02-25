/*
 * Our main CarGame object is defined in loader.js.
 * This is where we can add functions and stuff to it.
 */


/*
 * This is our initialize function for our game. Called in our loader.js
 */
CarGame.core = (function() {
    var arena,
        car,
        boulder,
        myKeyboard = CarGame.input.Keyboard();
    /*
     * Do our one-time initialization stuff
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
            direction: 0,
            accelForce: 5,
            brakeForce: 5,
            frictForce: 0.5,
            turnSpeed: Math.PI/5,
            width : 50,
            height : 20,
            position : {x : arena.width /2 - 50/2,
                        y : arena.height /2 - 20/2},
            playHeight : arena.playHeight,
            playWidth : arena.playWidth,
            wallSize : arena.wallSize
        });

       boulder = CarGame.Boulder({
           boulderImage: CarGame.images['images/Boulder.png'],
           width : 100,
           height : 100,
           direction : Math.PI / 7,
           speed : 30,
           position : {x: 300, y: 300},
           rotation : 0,
           rotationSpeed : 0.7,
           playHeight : arena.playHeight,
           playWidth : arena.playWidth,
           wallSize : arena.wallSize
       });

        // Register input
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, car.accelerate);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_S, car.brake);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, car.turnLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, car.turnRight);

        requestAnimationFrame(gameLoop);
    }

    /*
     * Do all of our updates on our models. This level should just be calling our models'
     * update functions
     */
    function update(elapsedTime){
        car.update(elapsedTime);
        boulder.update(elapsedTime);
    }

    /*
     * Do all of our rendering. This level should just be calling our models' render functions.
     */
    function render() {
        arena.draw();
        car.draw();
        boulder.draw();
    }

    //TODO: Get our gameloop function sketched out
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
