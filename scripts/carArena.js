CarGame.carArena = function(spec) {
    var height, width, borderImage, wallSize = {}, playHeight, playWidth;

    var canvas = document.getElementById("id-canvas"),
        context = canvas.getContext("2d");

    (function initialize(spec){
        height = spec.height;
        width = spec.width;
        borderImage = spec.borderImage;
        wallSize.width = width / 20;
        wallSize.height = height / 15;
        playHeight = height - (wallSize.height*2);
        playWidth = width - (wallSize.width*2);
    }(spec));

    function draw(){
        context.drawImage(borderImage, 0, 0, width, height);
        context.fillStyle = "blue";
        context.fillRect(wallSize.width, wallSize.height, playWidth, playHeight);
    }

    return {
        draw : draw,
        playHeight : playHeight,
        playWidth : playWidth,
        width : width,
        height : height,
        wallSize : wallSize
    }
};