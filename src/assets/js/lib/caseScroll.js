function CaseScroll($page){
    this.$page = $page;
    this.bindScroll();
    this.bufferZone = 40;
}

CaseScroll.prototype.animate = function(){
    var visibleHeight = $(this.$page).height()- this.bufferZone;
    this.$page.find('.scroll-effect:not(.on-screen)').each(function(){
        var elemTop = $(this).offset().top;
        if(elemTop  < visibleHeight){
            $(this).toggleClass('on-screen',true)
        }
    })
};

CaseScroll.prototype.bindScroll = function(){
    var self = this;
    $(this.$page).on('scroll',function caseListener() {
        self.animate();
    })
};