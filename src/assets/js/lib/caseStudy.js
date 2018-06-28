function CaseStudy(){
    this.$case = null;
    this.$caseStudyBody = null;
    this.$caseTab = null;
    this.$caseStudyContentWrapper = null;
    this.currentCase = null;
    this.construct();
    this.cases = {};
    this.loadingScripts = {};
    this.casesNextTargets = {};
    this.caseSceneIds = {};
    this.ScrollPlayer = null;
    this.tabTimer = null;
    this.backgroundScrollUpdating = false;
    this.dataTextIO = null;
    this.speedBoost = null;
    this.loadedCase = null;
    this.siteTracker = null;
    this.mode = 'normal';
    this.detailTarget = '/';
}

CaseStudy.prototype.construct = function(){
    var $body = $('body');
    var html = '<div class="case-study-tab"> <div class="tab-label" data-text-io="nav:buttons:caseStudyTab"></div></div>' +
        '<div class="case-study-container">' +
            '<div class="case-study-close-tab"></div>' +
            '<div class="case-study-close-button">' +
                '<div class="top line"></div><div class="bottom line"></div>' +
            '</div>' +
            '<div class="case-study-close-arrow"></div>'+
            '<div class="case-study-content-wrapper"></div>'+
        '</div>' +
        '<div class="case-study-page-mask"></div>';
    $body.append(html);
    this.$caseStudyBody = $body.find('.case-study-container').first();
    this.$caseTab = $body.find('.case-study-tab').first();
    this.$caseStudyContentWrapper = this.$caseStudyBody.find('.case-study-content-wrapper');
    var self = this;
    this.$caseTab.click(function(){
        self.show();
    });
    this.$caseStudyBody.find('.case-study-close-tab, .case-study-close-arrow, .case-study-close-button').click(function(){
        self.hide();
    });
    this.hideTab();
    new CaseScroll(this.$caseStudyBody);
};

CaseStudy.prototype.setMode = function(mode){
    this.mode = mode ==='detail' || mode ==='normal' ?  mode : this.mode;
};

CaseStudy.prototype.addDataTextIO = function(dtio){
    this.dataTextIO = dtio;
};

CaseStudy.prototype.addSpeedBoost = function(sb){
    this.speedBoost = sb;
};

CaseStudy.prototype.addSiteTracking = function(st){
    this.siteTracker = st;
    this.siteTracker.scrollListener(this.$caseStudyBody, this.$caseStudyContentWrapper);
};

CaseStudy.prototype.show = function(caseId){
    var self = this;
    this.pauseScrollPlayer();
    caseId = caseId ? caseId : this.currentCase;
    this.currentCase = caseId;
    this.loadCase(function(){
        self.updateScrollPosition();
    });
    $('body').toggleClass('case-study-displayed',true);
    var trackingPageLabel = this.$caseStudyBody.find('.site-monitor-page').first();
    if(trackingPageLabel){
        var page = trackingPageLabel.data('track-target');
        if(this.siteTracker){
            this.siteTracker.trackPageLoad(page);
            this.siteTracker.resetScrollListener(page);
            this.siteTracker.clickListener(this.$caseStudyContentWrapper);
        }
    }
};

CaseStudy.prototype.hide = function(){
    if(this.mode === 'normal'){
        $('body').toggleClass('case-study-displayed',false);
        this.resumeScrollPlayer();
    }
    if(this.mode ==='detail'){
        $('body').toggleClass('case-study-displayed',false);
        var redirect = $('body').data('redirect-target');
        if(redirect){
            setTimeout(function(){
                window.location = redirect;
            },200);
        }
    }
};

CaseStudy.prototype.showTab = function(){
    this.$caseTab.toggleClass('displayed', true)
};

CaseStudy.prototype.hideTab = function(){
    this.cancelTabTimer();
    this.$caseTab.toggleClass('displayed', false);
};

CaseStudy.prototype.executeLoadingScripts = function(key){
  if(Object(this.loadingScripts).hasOwnProperty(key)){
      this.loadingScripts[key]();
  }
};

CaseStudy.prototype.loadHTML = function(elemId){
    elemId = elemId ? elemId : this.currentCase;
    this.$case = $(elemId);
    this.$caseStudyContentWrapper.html(this.$case.html());
    $('.case-study-container').scrollTop(0);
};

CaseStudy.prototype.addCase = function(key, elemId,nextCaseElemId, sceneId, loadingScripts){
    this.cases[key] = elemId;
    this.loadingScripts[key] = loadingScripts ? loadingScripts : function(){};
    this.casesNextTargets[key] = nextCaseElemId;
    this.caseSceneIds[key] = sceneId;
};

CaseStudy.prototype.setCase = function(elemId){
    this.currentCase = elemId;
};

CaseStudy.prototype.setDetailTarget = function(target){
    this.detailTarget = target ? target : this.detailTarget;
};

