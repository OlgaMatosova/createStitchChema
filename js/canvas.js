var imageObj = {
        canvasId: '',
        init: initCanvas, /* init canvas */
        makePixelezation: makePixelezation, /* create schema */
        saveImage: saveImage, /* save image */
        createPallete: createPallete,
        canvas: getCanvas,
        context: getContext
};

function getCanvas(canvasId) {
     return document.getElementById(canvasId);
}

function getContext(canvas) {
     return canvas.getContext('2d');
}

function initCanvas (idCanvas) {
    this.canvasId = idCanvas;
    var imageLoader = document.getElementById('imageLoader'),
        canvas = this.canvas(this.canvasId),
        ctx = this.context(canvas),
        src;
           
    imageLoader.addEventListener('change', handleImage, false);

    function handleImage (e) {

        var reader = new FileReader();

        reader.onload = function (event) {
            var img = new Image();

            img.onload = function () {
                canvas.width = img.width + 80;
                canvas.height = img.height + 80;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 40, 40);
            }

            img.src = event.target.result;
            imageObj.src = event.target.result;
        }

        reader.readAsDataURL(e.target.files[0]);
   }
}


function makePixelezation (pixelRatio) {

    var pixelation,
        canvas = this.canvas(this.canvasId),
        ctx = this.context(canvas),
        imageObj = new Image();
       
    if (pixelRatio == undefined) {
        pixelation = 10;
    } else {
        pixelation = pixelRatio;
    }

    imageObj.onload = function () {

        var sourceWidth = imageObj.width,
            sourceHeight = imageObj.height,
            destX = canvas.width / 2 - sourceWidth / 2,
            destY = canvas.height / 2 - sourceHeight / 2;

        ctx.drawImage(imageObj, destX, destY);

        if (pixelation < 1) {
            clearInterval(intervalId);
        } else {
            focusImage(ctx, this, sourceWidth, sourceHeight, destX, destY);
        }
        grid.init(canvas);
    },

    imageObj.src = this.src;

    function focusImage (ctx, imageObj, sourceWidth, sourceHeight, destX, destY) {
        var sourceX = destX,
            sourceY = destY,
            imageData = ctx.getImageData(sourceX, sourceY, sourceWidth, sourceHeight),
            data = imageData.data;
        var colors = [];

         getColors(sourceWidth, sourceHeight,pixelation, colors, data );
       
  
         console.log(colors);
            // overwrite original image
            ctx.putImageData(imageData, destX, destY);
            pixelation -= 1;
        
    }
    return imageObj;
}

function saveImage (link, filename) {

    var canvas = this.canvas(this.canvasId);
    var ctx = this.context(canvas);

    link.href = canvas.toDataURL();
    link.download = filename;
}

function searchForArray(arrayOfArrays, array){
   
    var aOA = arrayOfArrays.map(function(arr) {
         return arr.slice();
     });

     var a = array.slice(0);

     for(var i=0; i<aOA.length; i++){
        if(aOA[i].sort().join(',') === a.sort().join(',')){
         return false;
       }
     }
     return true;
}

function find(array, value) {
    return array.indexOf(value) > -1;
}

function comparison(val1, array) {
    for (var i = 0; i <= array.length; i++){

    }
}

function getColors(sourceWidth, sourceHeight, pixelation, colors, data) {

    var red, blue, green;
        for (var y = 0; y < sourceHeight; y += pixelation) {

            for (var x = 0; x < sourceWidth; x += pixelation) {
                red = data[((sourceWidth * y) + x)];
                blue = data[((sourceWidth * y) + x + 1)];
                green = data[((sourceWidth * y) + x + 2)];

                var pix = rgbToHex(red, blue, green);

                if(!find(colors, pix)){
                    colors.push(pix);
                }
//
//                red = data[((sourceWidth * y) + x) * 4],
//                    green = data[((sourceWidth * y) + x) * 4 + 1],
//                    blue = data[((sourceWidth * y) + x) * 4 + 2];
//
//                    var temp_v =[];
//                    temp_v.push(red,green,blue);
//
//                    if(searchForArray(colors,temp_v)){
//                         colors.push(temp_v);
//                    }
//                   var b = data[(( sourceWidth * (y + n)) + (x + m)) * 4 + 2] - blue;
//                   var r = data[(( sourceWidth * (y + n)) + (x + m)) * 4 ] - red;
//                   var g = data[(( sourceWidth * (y + n)) + (x + m)) * 4 + 1] - green;
//                for (var n = 0; n < pixelation; n++) {
//                    for (var m = 0; m < pixelation; m++) {
//
//
//
//                        if( !(-10 < b && b < 10) && !(-10 < r && r < 10) && !(-10 < g && g < 10) ){
//
//
//                        if (x + m < sourceWidth) {
//
//                            data[((sourceWidth * (y + n)) + (x + m)) * 4] = red;
//                            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green;
//                            data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue;
//                        }
//                    }
//                }
//
//                }
            }
        }
        }


