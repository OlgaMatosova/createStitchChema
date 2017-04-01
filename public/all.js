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



	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = 800;
    canvas.height = 600;

	var gkhead = new Image;

	window.onload = function(){

		    var ctx = canvas.getContext('2d');
		    trackTransforms(ctx);

    function redraw(){

          // Clear the entire canvas
          var p1 = ctx.transformedPoint(0,0);
          var p2 = ctx.transformedPoint(canvas.width,canvas.height);
          ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

          ctx.save();
          ctx.setTransform(1,0,0,1,0,0);
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.restore();

          ctx.drawImage(gkhead,0,0);

        }
        redraw();

      var lastX=canvas.width/2, lastY=canvas.height/2;

      var dragStart,dragged;

      canvas.addEventListener('mousedown',function(evt){
          document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
          lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
          lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
          dragStart = ctx.transformedPoint(lastX,lastY);
          dragged = false;
      },false);

      canvas.addEventListener('mousemove',function(evt){
          lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
          lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
          dragged = true;
          if (dragStart){
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
                }
      },false);

      canvas.addEventListener('mouseup',function(evt){
          dragStart = null;
          if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
      },false);

      var scaleFactor = 1.1;

      var zoom = function(clicks){
          var pt = ctx.transformedPoint(lastX,lastY);
          ctx.translate(pt.x,pt.y);
          var factor = Math.pow(scaleFactor,clicks);
          ctx.scale(factor,factor);
          ctx.translate(-pt.x,-pt.y);
          redraw();
      }

      var handleScroll = function(evt){
          var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
          if (delta) zoom(delta);
          return evt.preventDefault() && false;
      };

      canvas.addEventListener('DOMMouseScroll',handleScroll,false);
      canvas.addEventListener('mousewheel',handleScroll,false);
	};

	gkhead.src = 'http://phrogz.net/tmp/gkhead.jpg';

	// Adds ctx.getTransform() - returns an SVGMatrix
	// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
	function trackTransforms(ctx){
      var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
      var xform = svg.createSVGMatrix();
      ctx.getTransform = function(){ return xform; };

      var savedTransforms = [];
      var save = ctx.save;
      ctx.save = function(){
          savedTransforms.push(xform.translate(0,0));
          return save.call(ctx);
      };

      var restore = ctx.restore;
      ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
		      };

      var scale = ctx.scale;
      ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
		      };

      var rotate = ctx.rotate;
      ctx.rotate = function(radians){
          xform = xform.rotate(radians*180/Math.PI);
          return rotate.call(ctx,radians);
      };

      var translate = ctx.translate;
      ctx.translate = function(dx,dy){
          xform = xform.translate(dx,dy);
          return translate.call(ctx,dx,dy);
      };

      var transform = ctx.transform;
      ctx.transform = function(a,b,c,d,e,f){
          var m2 = svg.createSVGMatrix();
          m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
          xform = xform.multiply(m2);
          return transform.call(ctx,a,b,c,d,e,f);
      };

      var setTransform = ctx.setTransform;
      ctx.setTransform = function(a,b,c,d,e,f){
          xform.a = a;
          xform.b = b;
          xform.c = c;
          xform.d = d;
          xform.e = e;
          xform.f = f;
          return setTransform.call(ctx,a,b,c,d,e,f);
      };

      var pt  = svg.createSVGPoint();
      ctx.transformedPoint = function(x,y){
          pt.x=x; pt.y=y;
          return pt.matrixTransform(xform.inverse());
      }
	}