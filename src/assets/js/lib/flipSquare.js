function FlipSquare($container){
    this.$container = $container;
    this.views = {
        Lehman:"lehman",
        BofA:"bofa"
    };
    this.bindClicks();
}

FlipSquare.prototype.showView = function(view){
    this.$container.find('.' + view).show();
    this.$container.toggleClass(view);
};

FlipSquare.prototype.closeView = function(){
    var self = this;
    this.$container.toggleClass(self.views.Lehman, false);
    this.$container.toggleClass(self.views.BofA, false);
    setTimeout(function(){
        self.$container.find('.more-info').hide();
    },700)

};

FlipSquare.prototype.bindClicks = function(){
    var self = this;
    this.$container.find('.close, .mobile-close').click(function(){
        self.closeView();
    });
    this.$container.find('.launch-bofa').click(
        function(){
            self.showView(self.views.BofA)
        });
    this.$container.find('.launch-lehman').click(function(){
        self.showView(self.views.Lehman)
    });
};