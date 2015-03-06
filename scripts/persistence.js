/*jslint browser: true, white: true */
// ------------------------------------------------------------------
//
// This is the game module.  Everything about the game is located in
// this object.
//
// ------------------------------------------------------------------
CarGame.persistence = (function() {
    'use strict';

    function add(key, value) {

        // Do some jiggering to only keep the top 3 values.
        // If we're trying to insert a fourth, find the smallest value and try to
        // replace instead.
        if(key == 3) {
            var min = 1000000;
            var minkey = -1;
            for (var i = 0; i < 3; i++) {
                if (localStorage.getItem(i) < min) {
                    min = localStorage.getItem(i);
                    minkey = i;
                }
            }
            if(value > min)
                localStorage.setItem(minkey, value);

        }
        else
            localStorage[key] = value;
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    function report() {
        var node = document.getElementById('scoreSpace'),
            item,
            key;

        node.innerHTML = '';
        var scores = [];
        for (item = 0; item < localStorage.length; item++) {
            key = localStorage.key(item);
            scores[item] = localStorage[key];
        }
        // Get our scores sorted without trying to move around localStorage
        scores.sort(function(a, b){return b-a});
        for(item = 0; item < 3 && item < scores.length; item++){
            node.innerHTML += (scores[item] + '<br/>');
            add(item, scores[item]);
        }
        node.scrollTop = node.scrollHeight;
    }

    return {
        add : add,
        remove : remove,
        report : report
    };
}());
