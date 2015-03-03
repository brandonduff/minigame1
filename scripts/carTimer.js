CarGame.Timer = (function(spec){
   var lifeTime, currentTime, isExpired;

    (function initialize(spec){
        lifeTime = spec.lifeTime;
        currentTime = 0;
        isExpired = true;
    })(spec);

    function update(elapsedTime){
        currentTime += elapsedTime;
        if(currentTime >= initialTime)
            isExpired = true;
    }

    return {
        update : update,
        isExpired : isExpired
    }
})();