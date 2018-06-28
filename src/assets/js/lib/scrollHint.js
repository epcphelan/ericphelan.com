function ScrollHint(){
    this.$elem = null;
    this.displayed = false;
    this.defaultDelay = 9000;
    this.timer = null;
    this.scrollMessage = false;
    this.maxHints = 3;
    this.currentHint = 0;
    this.bind();
}

ScrollHint.prototype.bind = function(){
    this.$elem = $('.scroll-hint');
};

ScrollHint.prototype.arm = function(initialDelay){
    if(this.currentHint < this.maxHints){
        this.currentHint ++;
        var self = this;
        var delay = initialDelay ? initialDelay : this.defaultDelay;
        this.timer = setTimeout(function(){
            self.displayElem();
            self.toggleMessage();
            self.timer = setTimeout(function(){
                self.fadeElem();
                self.timer = setTimeout(function(){
                    self.sinkElem();
                }, 7500)
            },10000)
        },delay)
    }

};

ScrollHint.prototype.removeElem = function(){
    this.$elem.toggleClass('displayed', false);
};

ScrollHint.prototype.fadeElem = function(){
    this.$elem.toggleClass('faded', true);
};

ScrollHint.prototype.sinkElem = function(){
    this.$elem.toggleClass('dropped', true);
};

ScrollHint.prototype.displayElem = function(){
    this.$elem.toggleClass('displayed', true);
};

ScrollHint.prototype.toggleMessage = function(){
    this.$elem.toggleClass('scroll', !this.scrollMessage);
    this.scrollMessage = !this.scrollMessage;
};

ScrollHint.prototype.disarm = function(){
    clearTimeout(this.timer);
    this.timer = null;
    this.removeElem();
};