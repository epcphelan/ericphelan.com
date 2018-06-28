/**
 * Created by ericphelan on 10/8/17.
 */
function PeekABooTwo($target){
    this.$target = $target;
    this.bezierCurve = $.bez([0.5,0.0,0.25,1.0]);
    this.sizeImages();
    this.startResizeListener();
}

PeekABooTwo.prototype.sizeImages = function(){
    var self = this;
    this.$target.find('img.resizable').each(function(){
        self.coverImage(this)
    });
};

PeekABooTwo.prototype.coverImage = function(image){
    /* Getting the container and image sizes */
    if(image.complete){
        doCover();
    }
    else{
        $(image).on('load',function(){
            doCover();
        });
    }
    function doCover(){
        var parentWidth  = $(image).parent().width();
        var parentHeight = $(image).parent().height();
        var imageWidth   = image.naturalWidth;
        var imageHeight  = image.naturalHeight;

        var widthRatio = parentWidth / imageWidth ;
        var heightRatio = parentHeight / imageHeight ;

        var ratio = Math.max(widthRatio, heightRatio);

        var newImageProperties = {
            left: (parentWidth - imageWidth * ratio) / 2 + 'px',
            top: (parentHeight - imageHeight * ratio) / 2 +'px',
            width: imageWidth * ratio + 'px',
            height: imageHeight * ratio +'px'
        };
        $(image).css(newImageProperties);
    }
};

PeekABooTwo.prototype.startResizeListener = function(){
    var self = this;
    $(window).resize(function(){
        self.sizeImages();
    })
};

PeekABooTwo.prototype.stageDown = function(){
    this.$target.find('.content').toggleClass('bottom', true);
};

PeekABooTwo.prototype.stageUp = function(){
    this.$target.find('.content').toggleClass('top', true);
};

PeekABooTwo.prototype.openUp = function(duration){
    var self = this;
    duration = duration ? duration : 1000;

    this.$target.find('.content').each(function(){
        var elem = this;
        var order = parseInt($(this).attr('animate-order'));
        self.setExpansionTimeout(function(){
            $(elem).toggleClass('bottom', false);
            $(elem).toggleClass('top', false);
        }, ((duration/20) * order) + (Math.random()*200))
    });

    this.$target.find('img.zoomable').each(function(){
        var img = this;
        if(img.complete){
            self.imageZoomEffect($(img),1800, 0.05)
        }
        else{
            img.onload = function(){
                self.imageZoomEffect($(img),1800, 0.05)
            }
        }
    });
    //this.applyTilt();
};

PeekABooTwo.prototype.openDown = function(duration){
    var self = this;
    duration = duration ? duration : 1000;


    this.$target.find('.content').each(function(){
        var elem = this;
        var order = parseInt($(this).attr('animate-order'));
        self.setExpansionTimeout(function(){
            $(elem).toggleClass('bottom', false);
            $(elem).toggleClass('top', false);
        }, (duration/12) * (12-order) + 700)
    });

    this.$target.find('img.zoomable').each(function(){
        var img = this;
        if(img.complete){
            self.imageZoomEffect($(img),1800, 0.05)
        }
        else{
            img.onload = function(){
                self.imageZoomEffect($(img),1800, 0.05)
            }
        }

    });
    //this.applyTilt();
};

PeekABooTwo.prototype.closeUp = function(duration){
    var self = this;
    duration = duration ? duration : 1000;

    this.$target.find('.content').each(function(){
        var elem = this;
        var order = parseInt($(this).attr('animate-order'));
        self.setExpansionTimeout(function(){
            $(elem).toggleClass('top', true);
        }, duration/12 * order)
    });
};

PeekABooTwo.prototype.closeDown = function(duration){
    var self = this;
    duration = duration ? duration : 1000;

    this.$target.find('.content').each(function(){
        var elem = this;
        var order = parseInt($(this).attr('animate-order'));
        self.setExpansionTimeout(function(){
            $(elem).toggleClass('bottom', true);
        }, duration/12 * (12-order))
    });
};

PeekABooTwo.prototype.imageZoomEffect = function($image, duration, zoom){
    var top = $image.position().top;
    var left = $image.position().left;
    var width = $image.width();
    var height = $image.height();

    var newWidth = width * (1+zoom);
    var newHeight = height * (1 + zoom);
    var newTop = top - ((newHeight - height )/2);
    var newLeft = left - ((newWidth-width)/2);
    $image.css({
        top: newTop + 'px',
        left: newLeft +'px',
        width: newWidth +'px',
        height: newHeight +'px'
    });
    $image.animate({
        top: top + 'px',
        left: left +'px',
        width: width +'px',
        height: height +'px'
    }, duration)


};

PeekABooTwo.prototype.setExpansionTimeout = function(callback, duration){
    setTimeout(callback, duration)
};

PeekABooTwo.prototype.applyTilt = function(){
    this.$target.find('.content').tilt({
        glare: true,
        maxGlare: .1,
        scale: 1.01,
        maxTilt:        20,
        perspective:    1000,
        easing:         "cubic-bezier(.03,.98,.52,.99)",
        transition:     true
    })
};