CaseStudy.prototype.loadCase = function(callback){
    var caseId = this.currentCase;
    if(this.currentCase !== this.loadedCase){
        if(Object(this.cases).hasOwnProperty(caseId)){
            var elemId = this.cases[caseId];
            this.loadHTML(elemId);
            if(this.dataTextIO){
                this.dataTextIO.draw(this.$caseStudyContentWrapper)
            }
            if(this.speedBoost){
                this.speedBoost.applyBoostToElem(this.$caseStudyContentWrapper)
            }
            this.executeLoadingScripts(caseId);
            this.bindNextCase();
            this.loadedCase = this.currentCase;
            if(callback){
                callback();
            }
        }
    }
};

CaseStudy.prototype.addScrollEffect = function(){

};

CaseStudy.prototype.bindNextCase = function(){
    var self = this;
    this.$caseStudyBody.find('.next-project').bind('click', function(){
        self.showNextCase();
    })
};

CaseStudy.prototype.updateScrollPosition = function(){
    if(Object(this.caseSceneIds).hasOwnProperty(this.currentCase)){
        var scene = this.caseSceneIds[this.currentCase];
        this.backgroundScrollUpdating = true;
        if(this.ScrollPlayer){
            this.ScrollPlayer.jumpToScene(scene);
        }
    }
};

CaseStudy.prototype.bindScrollPlayer = function (scrollPlayer){
    this.ScrollPlayer = scrollPlayer;
    var self = this;
    this.ScrollPlayer.willTransistionSceneDelegates.push(
        function(){
            self.scrollPlayerWillTransition();
        }
    )
};

CaseStudy.prototype.scrollPlayerWillTransition = function(){
    if(!this.backgroundScrollUpdating){
        this.hide();
    }
    else{
        this.backgroundScrollUpdating = false;
    }

};

CaseStudy.prototype.pauseScrollPlayer = function(){
    if(this.ScrollPlayer){
        this.ScrollPlayer.pauseListener();
    }
};

CaseStudy.prototype.resumeScrollPlayer = function(){
    if(this.ScrollPlayer){
        this.ScrollPlayer.resumeListener();
    }
};

CaseStudy.prototype.setTabTimer = function(){
    var self = this;
    this.tabTimer = setTimeout(function(){
        self.showTab();
    },3000);
};

CaseStudy.prototype.cancelTabTimer = function(){
    clearTimeout(this.tabTimer);
    this.tabTimer = null;
};

CaseStudy.prototype.showNextCase = function(){
    if(this.mode ==='normal'){
        var next = Object(this.casesNextTargets).hasOwnProperty(this.currentCase) ? this.casesNextTargets[this.currentCase] : this.currentCase;
        this.show(next);
    }
    if(this.mode ==='detail'){
        window.location = this.detailTarget;
    }
};

function IFrameSwitch($elem){
    this.$elem = $elem;
    this.$imgDesc = null;
    this.$dotsNav = null;
    this.imgCount = 0;
    this.activeImgIndex = 0;
    this.setImageCount();
    this.constructHTML();
    this.bindDotsNav();
    this.bindPlayClick();
    this.playerTimeout =null;
    this.direction = 1;
    this.bezierCurve = $.bez([0.5,0.0,0.25,1.0]);
    this.speed = 900;
}

IFrameSwitch.prototype.constructHTML = function(){
    var imgDesc = '<div class="image-description"></div>';
    var dotsNav = '<div class="dots-nav"><ul></ul></div>';

    this.$elem.append(imgDesc);
    this.$elem.append(dotsNav);

    this.$dotsNav = this.$elem.find('.dots-nav');
    this.$imgDesc = this.$elem.find('.image-description');

    var $ul = this.$dotsNav.find('ul');
    for(var i = 0; i< this.imgCount ;i++){
        var dotNavHTML ='<li><div class="dot" dot-index="'+i+'"></div></li>';
        $ul.append(dotNavHTML);
    }
};

IFrameSwitch.prototype.setImageCount = function(){
    this.imgCount = this.$elem.find('.interactive-container iframe').length;
};

IFrameSwitch.prototype.bindDotsNav = function(){
    var self = this;
    this.$dotsNav.find('.dot').click(function(){
        var index = parseInt($(this).attr('dot-index'));
        self.stopPlayer();
        self.setActiveImg(index);

    })
};

IFrameSwitch.prototype.bindPlayClick = function(){
    var self = this;
    this.$elem.find('iframe').click(function(){
          self.stopPlayer();
    })
};

IFrameSwitch.prototype.setActiveImg = function(index){
    var self = this;
    this.activeImgIndex = index;
    this.$elem.find('.active').toggleClass('active', false);
    var $img =this.$elem.find('.interactive-container iframe').eq(index);
    var $slidePanel = this.$elem.find('.slide-panel');
    var desc = $img.attr('description');
    this.$imgDesc.animate({opacity:0}, this.speed/2);
    this.$dotsNav.find('li').eq(index).toggleClass('active', true);
    this.$elem.find('.interactive-container iframe').eq(index).toggleClass('active', true);
    var imgHeight = $img.height();
    var offset = index * imgHeight;
    if(index>0){
        $slidePanel.animate({
            top: -1 * offset +'px'
        },this.speed, this.bezierCurve, function(){
            self.$imgDesc.html(desc).animate({opacity:0.4}, self.speed);
        })
    }
    else{
        $slidePanel.animate({
            top: 0
        },this.speed,this.bezierCurve, function(){
            self.$imgDesc.html(desc).animate({opacity:0.4}, self.speed);
        })
    }
};

