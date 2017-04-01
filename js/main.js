"use strict";

var imageObj = {
    init: initCanvas,
    makePixelezation: makePixelezation,
    saveImage: saveImage
};


imageObj.init('myCanvas');

$('#makePixel').on('click', function () {
    imageObj.makePixelezation();
});

function initCanvas (idCanvas) {
    var imageLoader = document.getElementById('imageLoader'),
        canvas = document.getElementById(idCanvas);
        imageLoader.addEventListener('change', handleImage, false);

    var ctx = canvas.getContext('2d'),
        src;

    function handleImage (e) {

        var reader = new FileReader();

        reader.onload = function (event) {
            var img = new Image();

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }

            img.src = event.target.result;
            imageObj.src = event.target.result;
        }

        reader.readAsDataURL(e.target.files[0]);
    }
}

function makePixelezation (pixelRatio) {
    var pixelation;

    if (pixelRatio == undefined) {
        pixelation = 7;
    } else {
        pixelation = pixelRatio;
    }

    function focusImage (context, imageObj, sourceWidth, sourceHeight, destX, destY) {
        var sourceX = destX,
            sourceY = destY,
            imageData = context.getImageData(sourceX, sourceY, sourceWidth, sourceHeight),
            data = imageData.data;

        for (var y = 0; y < sourceHeight; y += pixelation) {
            for (var x = 0; x < sourceWidth; x += pixelation) {

                var red = data[((sourceWidth * y) + x) * 4],
                    green = data[((sourceWidth * y) + x) * 4 + 1],
                    blue = data[((sourceWidth * y) + x) * 4 + 2];

                for (var n = 0; n < pixelation; n++) {
                    for (var m = 0; m < pixelation; m++) {
                        if (x + m < sourceWidth) {
                            data[((sourceWidth * (y + n)) + (x + m)) * 4] = red;
                            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green;
                            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue;
                        }
                    }
                }
            }
        }

            // overwrite original image
        context.putImageData(imageData, destX, destY);
        pixelation -= 1;
    }


    var canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),
        imageObj = new Image();

    imageObj.onload = function () {

        var sourceWidth = imageObj.width,
            sourceHeight = imageObj.height,
            destX = canvas.width / 2 - sourceWidth / 2,
            destY = canvas.height / 2 - sourceHeight / 2;

        context.drawImage(imageObj, destX, destY);

        if (pixelation < 1) {
            clearInterval(intervalId);
        } else {
            focusImage(context, imageObj, sourceWidth, sourceHeight, destX, destY);
        }
    },

    imageObj.src = this.src;
}

function saveImage (link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}


$('#downloadLnk').on('click', function() {
    imageObj.saveImage(this, 'myCanvas', 'test.png');
});