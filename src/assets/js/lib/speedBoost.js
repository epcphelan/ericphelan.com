function SpeedBoost(){
    this.sizes = {
        LARGE   : "_large",
        MEDIUM  : "_medium",
        SMALL   : "_small"
    };
    this.browserSize = this.sizes.MEDIUM;
    this.maxWidth = 0;
    this.updateBrowserSize();
    this.loadImages();
}

SpeedBoost.prototype.startResizeListener = function(){
    var self = this;
    $(window).resize(function(){
        if($(window).width() > self.maxWidth){
            self.maxWidth = $(window).width();
            if(self.browserSize !== self.getBrowserSize()){
                self.updateBrowserSize();
                self.loadImages();
            }
        }
    });
};

SpeedBoost.prototype.loadImages = function(){
    var self = this;
    $('[speed-boost-media]').each(function(){
        var $img = $(this);
        self.applySizingToImage($img,self.getAvailableSrcs($img),self.browserSize);
    });
};

SpeedBoost.prototype.applyBoostToElem = function($elem){
    var self = this;
    $elem.find('[speed-boost-media]').each(function(){
        var $img = $(this);
        self.applySizingToImage($img,self.getAvailableSrcs($img),self.browserSize);
    });
};

SpeedBoost.prototype.applySizingToImage = function($img, srcs, size){
    var src = null;
    switch (size){
        case this.sizes.LARGE:
            src = srcs[this.sizes.LARGE] ? srcs[this.sizes.LARGE] : srcs[this.sizes.MEDIUM] ? srcs[this.sizes.MEDIUM] : srcs[this.sizes.SMALL];
            break;
        case this.sizes.MEDIUM:
            src = srcs[this.sizes.MEDIUM] ? srcs[this.sizes.MEDIUM] : srcs[this.sizes.LARGE] ? srcs[this.sizes.LARGE] : srcs[this.sizes.SMALL];
            break;
        case this.sizes.SMALL:
            src = srcs[this.sizes.SMALL] ? srcs[this.sizes.SMALL] : srcs[this.sizes.MEDIUM] ? srcs[this.sizes.MEDIUM] : srcs[this.sizes.LARGE];
            break;
    }
    var currentSrc =  $img.attr('src');
    if(currentSrc !== src){
        $img.attr('src', src);
        if($img.parents('video')){
            var video = $img.parents('video');
            if(video[0]){
                video[0].load();
            }
        }
    }
};

SpeedBoost.prototype.getAvailableSrcs = function($img){
    var obj = {};
    obj[this.sizes.SMALL] = $img.attr('sb-src-s');
    obj[this.sizes.MEDIUM] = $img.attr('sb-src-m');
    obj[this.sizes.LARGE] = $img.attr('sb-src-l');
    return obj;
};

SpeedBoost.prototype.getBrowserSize = function(){
    var width = $(window).width();
    var height = $(window).height();
    var largeWidth = 1300;
    var mediumWidth = 600;
    var largeHeight = 1200;
    var mediumHeight = 700;

    return  height > largeHeight  || width > largeWidth    ? this.sizes.LARGE  :
            height > mediumHeight || width > mediumWidth   ? this.sizes.MEDIUM :
            this.sizes.SMALL;
};

SpeedBoost.prototype.setBrowserSize = function (size) {
    this.browserSize = size;
};

SpeedBoost.prototype.updateBrowserSize = function(){
    this.setBrowserSize(this.getBrowserSize());
};

