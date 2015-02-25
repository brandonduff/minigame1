/*
 * This is where we will define our boulder object!
 */

CarGame.Boulder = function (spec) {
    var boulderImage,
        width,
        height,
        radius,
        direction,
        speed,
        position = {},
        rotation,
        rotationSpeed,
        playWidth,
        playHeight,
        wallSize,
        canvas = document.getElementById('id-canvas'),
        context = canvas.getContext('2d');

    (function initialize(spec){
        boulderImage = spec.boulderImage;
        width = spec.width;
        height = spec.height;
        radius = height/2;
        direction = spec.direction;
        speed = spec.speed;
        position = spec.position;
        rotation = spec.rotation;
        rotationSpeed = spec.rotationSpeed;
        playWidth = spec.playWidth;
        playHeight = spec.playHeight;
        wallSize = spec.wallSize;
    }(spec));

    function update(elapsedTime) {
        position.x += speed * elapsedTime * Math.cos(direction);
        position.y += speed * elapsedTime * Math.sin(direction);
        rotation += rotationSpeed * elapsedTime;

        // Collision detection?
        detectWallCollision();
    }

    function detectWallCollision(){
        while(direction > 2 * Math.PI){
            direction -= 2 * Math.PI;
        }
        while(direction < 0){
            direction += Math.PI * 2;
        }
        if(position.x > playWidth + wallSize.width - radius){
            position.x -= 1;
            if(direction < Math.PI / 2)
                direction += Math.PI/2;
            else
                direction -= Math.PI/2;
        }
        if(position.x < wallSize.width + radius) {
            position.x += 1;
            if(direction <= Math.PI)
                direction -= Math.PI/2;
            else
                direction += Math.PI/2;
        }
        if(position.y > playHeight + wallSize.height - radius) {
            position.y -= 1;
            if(direction < Math.PI/2)
                direction -= Math.PI/2;
            else
                direction += Math.PI/2;
        }
        if(position.y < wallSize.height + radius) {
            position.y += 1;
            if(direction >= (3 *Math.PI)/2)
                direction += Math.PI/2;
            else
                direction -= Math.PI/2;
        }
    }

    function draw() {
        context.save();

        context.translate(position.x, position.y);
        context.rotate(rotation);
        context.translate(-position.x, -position.y);

        context.drawImage(boulderImage, position.x - width / 2, position.y - height / 2, width, height);
        context.restore();
    }

    return {
        radius : radius,
        direction : direction,
        speed : speed,
        position : position,
        update : update,
        draw : draw
    }
};