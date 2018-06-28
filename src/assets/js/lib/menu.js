function DynamicMenu(){
    this.displayState = false;
    this.htmlElem = $('.dynamic-menu');
    this.menuIcon = $('.right-side-menu-icon');

}

DynamicMenu.prototype.hideMenu = function(){
    this.htmlElem.toggleClass('fadeout',true);
    this.displayState = false;
    var self = this;

    self.htmlElem.find('.menu-item').toggleClass('displayed',false);
    setTimeout(function(){
        self.htmlElem.find('.hotlinks').toggleClass('displayed',false);
        self.menuIcon.toggleClass('displayed',false);
        self.htmlElem.toggleClass('fadeout',false);
        self.htmlElem.toggleClass('displayed', false);
    },450);

};

DynamicMenu.prototype.showMenu = function(){
    this.htmlElem.toggleClass('displayed',true);
    this.menuIcon.toggleClass('displayed',true);
    var $menuItems = this.htmlElem.find('.menu-item');
    $menuItems.each(function(index){
        var $item = $(this);
        setTimeout(function(){
            $item.toggleClass('displayed', true);
        },100 * index)
    });

    var $hotLinks = this.htmlElem.find('.hotlinks');
    setTimeout(function(){
        $hotLinks.toggleClass('displayed',true);
    }, 800);
    this.displayState = true;
};

DynamicMenu.prototype.arm = function(){
    var self = this;
    this.htmlElem.find('.menu-item').click(function(){
        self.hideMenu();
    });
};

DynamicMenu.prototype.toggleDisplay = function(){
    if(!this.displayState){
        this.showMenu();
    }
    else{
        this.hideMenu();
    }

};
