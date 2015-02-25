/*
 * Our main CarGame object is defined in loader.js.
 * This is where we can add functions and stuff to it.
 */


/*
 * This is our initialize function for our game. Called in our loader.js
 */
CarGame.core = (function() {
    var arena;
    var car;
    var myKeyboard = CarGame.input.Keyboard();
    /*
     * Do our one-time initialization stuff
     */
    function initialize() {
        var elapsedTime = 0,
            lastTimeStamp = performance.now();

        // TODO: Add width and height instead of size. Arena should be a rectangle.
        arena = CarGame.carArena({
            borderImage : CarGame.images['images/Background.png'],
            size : 450
        });
        car = CarGame.Car({
            carImage: CarGame.images['images/Car.png'],
            speed: 0,
            direction: 0,
            accelForce: 5,
            acceleration: 0,
            brakeForce: 5,
            frictForce: 0.5,
            turnSpeed: 0,
            width : 50,
            height : 20,
            position : {x : arena.size /2 - 50/2,
                        y : arena.size /2 - 20/2}
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
    }

    /*
     * Do all of our rendering. This level should just be calling our models' render functions.
     */
    function render() {
        arena.draw();
        car.draw();
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
