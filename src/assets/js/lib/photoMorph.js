function PhotoMorph($elem){
    this.$elem = $elem;
    this.$photos = [];
    this.timer = null;
    this.morphSpeed = 3000;
    this.pace = 7000;
    this.loadPhotos();

}

PhotoMorph.prototype.move = function (array, old_index, new_index) {
    if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
};


PhotoMorph.prototype.loadPhotos = function(){
    this.$photos = this.$elem.find('.morphable');
    this.$photos.each(function(){
        $(this).css({
            background:"url(" + $(this).attr('img-src') +")"
        })
    })
};

PhotoMorph.prototype.sortTopToBack = function(){
    $(this.$photos[this.$photos.length-1]).prependTo(this.$elem).css({opacity:1});
    this.move(this.$photos, this.$photos.length-1, 0);
};

PhotoMorph.prototype.morph = function(){
    var self    = this;
    this.$elem.find('.morphable').stop(true);
    $(this.$photos[this.$photos.length-1]).animate({opacity:0},this.morphSpeed, function(){
        self.sortTopToBack();
    })
};

PhotoMorph.prototype.start = function(pace, morphSpeed){
    this.pace = pace ? pace : this.pace;
    this.morphSpeed = morphSpeed ? morphSpeed : this.morphSpeed;
    this.transitionPhotos();
};

PhotoMorph.prototype.transitionPhotos = function(){
    var self= this;
    this.timer = setTimeout(function(){
        self.morph();
        self.transitionPhotos();
    }, this.pace)
};

PhotoMorph.prototype.stop = function(){
    if(this.timer){
        clearTimeout(this.timer)
    }
    this.timer = null;
};

PhotoMorph.prototype.glitch = function(millis){
    var self = this;
    this.start(60,50);
    setTimeout(function(){
       self.stop();
    }, millis)
};