CarGame.screens['won'] = (function() {
    'use strict';

    function initialize() {
        document.getElementById('id-won-yes').addEventListener(
            'click',
            function () {
                CarGame.screens['game-play'].restartGame();
                CarGame.game.showScreen('transition');
            }, false);
        document.getElementById('id-won-no').addEventListener(
            'click',
            function () {
                CarGame.game.showScreen('main-menu');
            }, false);
    }
    function run() {

    }

    return {
        initialize : initialize,
        run : run
    }

}());