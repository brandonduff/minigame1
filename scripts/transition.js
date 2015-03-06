CarGame.screens['transition'] = (function() {

    var lastTimeStamp;
    var currentTime;
    var node;
    var timesup;

    function initialize(){
        node = document.getElementById('id-transitionCount');
    }

    function run() {
        lastTimeStamp = performance.now();
        currentTime = 0;
        timesup = false;
        requestAnimationFrame(timer);
    }

    function timer(time){
        var elapsedTime = time - lastTimeStamp;
        currentTime += elapsedTime;
        lastTimeStamp = time;
        node.innerHTML = 3 - Math.round(currentTime/1000);
        if(currentTime > 3000)
            timesup = true;
        if(timesup)
            CarGame.game.showScreen('game-play');

        if(!timesup)
            requestAnimationFrame(timer);

    }

    return {
        initialize : initialize,
        run : run
    }

}());