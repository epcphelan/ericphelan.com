function ShootingStar($canvas){
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.$star = null;
    this.$canvas = $canvas;
    this.showTimer = null;
}



ShootingStar.prototype.setTrajectory = function(){
    var maxX = this.$canvas.width();
    this.startX = Math.floor(Math.random() * maxX);
    var maxY = this.$canvas.height() * 2/3;
    this.endY = Math.floor(Math.random() * maxY);
    this.endX = Math.floor(Math.random() * maxX);
};


ShootingStar.prototype.shoot = function(){
    this.$star.css({
        top: this.startY + 'px',
        left: this.startX +'px'
    });
    var yTransform = this.endY - this.startY;
    var xTransform = this.endX - this.startX;
    this.$star.toggleClass('falling',true);
    this.$star.css({
        transform: 'translateY('+yTransform+'px) translateX(' + xTransform +'px)'
    })
};



ShootingStar.prototype.addStarToCanvas = function(){
    this.$canvas.find('.shooting-star').remove();
    this.$star = $('<div class="shooting-star"></div>');
    this.$canvas.append(this.$star);
};


ShootingStar.prototype.startShow = function(interval){
    console.log('show started');
    var self = this;
    interval = interval ? interval : 5000;
    repeat();
    function repeat(){
        var pace = Math.max(Math.random() * interval, 700);
        this.showTimer = setTimeout(function(){
            self.addStarToCanvas();
            self.setTrajectory();
            self.shoot();
            repeat();
        }, pace)
    }
};

ShootingStar.prototype.stopShow = function(){
    clearTimeout(this.showTimer);
    this.showTimer=null;
};

