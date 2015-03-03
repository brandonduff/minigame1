CarGame.carArena = function(spec) {
    var height, width, borderImage, wallSize = {}, playHeight, playWidth, yOffset;

    var canvas = document.getElementById("id-canvas"),
        context = canvas.getContext("2d"),
        collisionDetection = CarGame.collisionDetection;

    (function initialize(spec){
        height = spec.height - spec.yOffset;
        width = spec.width;
        borderImage = spec.borderImage;
        wallSize.width = width / 20;
        wallSize.height = height / 15 + spec.yOffset/2;
        playHeight = height - ((height/15)*2);
        playWidth = width - (wallSize.width*2);
        yOffset = spec.yOffset;
    }(spec));

    function draw(){
        context.drawImage(borderImage, 0, yOffset/2, width, height);
        context.fillStyle = "blue";
        context.fillRect(wallSize.width, wallSize.height, playWidth, playHeight);
    }

    /*
     * This will get us a random position on the wall for our boulders.
     */
    function getRandomWallPosition(radius){
        var wall = Math.floor((Math.random() * 4) + 1);
        var x = 0, y = 0;
        switch(wall) {
            case 1:
                y = wallSize.height + radius;
                x = Math.random() * width;
                break;
            case 2:
                x = playWidth + wallSize.width - radius;
                y = Math.random() * height;
                break;
            case 3:
                y = playHeight + wallSize.height - radius;
                x = Math.random() * width;
                break;
            case 4:
                x = wallSize.width + radius;
                y = Math.random() * height;
                break;
            default:
                x = -1;
                y = -1;
        }
        return {
            x : x,
            y : y
        }
     }

    /*
     * This will get a wall position for our boulders for random initialization
     */
    function getNextWallPosition(boulders, radius, index){
        var boulder = {};
        boulder.radius = radius;
        boulder.position = getRandomWallPosition(radius);
        for(var i = 0; i < index; i++){
            if(collisionDetection.detectCollision(boulders[i], boulder) === true){
                return getNextWallPosition(boulders, radius, index);
            }
        }
        return boulder.position;
    }


    return {
        draw : draw,
        playHeight : playHeight,
        playWidth : playWidth,
        width : width,
        height : height,
        wallSize : wallSize,
        yOffset : yOffset,
        getNextWallPosition : getNextWallPosition
    }
};