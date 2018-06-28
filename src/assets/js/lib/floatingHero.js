
function FloatingHero($elem){
    this.$elem = $elem;
    this.updateTimer = null;
    this.useRAF = true;
    this.updateDelay = 100;
    this.mvmt1Range = 90;
    this.mvmt2Range = 45;
    this.mvmt1 = 0;
    this.mvmt2 = 0;
    this.mvmt1Direction = .1;
    this.mvmt2Direction = -.1;
    this.skipTicks = 1;
    this.currentTick =0;
    this.mvmt1ReversalTick =125;
    this.mvmt2ReversalTick =125;
    this.reversalPause = 125;

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

FloatingHero.prototype.start = function(){
    var self = this;
    if (this.useRAF) {
        this.update();
    } else {
        this.updateTimer = setInterval(function() {
            self.update();
        }, this.updateDelay);
    }
};

FloatingHero.prototype.stop = function(){
    if (this.useRAF) {
        cancelRequestAnimFrame(this.updateTimer);
    } else {
        clearInterval(this.updateTimer);
    }
    this.updateTimer = null;
    //this.restoreImage();
};

FloatingHero.prototype.restoreImage = function(){
};

FloatingHero.prototype.update = function(){
    // request another frame?
    if (this.useRAF) { this.updateTimer = requestAnimFrame(this.update.bind(this)); }

    if(this.currentTick >= this.skipTicks){
        // make next step
        if(this.mvmt1ReversalTick > this.reversalPause){
            this.mvmt1 += this.mvmt1Direction;
        }
        else{
            this.mvmt1ReversalTick++;
        }
        if(this.mvmt2ReversalTick>this.reversalPause){
            this.mvmt2 += this.mvmt2Direction;
        }
        else{
            this.mvmt2ReversalTick++;
        }

        //If next step exceeds range, flip direction
        if(Math.abs(this.mvmt1) >= Math.abs(this.mvmt1Range)){
            this.mvmt1ReversalTick=0;
            this.mvmt1Direction *= -1;
            this.mvmt1 +=this.mvmt1Direction;
        }
        if(Math.abs(this.mvmt2) >= Math.abs(this.mvmt2Range)){
            this.mvmt2ReversalTick=0;
            this.mvmt2Direction *= -1;
            this.mvmt2+=this.mvmt2Direction
        }
        this.$elem.css({
            'transform': 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + this.mvmt1 +','+ this.mvmt2+',0,1)'
        });
        this.currentTick = 0;
    }
    else{
        this.currentTick++;
    }

};