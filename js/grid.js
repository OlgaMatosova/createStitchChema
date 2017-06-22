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
