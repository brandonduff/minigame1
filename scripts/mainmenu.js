/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
CarGame.screens['main-menu'] = (function() {
    'use strict';

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() { CarGame.game.showScreen('transition'); },
            false);

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() {
                CarGame.persistence.report();
                CarGame.game.showScreen('high-scores');
            },
            false);

        document.getElementById('id-help').addEventListener(
            'click',
            function() { CarGame.game.showScreen('help'); },
            false);

        document.getElementById('id-about').addEventListener(
            'click',
            function() { CarGame.game.showScreen('about'); },
            false);
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize : initialize,
        run : run
    };
}());