// Some of this code was adapted from Dean's font rendering example
CarGame.text = (function() {
    var canvas = document.getElementById('id-canvas'),
    context = canvas.getContext('2d');

    function Text(spec) {
	var that = {};

	////////////////////////////////////////////
	//
	// Return the height of the font in pixels
	//
	////////////////////////////////////////////
	function measureTextHeight(spec) {
	    context.save();

	    context.font = spec.font;
	    context.fillStyle = spec.fill;
	    context.strokeStyle = spec.stroke;

	    var height = context.measureText('m').width;

	    context.restore();

	    return height;
	}

	//////////////////////////////////////////////
	//
	// Return the width of the specified font
	//
	//////////////////////////////////////////////
	function measureTextWidth(spec) {
	    context.save();

	    context.font = spec.font;
	    context.fillStyle = spec.fill;
	    context.strokeStyle = spec.stroke;

	    var width = context.measureText(spec.text).width;

	    context.restore();

	    return width;
	}

	////////////////////////////////////
	//
	// Draw our text to the canvas
	//
	///////////////////////////////////
	that.draw = function() {
	    context.save();

	    context.font = spec.font;
	    context.fillStyle = spec.fill;
	    context.strokeStyle = spec.stroke;
	    context.textBaseline = 'top';

	    context.fillText(spec.text, spec.pos.x, spec.pos.y);
	    context.strokeText(spec.text, spec.pos.x, spec.pos.y);

	    context.restore();
	};

	that.height = measureTextHeight(spec);
	that.width = measureTextWidth(spec);
	that.pos = spec.pos;

	return that;
    }

    return {
	Text : Text
    };
}());
	

