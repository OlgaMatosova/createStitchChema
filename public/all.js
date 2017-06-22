var imageObj = {
    canvasId: '',
    init: initCanvas, /* init canvas */
    makePixelezation: makePixelezation, /* create schema */
    saveImage: saveImage, /* save image */
   
    context: getContext
};

function getCanvas() {
    return document.getElementById(this.canvasId);
}

function getContext(canvas) {
    return canvas.getContext('2d');
}

function initCanvas(idCanvas) {
    var scope = this;
    scope.canvasId = idCanvas;

    var imageLoader = document.getElementById('imageLoader');
    scope.canvas = document.getElementById(scope.canvasId);
    scope.ctx = scope.canvas.getContext('2d');

    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {

        var reader = new FileReader();

        reader.onload = function (event) {
            var img = new Image();

            img.onload = function () {
                scope.canvas.width = img.width + 80;
                scope.canvas.height = img.height + 80;
                scope.ctx.fillStyle = "white";
                scope.ctx.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
                scope.ctx.drawImage(img, 40, 40);
            }

            img.src = event.target.result;
            scope.src = event.target.result;
        }

        reader.readAsDataURL(e.target.files[0]);
    }
}


function makePixelezation() {
    var scope = this;
    var imageProcessed = new Image();

    imageProcessed.onload = function () {
        var sourceWidth = imageProcessed.width,
            sourceHeight = imageProcessed.height,
            destX = scope.canvas.width / 2 - sourceWidth / 2,
            destY = scope.canvas.height / 2 - sourceHeight / 2;

        scope.ctx.drawImage(imageProcessed, destX, destY);

        focusImage(this, sourceWidth, sourceHeight, destX, destY);

        var grid = new DrawGrid(scope.canvas)
    },
    imageProcessed.src = scope.src;

    function focusImage(image, sourceWidth, sourceHeight, destX, destY) {
        var imageData = scope.ctx.getImageData(destX, destY, sourceWidth, sourceHeight);
        image.colors = [];
        var pixSize = 5;
        var colorDiff = 3;
        if (sourceWidth < 200) {
            pixSize = 2;
            colorDiff = 7;
        }

        var params = {
            data: imageData.data,
            pixelation: pixSize,
            sourceWidth: sourceWidth,
            sourceHeight: sourceHeight,
            colors: image.colors,
            colorDiff: colorDiff
        }

        image.colors = getColors(params);

        scope.ctx.putImageData(imageData, destX, destY);
        params.pixelation -= 1;
    }

    return imageProcessed;
}

function saveImage(link, filename) {

    link.href = this.canvas.toDataURL();
    link.download = filename;
}


function getColors(params) {

    var tempV = [];
    var r,
        g,
        b,
        xyz,
        lab,
        rgb,
        temp;

    for (var y = 0; y < params.sourceHeight; y += params.pixelation) {
        for (var x = 0; x < params.sourceWidth; x += params.pixelation) {
            r = params.data[((params.sourceWidth * y) + x) * 4],
            g = params.data[((params.sourceWidth * y) + x) * 4 + 1],
            b = params.data[((params.sourceWidth * y) + x) * 4 + 2];

            for (var n = 0; n < params.pixelation; n++) {
                for (var m = 0; m < params.pixelation; m++) {
                    if (x + m < params.sourceWidth) {
                        params.data[((params.sourceWidth * (y + n)) + (x + m)) * 4] = r;
                        params.data[((params.sourceWidth * (y + n)) + (x + m)) * 4 + 1] = g;
                        params.data[((params.sourceWidth * (y + n)) + (x + m)) * 4 + 2] = b;
                    }
                }
            }
        }
    }
    for (y = 0; y < params.sourceHeight * 4; y += 4) {
        for (x = 0; x < params.sourceWidth * 4; x += 4) {
            r = params.data[((params.sourceWidth * y) + x)];
            g = params.data[((params.sourceWidth * y) + x + 1)];
            b = params.data[((params.sourceWidth * y) + x + 2)];

            xyz = rgbToXyz(r, g, b);
            lab = xyzToLab(xyz[0], xyz[1], xyz[2]);

            if (!(temp = findSimilar(params.colors, lab, params.colorDiff))) {
                tempV.push([r, g, b]);
                params.colors.push(lab);
            } else {
                if (temp !== true) {
                    lab = temp;
                    xyz = labtoxyz(lab[0], lab[1], lab[2]);
                    rgb = xyztorgb(xyz[0], xyz[1], xyz[2]);

                    params.data[((params.sourceWidth * y) + x)] = rgb[0];
                    params.data[((params.sourceWidth * y) + x + 1)] = rgb[1];
                    params.data[((params.sourceWidth * y) + x + 2)] = rgb[2];

                }
            }
        }
    }
    return tempV;
}


