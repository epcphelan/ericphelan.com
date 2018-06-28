function ScrollPlayer(){
    this.scenes = [];
    this.sceneTick = 0;
    this.scrollThreshold = 80;
    this.currentScroll = 0;
    this.animationState = 0;
    this.pace = 500;
    this.suppressed = false;
    this.suppressionTimeout = null;
    this.bezierCurve = $.bez([0.5,0.0,0.25,1.0]);
    this.willTransistionSceneDelegates = [];
    this.sceneMap = {
        home:       0,
        profile:    1,
        skills:     1,
        work:       2,
        contact:    9
    };
    this.staticLinksMap = [
        'home',
        'bio',
        'work',
        'glam-and-go',
        'assorted-small-projects',
        'springshot',
        'ipplicant',
        'episampler',
        'lassa-fever-research',
        'contact'
    ];
    this.pageTitles = [
        'Home',
        'Bio',
        'Work',
        'Glam & Go',
        'Various',
        'Springshot Inc.',
        'i-pplicant',
        'epiSampler',
        'Lassa Research',
        'Contact'
    ]
    this.loadUrlCallback = null;
    this.startY = null;
    this.scrollGravityTimer = null;
}

function ScrollPlayerScene(){
    var defaultDuration = 400;
    var defaultTrans = function(direction, duration, callback){
        callback();
    };
    this.duration = defaultDuration;
    this.transIn = defaultTrans;
    this.transOut = defaultTrans;
    this.$body = null;
}

ScrollPlayer.prototype.addTransitionDelegate = function(delegate){
    if(typeof delegate === "function"){
        this.willTransistionSceneDelegates.push(delegate)
    }
};

ScrollPlayer.prototype.removeTransitionDelegate = function(delegate){
    if(typeof delegate === "function"){
        var index =this.willTransistionSceneDelegates.indexOf(delegate);
        if(index > -1){
            this.willTransistionSceneDelegates.splice(index,1);
        }
    }
};

ScrollPlayer.prototype.scene = function(){
    return new ScrollPlayerScene()
};

ScrollPlayer.prototype.addScene = function(scene){
    this.scenes.push(scene);
};

ScrollPlayer.prototype.renderCompleted = function(tick){
    this.sceneTick = tick;
    this.animationState = 0;
    if(this.loadUrlCallback){
        this.loadUrlCallback();
    }
};

ScrollPlayer.prototype.updateURL = function(scene){
    var urlSlug = '#' + this.staticLinksMap[scene];
    var title = 'Eric Phelan | ' + this.pageTitles[scene];
    if(urlSlug){
        window.history.replaceState("object or string", title , urlSlug);
    }
};

ScrollPlayer.prototype.loadURL = function (callback) {
    var location = window.location.hash.substr(1);
    if(location){
        this.loadUrlCallback = callback;
        var scene = this.staticLinksMap.indexOf(location);
        if(scene > -1){
            this.jumpToScene(scene);
        }
    }
};

ScrollPlayer.prototype.transitionScenes = function(direction, currentScene, nextScene, overrideDuration, callback){
    var self = this;
    this.willTransistionSceneDelegates.forEach(function(delegate){
        delegate();
    });
    var scenesToExecute = (nextScene ? 1 : 0) + (currentScene ? 1 : 0);
    var executed = 0;
    if(this.animationState === 0 ){
        if(nextScene){
            var transIn = nextScene.transIn;
            var durationIn = overrideDuration !== null ? overrideDuration : nextScene.duration;
            this.animationState = 1;
            transIn(direction,durationIn, function(){
                executed++;
                if(executed === scenesToExecute){
                    callback();
                }
            });
        }

        if(currentScene){
            var transOut = currentScene.transOut;
            var durationOut = overrideDuration !== null ? overrideDuration : nextScene.duration;
            this.animationState = 1;
            transOut(direction, durationOut, function () {
                executed++;
                self.rebaseScene(currentScene);
                if(executed===scenesToExecute){
                    callback()
                }
            });
        }
    }
};

ScrollPlayer.prototype.advance = function(){
    var self = this;
    var nextTick = Math.min(this.scenes.length-1, this.sceneTick + 1);
    if(nextTick !== this.sceneTick){
        var nextScene = this.scenes[nextTick];
        var currentScene = this.scenes[this.sceneTick];
        var direction = 1;
        this.updateURL(nextTick);
        this.transitionScenes(direction, currentScene, nextScene,null, function(){
            self.renderCompleted(nextTick);
        });
    }
};

ScrollPlayer.prototype.rewind = function(){
    var self = this;
    var nextTick = Math.max(0, this.sceneTick - 1);
    if( nextTick !== this.sceneTick){
        var nextScene = this.scenes[nextTick];
        var currentScene = this.scenes[this.sceneTick];
        var direction = -1;
        this.updateURL(nextTick);
        this.transitionScenes(direction, currentScene, nextScene,null, function(){
            self.renderCompleted(nextTick)
        });
    }
};

