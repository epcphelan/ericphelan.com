function SiteTracker(){
    this.sessionId = null;
    this.referrer = '';
    this.clickListener();
    this.start();
    this.pageLabel = 'Unknown Page';
    this.fullScrollSent = false;
    this.threeQuarterScrollSent = false;
    this.halfScrollSent = false;
    this.quarterScrollSent = false;
    this.unsentPackages = [];
}

SiteTracker.prototype.postPackage  = function(pkg){
    pkg.sessionId = this.sessionId;
    if(this.sessionId){
        $.post('/api/track/report',pkg,function(data){});
    }
    else{
        this.unsentPackages.push(pkg);
    }
};

SiteTracker.prototype.processQueuedPackages = function(){
    var self = this;
    if(this.unsentPackages.length > 0){
        this.unsentPackages.forEach(function(pkg){
            self.postPackage(pkg);
            self.unsentPackages.splice(self.unsentPackages.indexOf(pkg),1);
        })
    }
};

SiteTracker.prototype.clickListener = function($elem){
    $elem = $elem || $('body');
    var self = this;
    $elem.find('.site-monitor-click').click(function(){
        self.postPackage(self.newClickPackage($(this)));
    })
};

SiteTracker.prototype.trackPageLoad = function(page){
    this.pageLabel = page;
    this.postPackage(this.newPagePackage(page))
};

SiteTracker.prototype.scrollListener = function($container, $content){
    var self = this;
    $container = $container|| $('body');
    $container.on('scroll', function(){
        var contentHeight = $content.height();
        var visibleHeight = $container.height();
        var progress = $container.scrollTop() + visibleHeight;
        var percentViewed = progress/contentHeight;
        if(percentViewed === 1 && !self.fullScrollSent){
            self.postPackage(self.newScrollPackage('100%'));
            self.fullScrollSent = true;
        }
        else if(percentViewed > .75 && !self.threeQuarterScrollSent){
            self.postPackage(self.newScrollPackage('75%'));
            self.threeQuarterScrollSent = true;
        }
        else if(percentViewed > .5 && !self.halfScrollSent){
            self.postPackage(self.newScrollPackage('50%'));
            self.halfScrollSent = true;
        }
        else if(percentViewed >.25 && !self.quarterScrollSent){
            self.postPackage(self.newScrollPackage('25%'));
            self.quarterScrollSent = true;
        }
    });
};

SiteTracker.prototype.resetScrollListener = function(page){
    this.pageLabel = page || this.pageLabel;
    this.fullScrollSent = false;
    this.threeQuarterScrollSent = false;
    this.halfScrollSent = false;
    this.quarterScrollSent = false;
};

SiteTracker.prototype.newScrollPackage = function(target){
  var action = "scroll";
  var page = this.pageLabel;
  return {
      target: target,
      action: action,
      page: page,
      sessionId: this.sessionId
  }
};

SiteTracker.prototype.newPagePackage = function(page){
  return{
      target: page,
      action: 'page',
      page: this.pageLabel,
      sessionId: this.sessionId
  }
};

SiteTracker.prototype.newClickPackage = function($elem){
  var target = $elem.data('track-target');
  var action = "click";
  var page = this.pageLabel;
  return {
      target: target,
      page: page,
      action: action,
      sessionId: this.sessionId
  }
};

SiteTracker.prototype.getSetInfo = function(){
    this.referrer = document.referrer ? document.referrer : getQueryRef();

    function getQueryRef() {
        var url = window.location.href;
        var name = 'ref';
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        var value = decodeURIComponent(results[2].replace(/\+/g, " "));
        removeRefFromURL(value);
        return value;
    }

    function removeRefFromURL(value){
        var url = window.location.pathname;
        var hash = window.location.hash.substr(1);
        url = url.replace('?ref='+value,'') + (hash ? '#' + hash : '');
        var title = document.title;
        window.history.replaceState("object or string", title , url);
    }
};

SiteTracker.prototype.getFingerprint = function(callback){
    var options = {swfPath: 'http://assets.ericphelan.com/FontList.swf', excludeUserAgent: true};
    new Fingerprint2(options).get(function(result){
        callback(result);
    });
};

SiteTracker.prototype.start = function(){
    var self = this;
    this.getSetInfo();
    this.getFingerprint(function(fingerprint){
        $.post('/api/track/start',{referrer:self.referrer, fingerprint: fingerprint}, function(data){
            if(data){
                self.sessionId =  data.sessionId;
                self.processQueuedPackages();
            }
        })
    });

};