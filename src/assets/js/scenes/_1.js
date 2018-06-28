SceneController.prototype.scene1 = function () {
    var scene1 = this.Scrolling.scene();
    var $scene1 = $('#scene-1');
    var self= this;
    scene1.$body = $scene1;
    scene1.duration = 1000;
    scene1.transIn = function (direction, duration, callback) {
        function loadSceneForward() {
            SiteTracking.trackPageLoad('Home');
            startVideo();
            //this.transitionSceneContainer($scene,direction,duration,function(){});
            self.Cases.hideTab();
            callback();
        }

        function loadSceneBackwards() {
            SiteTracking.trackPageLoad('Home');
            startVideo();
            self.Cases.hideTab();
            self.transitionSceneContainer($scene1, direction, duration, function () {
                liftTitle(callback)
            });
        }

        switch (direction) {
            case 1:
                loadSceneForward();
                break;
            case -1:
                loadSceneBackwards();
                break;
        }
    };

    scene1.transOut = function (direction, duration, callback) {
        function unloadSceneForward() {
            toggleArrow(true);
            stopVideo();
            dropTitle(function () {
                self.transitionSceneContainer($scene1, direction, duration, function () {
                    callback()
                });
            });
        }

        function unloadSceneBackwards() {
            //this.transitionSceneContainer($scene,direction,duration,function () {});
            callback();
        }

        switch (direction) {
            case 1:
                unloadSceneForward();
                break;
            case -1:
                unloadSceneBackwards();
                break;
        }
    };

    var dropTitle = function (callback) {
        $scene1.toggleClass('dropped', true);
        setTimeout(function(){
            callback()
        },300)
    };

    var liftTitle = function (callback) {
        $scene1.toggleClass('dropped', false);
        setTimeout(function(){
            callback()
        },500)
    };

    var stopVideo = function() {
        var video = document.getElementById('home_bg_video');
        video.pause();
    };

    var startVideo = function(){
        var video = document.getElementById('home_bg_video');
        video.play();
    };

    var toggleArrow = function(toggle){
        $('#scene-1 .scroll-hint').toggleClass('dropped',toggle)
    };

    return scene1;
};
