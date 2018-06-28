
function Glitchy($img, $panel, src){
    var self = this;
    this.$panel = $panel;
    this.$img = $img;
    // image URL to use on card + glitch effect
    this.imageCardURL = src;

    // animation settings
    this.useRAF = true; // use requestAnimFrame for updater? steroids mode!
    this.updateDelay = 100; // if RAF true, this will be ignored
    this.maxErrors = 100; // max image glitch errors

    // image corruptor settings
    this.imgPrefix = "data:image/jpeg;base64,";
    this.imageData = null;
    this.updateTimer = null;
    var _init = function() {
        // load image and convert
        self.loadImage();
    };
    _init();

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function ( callback ) {
                window.setTimeout( callback, 16.6 ); // up to 60 FPS (1000/60)
            };
    })();

    window.cancelRequestAnimFrame = ( function() {
        return window.cancelAnimationFrame          ||
            window.webkitCancelRequestAnimationFrame    ||
            window.mozCancelRequestAnimationFrame       ||
            window.oCancelRequestAnimationFrame     ||
            window.msCancelRequestAnimationFrame        ||
            clearTimeout
    } )();
}

Glitchy.prototype.startEffect = function(){
    var self = this;
    if (this.useRAF) {
       this.update();
    } else {
        this.updateTimer = setInterval(function() {
           self.update();
        }, this.updateDelay);
    }
};

Glitchy.prototype.stopEffect = function() {
    if (this.useRAF) {
        cancelRequestAnimFrame(this.updateTimer);
    } else {
        clearInterval(this.updateTimer);
    }
    this.updateTimer = null;
    this.restoreImage();
};

Glitchy.prototype.loadImage  = function() {
    var imageUrl = this.imageCardURL;
    var self = this;
    var imageFormat = 'image/jpeg';
    var imageQuality = 0.8;

    this.convertImgToBase64(imageUrl, function(base64img) {
        // set panel bg
        self.$panel.css('background-image', 'url(' + base64img + ')');

        // store image encoded data
        self.imageData = base64img.replace(self.imgPrefix, '');
    }, imageFormat, imageQuality);
};

Glitchy.prototype.update = function(){
    // request another frame?
    if (this.useRAF) { this.updateTimer = requestAnimFrame(this.update.bind(this)); }
    var corrupted = this.imageData;
    if (Math.random() > 0.8) {
        var errors = Math.round(Math.random() * this.maxErrors);

        for(var i = 0; i < errors; i++){
            var l = 1000 + Math.round(Math.random() * (corrupted.length - 1002));
            corrupted = corrupted.substr(0,l) + corrupted.charAt(l+1) + corrupted.charAt(l) + corrupted.substr(l+2);
        }
    }
    this.$img.css('background-image', 'url(' + this.imgPrefix + corrupted + ')');
};

Glitchy.prototype.restoreImage = function(){
    this.$img.css('background-image', 'url(' +this.imgPrefix + this.imageData + ')');
};

Glitchy.prototype.convertImgToBase64 = function(url, callback, outputFormat, outputQuality) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        // convert to base64
        dataURL = canvas.toDataURL(outputFormat, outputQuality);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
};
