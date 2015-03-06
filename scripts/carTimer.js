CarGame.Timer = function(spec){
   var lifeTime, currentTime, expired,
       position = {}, width, height, image;

    (function initialize(spec){
        lifeTime = spec.lifeTime;
        currentTime = 0;
        expired = false;
        position = spec.position;
        width = spec.width;
        height = spec.height;
        image = spec.image;
    }(spec));

    function update(elapsedTime){
        currentTime += elapsedTime/1000;
        if(currentTime >= lifeTime)
            expired = true;
    }

    function isExpired(){
        return expired;
    }

    function draw(){
        var canvas = document.getElementById('id-canvas'),
            context = canvas.getContext('2d');

        context.drawImage(image, position.x, position.y, width, height);
    }

    return {
        update : update,
        isExpired : isExpired,
        draw : draw,
        center : { x: position.x + width/2, y : position.y + height/2}
    }
};