ScrollPlayer.prototype.scrollListener =function(e){
    if(!this.suppressed && this.animationState === 0 ){
        this.currentScroll += e.deltaY;
        if(Math.abs(this.currentScroll) > this.scrollThreshold){
            if(this.currentScroll > 0){
                this.advance();
            }
            else{
                this.rewind();
            }
            this.currentScroll = 0
        }
        else{
            this.scrollHint();
        }
    }
};

ScrollPlayer.prototype.rebaseScene = function(scene){
    var $body = scene.$body;
    if($body){
        $body.css({
            transform:'translateY(0px)'
        })
    }
};

ScrollPlayer.prototype.scrollHint = function(){
    var self = this;
    var currentScene = this.scenes[this.sceneTick];
    var scrollY = this.currentScroll * -1;
    if(scrollY < 0){
        var $thisBody = currentScene.$body;
        if($thisBody){
            $thisBody.toggleClass('resetting', false);
            $thisBody.css({
                transform: 'translateY(' + scrollY+'px)'
            });
            if(this.scrollGravityTimer){
                clearTimeout(this.scrollGravityTimer);
            }
            this.scrollGravityTimer = setTimeout(function(){
                $thisBody.toggleClass('resetting', true);
                $thisBody.css({transform:'translateY(0px)'});
                self.currentScroll = 0;
            }, 260)
        }
    }

};

ScrollPlayer.prototype.keyListener = function(e){
    if(e.keyCode === 39 || e.keyCode === 40){
        this.advance();
    }
    if(e.keyCode === 37 || e.keyCode === 38){
        this.rewind();
    }
};

ScrollPlayer.prototype.touchListener = function(e, startOrStop){
    if(!this.suppressed) {
        var touchedObj = e.changedTouches[0];
        var threshold = 20;
        if(startOrStop==='move'){
            var distance =  touchedObj.pageY - this.startY;
            if(Math.abs(distance) > threshold){
                if(distance>0){
                    this.rewind();
                }
                else{
                    this.advance();
                }
            }
        }
        if(startOrStop==='start'){
            this.startY = touchedObj.pageY;
        }
        if(startOrStop==='stop'){
            /*var distance =  touchedObj.pageY - this.startY;
            if(Math.abs(distance) > threshold){
                if(distance>0){
                    this.rewind();
                }
                else{
                    this.advance();
                }
            }*/
        }
    }
};

ScrollPlayer.prototype.listen = function(){
    var self = this;
    document.addEventListener("wheel", function(e){
        self.scrollListener(e)
    });
    document.addEventListener("mousewheel", function(e){
        self.scrollListener(e)
    }, false);
    document.addEventListener("keydown", function(e){
        self.keyListener(e)
    });
    document.addEventListener("touchstart",function (e) {
        self.touchListener(e, 'start');
    },true);
    document.addEventListener("touchmove",function (e) {
        self.touchListener(e, 'move');
    },true);
    document.addEventListener("touchend",function (e) {
        self.touchListener(e, 'stop');
    },true);
};

ScrollPlayer.prototype.advanceToNamedScene = function(scene){
    if(this.sceneMap.hasOwnProperty(scene)){
        var sceneIndex = this.sceneMap[scene];
        this.jumpToScene(sceneIndex);
    }
};

ScrollPlayer.prototype.jumpToScene = function(destination){
    var self = this;
    var startScene = self.sceneTick;
    if(self.scenes[destination]){
        var sceneDelta = destination - startScene;
        var direction = sceneDelta > 0 ? 1 : -1;
        this.updateURL(destination);
        skipIterator(startScene, function(){
            self.renderCompleted(destination);
        });
    }

    function easedDuration(step, totalSteps){
        if(totalSteps - step === 0 || step ===1){
            return self.pace/2;
        }
        if(totalSteps - step ===1 || step ===2){
            return 0
        }
        return 0;
    }

    function skipIterator(i, complete){
        if(i !== destination){
            var nextTick = i + direction;
            var currentScene = self.scenes[i];
            var nextScene = self.scenes[nextTick];
            var increment = Math.abs(sceneDelta) - Math.abs(destination - i) + 1;
            var eased = easedDuration(increment,Math.abs(sceneDelta));
            self.transitionScenes(direction,currentScene,nextScene,eased,function(){
                self.animationState = 0;
                skipIterator(i+direction, complete);
            })
        }
        else{
            complete();
        }
    }
};

ScrollPlayer.prototype.suppress = function(){
    clearTimeout(this.suppressionTimeout);
    this.pauseListener();
    var self = this;
    this.suppressionTimeout = setTimeout(function(){
        self.resumeListener();
    },500)
};

ScrollPlayer.prototype.pauseListener = function(){
    this.suppressed = true;
};

ScrollPlayer.prototype.resumeListener = function(){
    this.suppressed = false;
};
