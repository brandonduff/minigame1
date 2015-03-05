CarGame.screens['lost'] = (function() {
    'use strict';

    function initialize() {
        document.getElementById('id-lost-yes').addEventListener(
            'click',
            function () {
                CarGame.screens['game-play'].restartGame();
                CarGame.game.showScreen('game-play');
            }, false);
     document.getElementById('id-lost-no').addEventListener(
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