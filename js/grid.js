var grid = {
       init:  drawGrid
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

function drawGrid(canvas) {
     var separationSize = 50.5;

     if(canvas.width < separationSize*5){
         separationSize = 20.5;
     }
     var gridOptions = {
        majorLines: {
            separation: separationSize,
             color: '#999'
          }
    };

     drawGridLines(canvas, gridOptions.majorLines);
    return;
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

    for (i =1; i <= iCount; i++) {
        if( i%2 ==0 ){

            x = (i * lineOptions.separation )- 0.5;


        } else {
            x = (i * lineOptions.separation);

        }
        ctx.moveTo(x, 0);
        ctx.lineTo(x, iHeight);
        ctx.stroke();

    }


    iCount = Math.floor(iHeight / lineOptions.separation);

    for (i = 1; i <= iCount; i++) {
        if(i%2) {
            y = (i * lineOptions.separation);
        }else {
            y = (i * lineOptions.separation) - 0.5;
        }
        ctx.moveTo(0.5, y);
        ctx.lineTo(iWidth, y);
        ctx.stroke();
    }

    ctx.closePath();
    return;
}


