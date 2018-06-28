function UnfoldingCards($elem){
    this.$elem = $elem;
    this.cardCallbacks = [];
    this.timers = [];
}

UnfoldingCards.prototype.resetCards = function(){
    var $quads = this.$elem.find('.quad');
    $quads
        .toggleClass('open', false)
        .toggleClass('final-wrap-visible', false)
        .find('.final-wrap').toggleClass('visible', false);
};

UnfoldingCards.prototype.openCard = function($card, callback){
    $card.toggleClass('open',true);
    var to =setTimeout(function(){
        $card.toggleClass('final-wrap-visible', true);
        $card.find('.final-wrap').toggleClass('visible', true);
        if(callback){
            callback();
        }
    },1300);
    this.timers.push(to);
};

UnfoldingCards.prototype.closeCard = function($card, callback){
    $card.toggleClass('open',false);
    $card.find('.final-wrap').toggleClass('visible', true);
    if(callback){
        callback();
    }
};

UnfoldingCards.prototype.animateOpen =function(duration){
    var self = this;
    var $quads = this.$elem.find('.quad');
    $quads.each(function(index){
        var $card = $(this);
        var delay = (Math.random() * 750) + duration/2 ;
        var to = setTimeout(function(){
            self.openCard($card,self.cardCallbacks[index])
        }, delay);
        self.timers.push(to);
    })
};

UnfoldingCards.prototype.animateClose = function(){
    var self = this;
    var $quads = this.$elem.find('.quad');
    $quads.each(function(){
        var $card = $(this);
        var delay = (Math.random() * 750) + duration/2 ;
        var to = setTimeout(function(index){
            self.closeCard($card,self.cardCallbacks[index])
        }, delay);
        self.timers.push(to);
    })
};

UnfoldingCards.prototype.stopAnimation = function(){
    var self = this;
    for(var i =0; i< self.timers.length ;i++){
        clearTimeout(self.timers[i]);
        this.timers[i] = null;
    }
};