function findSimilar(array, value, size) {

    var a = value.slice();
    var aOA = array.map(function (arr) {
        return arr.slice();
    });

    for (var i = 0; i < aOA.length; i++) {
        if (aOA[i].sort().join(',') === a.sort().join(',')) {
            var diff = cie1994(a, aOA[i], false);
            return true;
        } else {
            var diff = cie1994(a, aOA[i], false);
            if (diff < 6) {
                return value = array[i];
            }
        }
    }
    return false;
}

function rgbToXyz(r, g, b) {
    var _r = (r / 255);
    var _g = (g / 255);
    var _b = (b / 255);

    if (_r > 0.04045) {
        _r = Math.pow(((_r + 0.055) / 1.055), 2.4);
    } else {
        _r = _r / 12.92;
    }

    if (_g > 0.04045) {
        _g = Math.pow(((_g + 0.055) / 1.055), 2.4);
    } else {
        _g = _g / 12.92;
    }

    if (_b > 0.04045) {
        _b = Math.pow(((_b + 0.055) / 1.055), 2.4);
    } else {
        _b = _b / 12.92;
    }

    _r = _r * 100;
    _g = _g * 100;
    _b = _b * 100;

    var X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
    var Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
    var Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

    return [X, Y, Z];
}
;
function xyztorgb(x, y, z) {

    var _r = x * 3.2404 + y * (-1.5371) + z * (-0.4985);
    var _g = x * (-0.9692) + y * 1.8760 + z * 0.04155;
    var _b = x * 0.0556 + y * (-0.2040) + z * (1.0572);

    _r = _r / 100;
    _g = _g / 100;
    _b = _b / 100;

    if (_r > 0.0031308) {
        _r = Math.pow(_r, 0.416666665) * 1.055 - 0.055;
    } else {
        _r = _r / 12.92;
    }

    if (_g > 0.0031308) {
        _g = Math.pow(_g, 0.416666665) * 1.055 - 0.055;
    } else {
        _g = _g / 12.92;
    }

    if (_b > 0.0031308) {
        _b = Math.pow(_b, 0.416666665) * 1.055 - 0.055;
    } else {
        _b = _b / 12.92;
    }

    var r = parseFloat((_r * 255).toFixed(0));
    var g = parseFloat((_g * 255).toFixed(0));
    var b = parseFloat((_b * 255).toFixed(0));

    return [r, g, b];
};

function xyzToLab(x, y, z) {
    var ref_X = 95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;
    var _X = x / ref_X;
    var _Y = y / ref_Y;
    var _Z = z / ref_Z;

    if (_X > 0.008856) {
        _X = Math.pow(_X, (1 / 3));
    } else {
        _X = (7.787 * _X) + (16 / 116);
    }

    if (_Y > 0.008856) {
        _Y = Math.pow(_Y, (1 / 3));
    } else {
        _Y = (7.787 * _Y) + (16 / 116);
    }

    if (_Z > 0.008856) {
        _Z = Math.pow(_Z, (1 / 3));
    } else {
        _Z = (7.787 * _Z) + (16 / 116);
    }

    var CIE_L = (116 * _Y) - 16;
    var CIE_a = 500 * (_X - _Y);
    var CIE_b = 200 * (_Y - _Z);

    return [CIE_L, CIE_a, CIE_b];
};

