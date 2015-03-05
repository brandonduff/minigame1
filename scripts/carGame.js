/*
 * This is where the core of our game is. Holds objects and handles interaction
 * between them.
 */
CarGame.screens['game-play'] = (function() {
    var arena,
        car,
        boulders = [],
        timers = [],
        myKeyboard = CarGame.input.Keyboard(),
        collisionDetection = CarGame.collisionDetection,
        lastTimeStamp = performance.now(), currentLevel = 0, lost, win, levelText, winText, playAgainText, lossText,
        canvas = document.getElementById('id-canvas'),
        context = canvas.getContext('2d'),
        elapsedTimeSinceStart = 0,
        gameIsPlaying = false,
        animationPlaying,
        getReadyText = CarGame.text.Text({
            text : "Get Ready!",
            font : '48px Comic Sans MS, cursive, sans-serif',
            fill : 'rgba(0, 255, 0, 1)',
            stroke : 'rgba(0, 255, 0, 1)',
            pos : {x : canvas.width/2 - 64 * 2.5,  y: canvas.height/2 - 64}
        }),
        animationText,
        askingToPlayAgain = false;
    /*
     * Do our one-time initialization stuff
     */
    function initialize(level) {

        currentLevel = level + 1;
        elapsedTimeSinceStart = 0;

        lost = false;
        win = false;
        gameIsPlaying = true;
        boulders = [];
        timers = [];
        lossText = CarGame.text.Text({
                text: 'You Lose!',
                font: '48px Comic Sans MS, cursive, sans-serif',
                fill: 'rgba(255, 0, 0, 1)',
                stroke: 'rgba(255, 0, 0, 1)',
                pos: {x: canvas.width / 2 - 100, y: canvas.height / 2 - 100}
        });
        winText = CarGame.text.Text({
                text: 'You Win!',
                font: '48px Comic Sans MS, cursive, sans-serif',
                fill: 'rgba(0, 255, 0, 1)',
                stroke: 'rgba(0, 255, 0, 1)',
                pos: {x: canvas.width / 2 - 100, y: canvas.height / 2 - 100}
        });
        playAgainText = CarGame.text.Text({
            text: "Play Again? Y/N",
            font: '48px Comic Sans MS, cursive, sans-serif',
            fill: 'rgba(0, 0, 0, 1)',
            stroke: 'rgba(0, 0, 0, 1)',
            pos: {x: canvas.width/2 - 150, y: canvas.height /2 - 100 + winText.height}
        });
        arena = CarGame.carArena({
            borderImage : CarGame.images['images/Background.png'],
            width : canvas.width,
            height : canvas.height,
            yOffset : 100 // This is the difference in height pixels between our arena and our whole canvas
        });
        levelText = CarGame.text.Text({
            text : 'Level ' + currentLevel,
            font :'24px Comic Sans MS, cursive, sans-serif',
            fill : 'rgba(0, 0, 0, 1)',
            stroke : 'rgba(0, 0, 0, 1)',
            pos : {x : 0.45 * canvas.width, y : arena.yOffset/10 }
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

        for(var i = 0; i < currentLevel + 1; i++) {
            boulders.push(CarGame.Boulder({
                boulderImage: CarGame.images['images/Boulder.png'],
                width: 100,
                height: 100,
                direction: {x: 1, y: 0},
                speed: 200,
                position: {x: 250, y: 200},
                rotation: 0,
                rotationSpeed: 5,
                playHeight: arena.playHeight,
                playWidth: arena.playWidth,
                wallSize: arena.wallSize
            }));
        }
        for(var j = 0; j <  10 + (5 * (currentLevel - 1)); j++){
           timers.push(CarGame.Timer({
               lifeTime : 2,
               width : 24,
               position : {x : j * 24 + 5, y : canvas.height - (arena.yOffset * 0.4) + 5 },
               height : 24,
               image : CarGame.images['images/Clock.png']
           }));
        }
        for(var k = 0; k < boulders.length; k++){
            boulders[k].setPosition(arena.getNextWallPosition(boulders, boulders[k].radius, k));
            boulders[k].setDirection(function(){
                var dir = {};
                var sign = 1;
                if(Math.random() < .5)
                   sign *= -1;
                dir.x = Math.random() * sign;
                if(Math.random() < .5)
                    sign *= -1;
                dir.y = sign * Math.random();

                // Since we're using random numbers for our direction components and our direction
                // is a multiplier on our speed, we could get really slow or really fast boulder sometimes.
                // This next bit will even them out.
                while(dir.x + dir.y < 1) {
                    dir.x += .1;
                    dir.y += .1;
                }
                while(dir.x + dir.y > 1){
                    dir.x -= .1;
                    dir.y -= .1;
                }

                return dir;
            }());
        }
        lastTimeStamp = performance.now();
        // Register input
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, car.accelerate);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_S, car.brake);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, car.turnLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, car.turnRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_Y, restartGame);

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

        levelText.draw();
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
            obj1.position.x += obj1.direction.x * .1;
            obj1.position.y += obj1.direction.y * .1;
            obj2.position.x += obj2.direction.x * .1;
            obj2.position.y += obj2.direction.y * .1;
        }
    }

    /*
     * Function to restart our game.
     */
    function restartGame(){
        if(lost || win){
            currentLevel = 0;
            lastTimeStamp = performance.now();
            animationPlaying = true;
            startGame(performance.now());
        }
    }

    /*
     * Function to start our game with animation.
     */
    function startGame(time){
            initialize(currentLevel);
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
           if(collisionDetection.detectCollision(car, boulders[n])) {
               car.crash();
               lost = true;
               gameIsPlaying = false;
               askingToPlayAgain = true;
               elapsedTimeSinceStart = 0;
           }
        }
        car.update(elapsedTime);
        for(var i = 0; i < boulders.length; i++)
            boulders[i].update(elapsedTime);
        if(timers.length > 0) {
            timers[0].update(elapsedTime);
            if (timers[0].isExpired() === true) {
                timers.splice(0, 1);
                if(timers.length == 0) {
                    win = true;
                    if (currentLevel == 3)
                        askingToPlayAgain = true;
                }
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
        for (var i = 0; i < boulders.length; i++)
            boulders[i].draw();
    }

    /*
     * This is our gameLoop function!
     */
    function gameLoop(time) {
        var elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        elapsedTimeSinceStart += elapsedTime;
        myKeyboard.update(elapsedTime);
        update(elapsedTime);
            animationText = CarGame.text.Text({
                text: 3 - Math.round(elapsedTimeSinceStart / 1000),
                font: '48px Comic Sans MS, cursive, sans-serif',
                fill: 'rgba(0, 255, 0, 1)',
                stroke: 'rgba(0, 255, 0, 1)',
                pos: {x: canvas.width / 2 - 64, y: canvas.height / 2 + getReadyText.height}
            });
        render();

        requestAnimationFrame(gameLoop);
    }

    function run() {

    }
    return {
        initialize : startGame
    }


}());
