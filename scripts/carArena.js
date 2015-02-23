CarGame.carArena = function(spec) {
    var size;
    var borderImage;
    var wallSize = {};
    var playSize;
    var canvas = document.getElementById("id-canvas"),
        context = canvas.getContext("2d");

    (function initialize(spec){
        size = spec.size;
        borderImage = spec.borderImage;
        wallSize.width = size / 10;
        wallSize.height = size;
        playSize = size - (wallSize.width*2);
    }(spec));

    function draw(){
        context.drawImage(borderImage, 0, 0, size, size);
        context.fillStyle = "blue";
        context.fillRect(wallSize.width, wallSize.width, playSize, playSize);

        /*
        context.drawImage(borderImage, 0, 0, wallSize.width, wallSize.height);
        context.drawImage(borderImage, 0, 0, wallSize.height, wallSize.width);
        context.drawImage(borderImage, 0, size - wallSize.width, wallSize.height, wallSize.width);
        context.drawImage(borderImage, size - wallSize.width, 0, wallSize.width, wallSize.height);
        */
    }

    return {
        draw : draw,
        playSize : playSize,
        size : size
    }
};