function labtoxyz(CIE_L, CIE_a, CIE_b) {
    var ref_X = 95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    var _Y = (CIE_L + 16) / 116;
    var _X = CIE_a / 500 + _Y;
    var _Z = _Y - CIE_b / 200;

    if (_X > 0.20689303442296383) {
        _X = Math.pow(_X, 3);
    } else {
        _X = (_X - (16 / 116)) / 7.787;
    }

    if (_Y > 0.20689303442296383) {
        _Y = Math.pow(_Y, 3);
    } else {
        _Y = (_Y - (16 / 116)) / 7.787;
    }

    if (_Z > 0.20689303442296383) {
        _Z = Math.pow(_Z, 3);
    } else {
        _Z = (_Z - (16 / 116)) / 7.787;
    }

    var x = ref_X * _X;
    var y = ref_Y * _Y;
    var z = ref_Z * _Z;

    return [x, y, z];
};

function cie1994(x, y, isTextiles) {

    var x = {l: x[0], a: x[1], b: x[2]};
    var y = {l: y[0], a: y[1], b: y[2]};
    var labx = x;
    var laby = y;
    var k2;
    var k1;
    var kl;
    var kh = 1;
    var kc = 1;

    if (isTextiles) {
        k2 = 0.014;
        k1 = 0.048;
        kl = 2;
    } else {
        k2 = 0.015;
        k1 = 0.045;
        kl = 1;
    }

    var c1 = Math.sqrt(x.a * x.a + x.b * x.b);
    var c2 = Math.sqrt(y.a * y.a + y.b * y.b);
    var sh = 1 + k2 * c1;
    var sc = 1 + k1 * c1;
    var sl = 1;
    var da = x.a - y.a;
    var db = x.b - y.b;
    var dc = c1 - c2;
    var dl = x.l - y.l;
    var dh = Math.sqrt(da * da + db * db - dc * dc);

    return Math.sqrt(Math.pow((dl / (kl * sl)), 2) + Math.pow((dc / (kc * sc)), 2) + Math.pow((dh / (kh * sh)), 2));
};

function DrawGrid(canvas) {
     var separationSize = 50.5;

     if(canvas.width < separationSize*5){
         separationSize = 20.5;
     }
     this.gridOptions = {
        lines: {
            separation: separationSize,
            color: '#999'
        }
    };

    drawGridLines(canvas, this.gridOptions.lines);
}

function drawGridLines(canvas, lineOptions) {
    var iWidth = canvas.width;
    var iHeight = canvas.height;
    var ctx = canvas.getContext('2d');

    ctx.strokeStyle = lineOptions.color;
    ctx.strokeWidth = 1;
    ctx.beginPath();

    var iCount = null;
    var i = null;
    var x = null;
    var y = null;

    iCount = Math.floor(iWidth / lineOptions.separation);

    for (i = 1; i <= iCount; i++) {
        x = (i * lineOptions.separation);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, iHeight);
        ctx.stroke();
    }
    iCount = Math.floor(iHeight / lineOptions.separation);
    for (i = 1.5; i <= iCount; i++) {
        y = (i * lineOptions.separation);
        ctx.moveTo(0, y);
        ctx.lineTo(iWidth, y);
        ctx.stroke();
    }
    ctx.closePath();
    return;
}

"use strict";

$(document).ready(function() {
    var image;

    imageObj.init('myCanvas');

    $('#makePixel').on('click', function () {
      image = imageObj.makePixelezation();
    });

    $('#downloadLnk').on('click', function() {
        var filename = randomString(10, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
        imageObj.saveImage(this, filename + '.png');
    });

    $('.getPallete').on('click', function(){
       createPallete(image.colors);
    });
});

function createPallete(image) {
    $("#pallete").empty();

   var items = image;

    items.map(function(item) {
        var liText = rgbToHex(item[0], item[1], item[2]);
        $('#pallete').append($('<li>').text(liText).append($('<span>').css('background-color', liText)));
    });
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
