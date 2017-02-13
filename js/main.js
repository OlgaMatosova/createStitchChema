"use strict";
var imageObj = {
   
    init: function(idCanvas){
        var imageLoader = document.getElementById('imageLoader');
        imageLoader.addEventListener('change', handleImage, false);

        var canvas = document.getElementById(idCanvas);
        var ctx = canvas.getContext('2d');
        var src = 'd';
        function handleImage(e){
            
            var reader = new FileReader();
         
            reader.onload = function(event){
                var img = new Image();
              
                img.onload = function(){
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img,0,0);
                }
          
                img.src = event.target.result;
               
                imageObj.src = event.target.result;
                
            }
            
            reader.readAsDataURL(e.target.files[0]);    
        }
      
      
    },
    makePixelezation: function(pixelRatio){
        var pixelation;
        
       if(pixelRatio == undefined){
          pixelation = 7;
       }else {
           pixelation = pixelRatio
       }

        function focusImage(context, imageObj, sourceWidth, sourceHeight, destX, destY) {
        var sourceX = destX;
        var sourceY = destY;

        var imageData = context.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
		
        var data = imageData.data;

        for(var y = 0; y < sourceHeight; y += pixelation) {
          for(var x = 0; x < sourceWidth; x += pixelation) {
            var red = data[((sourceWidth * y) + x) * 4];
            var green = data[((sourceWidth * y) + x) * 4 + 1];
            var blue = data[((sourceWidth * y) + x) * 4 + 2];

            for(var n = 0; n < pixelation; n++) {
              for(var m = 0; m < pixelation; m++) {
                if(x + m < sourceWidth) {
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
     
   
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');

      var imageObj = new Image();

      imageObj.onload = function() {
        var sourceWidth = imageObj.width;
        var sourceHeight = imageObj.height;
        var destX = canvas.width / 2 - sourceWidth / 2;
        var destY = canvas.height / 2 - sourceHeight / 2;
		context.drawImage(imageObj, destX, destY);

          if(pixelation < 1) {
            clearInterval(intervalId);
          }
          else {
            focusImage(context, imageObj, sourceWidth, sourceHeight, destX, destY);
          }

        },

      imageObj.src = this.src;
 
    }
};


imageObj.init('myCanvas');

$('#makePixel').on('click', function(){
    imageObj.makePixelezation();
});
