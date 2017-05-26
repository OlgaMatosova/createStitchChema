"use strict";

$(document).ready(function() {
    var image;
    imageObj.init('myCanvas');

    $('#makePixel').on('click', function () {
      image = imageObj.makePixelezation(4);
    });

    $('#downloadLnk').on('click', function() {
        var filename = randomString(10, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
        imageObj.saveImage(this, filename + '.png');
    });

    $('.getPallete').on('click', function(){
       createPallete(image);
    });
});

function createPallete(image) {
    $("#pallete").empty();
    var colorThief = new ColorThief();

   var items = colorThief.getPalette(image);

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
