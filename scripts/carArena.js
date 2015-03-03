CarGame.carArena = function(spec) {
    var height, width, borderImage, wallSize = {}, playHeight, playWidth, yOffset;

    var canvas = document.getElementById("id-canvas"),
        context = canvas.getContext("2d");

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

    return {
        draw : draw,
        playHeight : playHeight,
        playWidth : playWidth,
        width : width,
        height : height,
        wallSize : wallSize,
        yOffset : yOffset
    }
};