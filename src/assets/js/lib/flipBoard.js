function FlipBoard($elem, imagesArray, finalImgIndex){
    this.$elem = $elem;
    this.$top = null;
    this.$bottom = null;
    this.imgArray  = imagesArray;
    this.finalImgIndex = finalImgIndex;
    this.pace = 100;
    this.currentIteration = 0;
    this.totalIterations = 0;
    this.currentImageIndex = Math.floor(Math.random()*this.imgArray.length);
    this.illuminationTimer = null;
    this.make();
}

FlipBoard.prototype.make = function(){
    var top = '<div class="top"></div>';
    var bottom = '<div class="bottom"></div>';
    this.$elem.html(top + bottom);
    this.$top = this.$elem.find('.top');
    this.$bottom = this.$elem.find('.bottom');
    this.$bottom.css({'background-image' : 'url("' + this.imgArray[this.currentImageIndex]+'")'});
    this.upNextURL = this.imgArray[this.currentImageIndex];
    this.advanceIndex();
    this.$top.css({'background-image' : 'url("' + this.imgArray[this.currentImageIndex]+'")'});
};

FlipBoard.prototype.setPace = function(pace){
    this.pace = pace;
};

FlipBoard.prototype.animate = function(iterations){
    this.$top.css({'top':0});
    this.$bottom.css({'top':0});
    this.totalIterations = iterations;
    this.$elem.toggleClass('active', true);
    this.currentIteration = 0;
    this.update();
};

FlipBoard.prototype.flush = function(direction){
    var top = direction === 1 ? '-100%' : '100%';
    var self = this;
    self.$elem.toggleClass('finished', false);
    this.$top.animate({'top':top}, this.pace, function(){
        self.$bottom.animate({'top':top}, self.pace, function(){
            self.$elem.toggleClass('active', false);
        });
    })
};

FlipBoard.prototype.showFinalCard = function(){
    this.$elem.toggleClass('active', false);
};

FlipBoard.prototype.startRandomIllumination = function(pace){
    var self = this;
    lightUp();
    function lightUp(){
        self.illuminationTimer = setTimeout(function(){
            self.$elem.toggleClass('illuminated', !self.$elem.hasClass('illuminated'));
            lightUp();
        }, Math.floor(pace * Math.random()))
    }
};

FlipBoard.prototype.stopRandomIllumination = function(pace){
    clearTimeout(this.illuminationTimer);
    this.illuminationTimer = null;
};

FlipBoard.prototype.update = function(){
    var self = this;
    var backImgURL = this.upNextURL;
    var nextImgURL = this.imgArray[this.currentImageIndex];

    var duration = this.currentIteration/2 < this.totalIterations
        ? this.pace :
        this.currentIteration*1.2 * this.pace;
    if(this.currentIteration +1 >= this.totalIterations){
        backImgURL = this.imgArray[this.finalImgIndex];
    }
    if(this.currentIteration < this.totalIterations){
        this.$top.animate({'top':'100%'}, duration, function(){
            self.$top.css({'background-image' : 'url("' + backImgURL+'")'});
            self.$top.css({'top':0});
            self.$bottom.css({'background-image' : 'url("' + nextImgURL+'")'});
            self.advanceIndex();
            self.currentIteration++;
            self.update();
        })
    }
    else{
        self.$elem.toggleClass('finished', true);
    }
};

FlipBoard.prototype.advanceIndex = function(){
    this.currentImageIndex = (this.currentImageIndex + 1) < this.imgArray.length ? this.currentImageIndex + 1 : 0;
};