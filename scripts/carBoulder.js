/*
 * This is where we will define our boulder object!
 * We used x and y components for direction rather than an angle.
 * This makes it easier to compute elastic collision with other boulders.
 */
CarGame.Boulder = function (spec) {
    var boulderImage,
        width,
        height,
        radius,
        direction = {},
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
        position.x += speed * elapsedTime * direction.x;
        position.y += speed * elapsedTime * direction.y;
        rotation += rotationSpeed * elapsedTime;

        detectWallCollision();
    }

    /*
     * Called by our collision detection function for other boulders
     */
    function setDirection(newDir){
        direction = newDir;
    }

    /*
     * Called in setting the initial position of our boulders
     */
    function setPosition(newPos){
        position.x = newPos.x;
        position.y = newPos.y;
    }

    /*
     * Handle collision between this particular and a wall.
     */
    function detectWallCollision(){
        if(position.x > playWidth + wallSize.width - radius){
            position.x -= 1;
            direction.x *= -1;
        }
        if(position.x < wallSize.width + radius) {
            position.x += 1;
            direction.x *= -1;
        }
        if(position.y > playHeight + wallSize.height - radius) {
            position.y -= 1;
            direction.y *= -1;
        }
        if(position.y < wallSize.height + radius) {
            position.y += 1;
            direction.y *= -1;
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
        speed : speed,
        position : position,
        update : update,
        draw : draw,
        setDirection : setDirection,
        direction : direction,
        setPosition : setPosition
    }
};