IFrameSwitch.prototype.startPlayer = function(){
    var self = this;
    this.playerTimeout = setTimeout(function(){
        self.advance();
        self.startPlayer();
    },5000);
};

IFrameSwitch.prototype.stopPlayer = function(){
    clearTimeout(this.playerTimeout);
};

IFrameSwitch.prototype.advance = function(){
    if(this.activeImgIndex + this.direction >= this.imgCount || this.activeImgIndex + this.direction < 0){
        this.direction = this.direction * -1;
    }
    this.setActiveImg(this.direction + this.activeImgIndex);
};

function ImageSwitch($elem){
    this.$elem = $elem;
    this.$imgDesc = null;
    this.$dotsNav = null;
    this.imgCount = 0;
    this.activeImgIndex = 0;
    this.setImageCount();
    this.constructHTML();
    this.bindDotsNav();
    this.playerTimeout =null;
    this.direction = 1;
    this.bezierCurve = $.bez([0.5,0.0,0.25,1.0]);
    this.speed = 900;
}

ImageSwitch.prototype.constructHTML = function(){
    var imgDesc = '<div class="image-description"></div>';
    var dotsNav = '<div class="dots-nav"><ul></ul></div>';

    this.$elem.append(imgDesc);
    this.$elem.append(dotsNav);

    this.$dotsNav = this.$elem.find('.dots-nav');
    this.$imgDesc = this.$elem.find('.image-description');


    var $ul = this.$dotsNav.find('ul');
    for(var i = 0; i< this.imgCount ;i++){
        var dotNavHTML ='<li><div class="dot" dot-index="'+i+'"></div></li>';
        $ul.append(dotNavHTML);
    }
};

ImageSwitch.prototype.setImageCount = function(){
    this.imgCount = this.$elem.find('.interactive-container img').length;
};

ImageSwitch.prototype.bindDotsNav = function(){
    var self = this;
    this.$dotsNav.find('.dot').click(function(){
        var index = parseInt($(this).attr('dot-index'));
        self.stopPlayer();
        self.setActiveImg(index);

    })
};

ImageSwitch.prototype.setActiveImg = function(index){
    var self = this;
    this.activeImgIndex = index;
    this.$elem.find('.active').toggleClass('active', false);
    var $img =this.$elem.find('.interactive-container img').eq(index);
    var $slidePanel = this.$elem.find('.slide-panel');
    var desc = $img.attr('description');
    this.$imgDesc.animate({opacity:0}, this.speed/2);
    this.$dotsNav.find('li').eq(index).toggleClass('active', true);
    this.$elem.find('.interactive-container img').eq(index).toggleClass('active', true);
    var imgHeight = $img.height();
    var offset = index * imgHeight;
    $slidePanel.stop(true,true);
    self.$imgDesc.stop(true,true);
    if(index>0){
        $slidePanel.animate({
            top: -1 * offset +'px'
        },this.speed, this.bezierCurve, function(){
            self.$imgDesc.html(desc).animate({opacity:0.4}, self.speed);
        })
    }
    else{
        $slidePanel.animate({
            top: 0
        },this.speed,this.bezierCurve, function(){
            self.$imgDesc.html(desc).animate({opacity:0.4}, self.speed);
        })
    }
};

ImageSwitch.prototype.startPlayer = function(){
    var self = this;
    this.playerTimeout = setTimeout(function(){
        self.advance();
        self.startPlayer();
    },5000);
};

ImageSwitch.prototype.stopPlayer = function(){
  clearTimeout(this.playerTimeout);
};

ImageSwitch.prototype.advance = function(){
    if(this.activeImgIndex + this.direction >= this.imgCount || this.activeImgIndex + this.direction < 0){
        this.direction = this.direction * -1;
    }
    this.setActiveImg(this.direction + this.activeImgIndex);
};

function MediaPlayer($elem, videoElemId){
    this.$elem = $elem;
    this.video = document.getElementById(videoElemId);
    this.bindClose();
}

MediaPlayer.prototype.hide = function(){
    var self = this;
    self.video.pause();
    self.$elem.find('video').attr('controls',false);
    this.$elem.animate({opacity:0}, function(){
      self.$elem.css({display: 'none'});
    });
};

MediaPlayer.prototype.bindClose = function(){
    var self = this;
    this.$elem.find('.container').click(function(){
            self.hide();
    });
    this.video.addEventListener('ended',function(){self.hide()},false);
};

MediaPlayer.prototype.newFunction = function(){
  this.bindClick();
  if(this.video === null){
      return false;
  }
};

MediaPlayer.prototype.launch = function(){
    var self = this;
    self.video.play();
    this.$elem.css({display: 'inline'});
    this.$elem.animate({
        opacity:1
    });
    setTimeout(function(){
       self.$elem.find('video').attr('controls', true)
    },1000)
};

MediaPlayer.prototype.bindClick = function($elem){
    var self = this;
  $elem.click(function(){
      self.launch();
  })
};
