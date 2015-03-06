/*jslint browser: true, white: true */
// ------------------------------------------------------------------
//
// This is the game module.  Everything about the game is located in
// this object.
//
// ------------------------------------------------------------------
CarGame.persistence = (function() {
    'use strict';

    var minKey = (function () {
        var min = 10000000;
        var minkey = -1;
        for(var item = 0; item < localStorage.length; item++){
            var key = localStorage.key(item)
            if(localStorage[key] < min){
                minkey = key;
                min = localStorage[minkey];
            }
        }
        return minkey;
    });

    function add(key, value) {
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
        scores.sort(function(a, b){return b-a});
        for(var score = 0; score < scores.length; score++){
            node.innerHTML += (scores[score] + '<br/>');
        }
        localStorage.clear();
        for(item = 0; item < 3 && item < scores.length; item++){
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
