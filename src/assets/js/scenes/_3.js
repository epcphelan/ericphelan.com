SceneController.prototype.scenes3 = function(){
    var selfController = this;
    var $scene3 = $('#scene-3');
    var subScenes = 'abcefgh'.split('');
    var firstSubScene = 'a';
    var lastSubScene = 'h';
    var transitionDurations = 500;
    var scenes3 = {};
    var $timeframes3 = {};
    var $timelineMarkers3 = {};
    var subSceneInPostCallbacks ={};
    var subSceneOutPostCallbacks ={};
    var subSceneInPreCallbacks ={};
    var subSceneOutPreCallbacks ={};
    var flipBoxImgArray_3c = [
        'http://assets.ericphelan.com/img/flipboards/1.jpg',
        'http://assets.ericphelan.com/img/flipboards/2.jpg',
        'http://assets.ericphelan.com/img/flipboards/3.jpg',
        'http://assets.ericphelan.com/img/flipboards/4.jpg',
        'http://assets.ericphelan.com/img/flipboards/5.jpg',
        'http://assets.ericphelan.com/img/flipboards/6.jpg',
        'http://assets.ericphelan.com/img/flipboards/7.jpg',
        'http://assets.ericphelan.com/img/flipboards/8.jpg',
        'http://assets.ericphelan.com/img/flipboards/9.jpg',
        'http://assets.ericphelan.com/img/flipboards/10.jpg',
        'http://assets.ericphelan.com/img/flipboards/11.jpg',
        'http://assets.ericphelan.com/img/flipboards/12.jpg',
        'http://assets.ericphelan.com/img/flipboards/13.jpg',
        'http://assets.ericphelan.com/img/flipboards/14.jpg',
        'http://assets.ericphelan.com/img/flipboards/15.jpg',
        'http://assets.ericphelan.com/img/flipboards/16.jpg',
        'http://assets.ericphelan.com/img/flipboards/17.jpg',
        'http://assets.ericphelan.com/img/flipboards/18.jpg',
        'http://assets.ericphelan.com/img/flipboards/19.jpg',
        'http://assets.ericphelan.com/img/flipboards/20.jpg',
        'http://assets.ericphelan.com/img/flipboards/21.jpg',
        'http://assets.ericphelan.com/img/flipboards/22.jpg',
        'http://assets.ericphelan.com/img/flipboards/23.jpg'
    ];
    var flipBoxImgFinalArray_3c = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,1,2,3,4,5,6,7,8,9,10];
    var flipBoxes_3c = [];
    var _3bTilters = null;
    var flipBoxImgArray_3i = [
        'http://assets.ericphelan.com/img/flipboards/stock/1.png',
        'http://assets.ericphelan.com/img/flipboards/stock/2.png',
        'http://assets.ericphelan.com/img/flipboards/stock/3.png',
        'http://assets.ericphelan.com/img/flipboards/stock/4.png',
        'http://assets.ericphelan.com/img/flipboards/stock/5.png',
        'http://assets.ericphelan.com/img/flipboards/stock/6.png',
        'http://assets.ericphelan.com/img/flipboards/stock/7.png',
        'http://assets.ericphelan.com/img/flipboards/stock/8.png',
        'http://assets.ericphelan.com/img/flipboards/stock/9.png',
        'http://assets.ericphelan.com/img/flipboards/stock/10.png',
        'http://assets.ericphelan.com/img/flipboards/stock/11.png',
        'http://assets.ericphelan.com/img/flipboards/stock/12.png',
        'http://assets.ericphelan.com/img/flipboards/stock/13.png'
    ];
    var flipBoxes_3i = [];
    var shootingStar = null;
    var _3aBackgroundImg = $scene3.find('._3a-background');
    var _3eBackgroundImg = $scene3.find('._3e-background');
    var _3gBackgroundImg = $scene3.find('._3g-background');
    var _3hBackgroundImg = $scene3.find('._3h-background');
    var _$3bPeekABoo = $scene3.find('._3b .peek-a-boo');
    var _$3fPeekABoo = $scene3.find('._3f .peek-a-boo');

// SubScenes
    //3a Home
    subSceneInPostCallbacks.a = function(direction,duration, callback){
        if(duration === 0){
            callback()
        }
        else{
            SiteTracking.trackPageLoad('Work Home');
            togglePageClass('work-intro', true);
            setTimeout(function(){floatingBackground_3a.start();},300);
            $scene3.find('._3a .shell .blurb').toggleClass('open',true);
            callback();
        }
    };
    subSceneOutPreCallbacks.a = function(direction, duration, callback){
        togglePageClass('work-intro', false);
        callback();
    };
    subSceneOutPostCallbacks.a = function(direction,duration, callback){
        floatingBackground_3a.stop();
        callback();
    };
    subSceneInPreCallbacks.a = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            if(direction===-1) {
                setTimeout(callback, duration);
            }
            else{
                callback();
            }
        }
    };

    //3b Glam & Go
    subSceneInPreCallbacks.b = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            selfController.Cases.setCase('glamAndGo');
            togglePageClass('glam-and-go', true);
            if(direction===1){
                $scene3.find('._3b .glamandgo_tag').css({
                    bottom:'-50px',
                    opacity:0
                });
                peek_a_boo_3b.stageDown();
                peek_a_boo_3b.openUp(duration * (duration < 300 ? 0.5 : 2));
                callback();
            }
            if(direction===-1){
                $scene3.find('._3b .glamandgo_tag').css({
                    bottom:'200px',
                    opacity:0
                });
                peek_a_boo_3b.stageUp();
                peek_a_boo_3b.openDown(duration * (duration < 300 ? 0.5 : 2));
                setTimeout(callback, duration);
            }
        }
    };
    subSceneInPostCallbacks.b = function(direction,duration, callback){
        if(duration===0){
            callback()
        }
        else{
            selfController.Cases.setTabTimer();
            SiteTracking.trackPageLoad('Glam & Go Summary');
            if(direction===1){
                // peek_a_boo_3b.openUp(duration * (duration < 300 ? 0.5 : 2));
                callback();
            }
            if(direction===-1){
                //peek_a_boo_3b.openDown(duration * (duration < 300 ? 0.5 : 2));
                callback();
            }
            selfController.Cases.loadCase();
            setTimeout(function(){
                $scene3.find('._3b .glamandgo_tag').animate({
                    bottom: '20px',
                    opacity: 1
                }, duration * 1);
                _3bTilters = $scene3.find('._3b .columns .content').tilt({
                    glare: true,
                    maxGlare: .25,
                    scale: 1.05,
                    maxTilt:        15,
                    perspective:    1000,
                    easing:         "cubic-bezier(.03,.98,.52,.99)",
                    transition:     true
                });
            }, duration)
        }
    };
    subSceneOutPreCallbacks.b = function(direction,duration, callback){
        selfController.Cases.hideTab();
        if(duration===0){
            togglePageClass('glam-and-go', false);
            callback()
        }
        else{
            if(_3bTilters){
                _3bTilters.tilt.destroy.call(_3bTilters);
            }
            togglePageClass('glam-and-go', false);
            if(direction===1){
                peek_a_boo_3b.closeUp(duration);
                setTimeout(callback,duration);
            }
            if(direction===-1){
                peek_a_boo_3b.closeDown(duration);
                setTimeout(callback,duration);
            }
            $scene3.find('._3b .glamandgo_tag').animate({
                bottom: '20px',
                opacity: 0
            }, duration/2);
            $scene3.find('._3b .header_bar').animate({
                top: '30px',
                opacity: 1
            }, duration * 2);
        }
    };
    subSceneOutPostCallbacks.b=function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            selfController.Cases.hideTab();
            setTimeout(callback,duration);
        }
    };

    //3c Assorted Projects
    subSceneInPreCallbacks.c = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else{
            if(direction===1){
                setTimeout(callback,duration);
            }
            else{
                callback();
            }
        }
    };
    subSceneInPostCallbacks.c = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else{
            SiteTracking.trackPageLoad('Assorted Projects Summary');
            flipBoxes_3c.forEach(function(box, index){
                setTimeout(function(){
                    box.animate(6);
                }, Math.random()*1.2 * duration);
            });
            setTimeout(function(){
                $scene3.find('._3c .box').tilt({
                    glare: false,
                    scale: 1.03,
                    maxTilt:        15,
                    perspective:    1000,
                    easing:         "cubic-bezier(.03,.98,.52,.99)",
                    transition:     true
                });
            }, duration);
            callback();
        }
    };
    subSceneOutPreCallbacks.c = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else{
            setTimeout(function(){
                callback();
            }, duration);
            flipBoxes_3c.forEach(function(box){
                setTimeout(function(){
                    box.flush(direction);
                }, Math.random() * duration);
            });
        }
    };
    subSceneOutPostCallbacks.c = function(direction, duration, callback){
        callback();
    };

    //3e Springshot
    subSceneInPreCallbacks.e = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            setTimeout(callback, duration);
        }
    };
    subSceneInPostCallbacks.e = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            SiteTracking.trackPageLoad('Springshot Summary');
            selfController.Cases.setCase('springshot');
            selfController.Cases.loadCase();
            selfController.Cases.setTabTimer();
            setTimeout(function(){floatingBackground_3e.start();},300);
            $scene3.find('._3e .shell .blurb').toggleClass('open',true);
            shootingStar.startShow(7500);
            callback();
        }
    };
    subSceneOutPreCallbacks.e = function(direction, duration, callback){
        selfController.Cases.hideTab();
        if(duration===0){
            callback();
        }
        else{
            callback();
        }
    };
    subSceneOutPostCallbacks.e = function(direction,duration, callback){
        shootingStar.stopShow();
        if(duration===0){
            callback();
        }
        else{
            floatingBackground_3e.stop();
            $scene3.find('._3e .shell .blurb').toggleClass('open',false);
            callback();
        }
    };

    //3f ipplicant
    subSceneInPreCallbacks.f = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            selfController.Cases.setCase('ipplicant');
            if(direction===1){
                peek_a_boo_3f.stageDown();
                peek_a_boo_3f.openUp(duration * (duration < 300 ? 0.5 : 2));
                callback();
            }
            if(direction===-1){
                peek_a_boo_3f.stageUp();
                peek_a_boo_3f.openDown(duration * (duration < 300 ? 0.5 :2));
                setTimeout(callback, duration);
            }
        }
    };
    subSceneInPostCallbacks.f = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            selfController.Cases.loadCase();
            selfController.Cases.setTabTimer();
            SiteTracking.trackPageLoad('ipplicant Summary');
            if(direction===1){
                //peek_a_boo_3f.openUp(duration * (duration < 300 ? 0.5 : 2));
                callback();
            }
            if(direction===-1){
                //peek_a_boo_3f.openDown(duration * (duration < 300 ? 0.5 : 2));
                callback();
            }
        }
    };
    subSceneOutPreCallbacks.f = function(direction,duration, callback){
        selfController.Cases.hideTab();
        if(duration===0){
            callback();
        }
        else{
            if(direction===1){
                peek_a_boo_3f.closeUp(duration);
                setTimeout(callback,duration);
            }
            if(direction===-1){
                peek_a_boo_3f.closeDown(duration);
                setTimeout(callback,duration);
            }
        }
    };
    subSceneOutPostCallbacks.f=function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            setTimeout(callback,duration);
        }
    };

    //3g epiSampler
    subSceneInPreCallbacks.g = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            selfController.Cases.setCase('epiSampler');
            $scene3.find('._3g .blurb .fly-in').css({transform:'translateX(-2000px)'});
            if(direction===1){
                $scene3.find('._3g .logos img').toggleClass('below', true);
                $scene3.find('._3g .logos img').toggleClass('above', false);
                setTimeout(callback, duration);
            }
            else{
                $scene3.find('._3g .logos img').toggleClass('above', true);
                $scene3.find('._3g .logos img').toggleClass('below', false);
                callback();
            }
        }
    };
    subSceneInPostCallbacks.g = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            SiteTracking.trackPageLoad('epiSampler Summary');
            selfController.Cases.loadCase();
            setTimeout(function(){floatingBackground_3g.start();},300);
            $scene3.find('._3g .shell .blurb').toggleClass('open',true);
            $scene3.find('._3g .blurb .fly-in').each(function(){
                var self = this;
                setTimeout(function(){
                    $(self).css({
                        transform:'translateX(0)'
                    })
                }, Math.random() * duration);
            });
            if(direction===1){
                $scene3.find('._3g .logos img').each(function(){
                    var self = this;
                    setTimeout(function(){
                        $(self).toggleClass('below',false);
                    }, Math.random() * duration);
                });
            }
            else{
                $scene3.find('._3g .logos img').each(function(){
                    var self = this;
                    setTimeout(function(){
                        $(self).toggleClass('above', false);
                    }, Math.random() * duration );
                });
            }
            callback();
        }
    };
    subSceneOutPostCallbacks.g = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            floatingBackground_3g.stop();
            $scene3.find('._3g .blurb .fly-in').css({transform:'translateX(-2000px)'});
            callback();
        }
    };
    subSceneOutPreCallbacks.g = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else{
            $scene3.find('._3g .blurb .fly-in').each(function(){
                var self = this;
                setTimeout(function(){
                    $(self).css({
                        transform:'translateX(2000px)'
                    })
                }, Math.random() * duration);
            });
            if(direction===1){
                $scene3.find('._3g .logos img').each(function(){
                    var self = this;
                    setTimeout(function(){
                        $(self).toggleClass('above',true);
                    }, Math.random() * duration );
                });
            }
            else{
                $scene3.find('._3g .logos img').each(function(){
                    var self = this;
                    setTimeout(function(){
                        $(self).toggleClass('below', true);
                    }, Math.random() * duration );
                });
            }
            setTimeout(callback, duration);
        }
    };

    //3h Lassa
    subSceneInPreCallbacks.h = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            selfController.Cases.setCase('lassa');
            setTimeout(callback, duration);
        }
    };
    subSceneInPostCallbacks.h = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            SiteTracking.trackPageLoad('Lassa Summary');
            setTimeout(function(){floatingBackground_3h.start();},300);
            $scene3.find('._3h .shell .blurb').toggleClass('open',true);
            selfController.Cases.loadCase();
            selfController.Cases.setTabTimer();
            callback();
        }
    };
    subSceneOutPreCallbacks.h = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else{
            $scene3.find('._3h .shell .blurb').toggleClass('open',false);
            selfController.Cases.hideTab();
            callback();
        }
    };
    subSceneOutPostCallbacks.h = function(direction,duration, callback){
        if(duration===0){
            callback();
        }
        else{
            floatingBackground_3h.stop();
            callback();
        }
    };

    //3h Finance
    subSceneInPreCallbacks.i = function(direction, duration, callback){
        selfController.Cases.hideTab();
        callback();
    };
    subSceneInPostCallbacks.i = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else{
            SiteTracking.trackPageLoad('Finance Summary');
            flipBoxes_3i.forEach(function(box){
                setTimeout(function(){
                    box.animate(6);
                }, Math.random()*1.2 * duration);
            });
            setTimeout(function(){
                // $scene3.find('._3c .background').toggleClass('gradient', true);
            }, duration);
            callback();
        }
    };
    subSceneOutPreCallbacks.i = function(direction, duration, callback){
        if(duration===0){
            callback();
        }
        else {
            setTimeout(function () {
                callback();
            }, duration);
            flipBoxes_3i.forEach(function (box) {
                setTimeout(function () {
                    box.flush(direction);
                }, Math.random() * duration);
            });
        }
    };
    subSceneOutPostCallbacks.i = function(direction, duration, callback){
        callback();
    };

// INIT
    function makeScenes(){
        subScenes.forEach(function(sub){
            scenes3[sub] = selfController.Scrolling.scene();
        });
    }

    function makeTimeframes(){
        subScenes.forEach(function(sub){
            $timeframes3[sub] = $scene3.find('.right-display-container .scene-3'+sub);
        })
    }

    function makeTimelineMarkers(){
        subScenes.forEach(function(sub){
            $timelineMarkers3[sub] = $scene3.find('.left-timeline .scene-3'+sub);
        })
    }

    function setDurations(){
        for(var key in scenes3){
            if(scenes3.hasOwnProperty(key)){
                var scene = scenes3[key];
                scene.duration = transitionDurations;
            }
        }
    }

    function setDefaultTransitions(){
        for(var key in scenes3){
            if(scenes3.hasOwnProperty(key)){
                var scene = scenes3[key];
                if(key===lastSubScene){
                    scene.transIn = makeLastTransIn($timeframes3[key], $timelineMarkers3[key],$scene3, subSceneInPreCallbacks[key],subSceneInPostCallbacks[key]);
                    scene.transOut = makeLastTransOut($timeframes3[key], $timelineMarkers3[key],$scene3, subSceneOutPreCallbacks[key],subSceneOutPostCallbacks[key]);
                    //scene.$body = $scene3;
                }
                else if (key === firstSubScene){
                    scene.transIn = makeFirstTransIn($timeframes3[key], $timelineMarkers3[key],$scene3, subSceneInPreCallbacks[key],subSceneInPostCallbacks[key]);
                    scene.transOut = makeFirstTransOut($timeframes3[key], $timelineMarkers3[key],$scene3, subSceneOutPreCallbacks[key],subSceneOutPostCallbacks[key]);
                    //scene.$body = $timeframes3[key];
                }
                else{
                    scene.transIn = makeDefaultTransIn($timeframes3[key], $timelineMarkers3[key],$scene3, subSceneInPreCallbacks[key],subSceneInPostCallbacks[key]);
                    scene.transOut = makeDefaultTransOut($timeframes3[key], $timelineMarkers3[key],$scene3, subSceneOutPreCallbacks[key],subSceneOutPostCallbacks[key]);
                    //scene.$body = $timeframes3[key];
                }
            }
        }
    }

    function makeFlipBoards(){
        $scene3.find('._3c .flipbox').each(function(index){
            var fb = new FlipBoard($(this),flipBoxImgArray_3c,flipBoxImgFinalArray_3c[index]);
            flipBoxes_3c.push(fb);
        });
        $scene3.find('._3i .flipbox').each(function(index){
            var fb = new FlipBoard($(this),flipBoxImgArray_3i,Math.floor(Math.random() * flipBoxImgArray_3i.length));
            flipBoxes_3i.push(fb);
        })
    }

    makeScenes();
    makeTimeframes();
    makeTimelineMarkers();
    setDurations();
    setDefaultTransitions();
    makeFlipBoards();

    var floatingBackground_3a = new FloatingHero(_3aBackgroundImg);
    var floatingBackground_3e = new FloatingHero(_3eBackgroundImg);
    var floatingBackground_3g = new FloatingHero(_3gBackgroundImg);
    var floatingBackground_3h = new FloatingHero(_3hBackgroundImg);

    var peek_a_boo_3b = new PeekABooTwo(_$3bPeekABoo);
    var peek_a_boo_3f = new PeekABooTwo(_$3fPeekABoo);

    shootingStar = new ShootingStar($scene3.find('._3e .shell'));
    new FlipSquare($scene3.find('._3i .container'));
    var _3fMediaPlayer = new MediaPlayer($('#ipplicant-demo'),'ipplicant-demo-video');
    _3fMediaPlayer.bindClick($('.ipplicant-demo-play'));

    pushTimeframesBelowScene();


// Animation

    function pushTimeframesBelowScene(){
        $scene3.find('.start-offscreen').css({
            top:'3000px'
        });
    }
    function updateMenuIndicator(){
        $scene3.find('.timeline li').each(function(){
            if($(this).hasClass(('active'))){
                var top = $(this).offset().top - 15;
                setMarkerToTop(top)
            }
        });
        function setMarkerToTop(top){
            $scene3.find('.line-wrap .line-marker').css({
                top: top
            })
        }

    }
    function togglePageClass(className, bool){
        $('body').toggleClass(className,bool);
    }

// Default Methods

    function makeDefaultTransIn($timeframe, $timelineMarker, $scene, subScenePreAnimation, subScenePostAnimation){
        return function(direction, duration, callback){
            $timelineMarker.toggleClass('active', true);
            timelineFrameTransition(
                $timeframe,
                $scene,
                'in',
                direction,
                duration,
                subScenePreCallback(subScenePreAnimation,direction,duration),
                subScenePostCallback(subScenePostAnimation,direction,duration,callback)
            );
        };
    }

    function makeDefaultTransOut($timeframe, $timelineMarker, $scene, subScenePreAnimation, subScenePostAnimation){
        return function(direction, duration, callback){
            $timelineMarker.toggleClass('active', false);
            selfController.Cases.hideTab();
            timelineFrameTransition(
                $timeframe,
                $scene,
                'out',
                direction,
                duration,
                subScenePreCallback(subScenePreAnimation,direction,duration),
                subScenePostCallback(subScenePostAnimation,direction,duration,callback)
            );
        };
    }

    function makeFirstTransIn($timeframe, $timelineMarker, $scene, subScenePreAnimation, subScenePostAnimation){
        var transIn = function(direction, duration, callback){

            $timelineMarker.toggleClass('active', true);

            function loadSceneForward(){
                //timelineFrameTransition($timeframe, $scene, 'in', 1, duration, subSceneCallback)
                subScenePreCallback(subScenePreAnimation,direction, duration)(function(){
                    subScenePostCallback(subScenePostAnimation,direction,duration,callback)();
                });
            }

            function loadSceneBackwards(){
                timelineFrameTransition(
                    $timeframe,
                    $scene,
                    'in',
                    -1,
                    duration,
                    subScenePreCallback(subScenePreAnimation,direction,duration),
                    subScenePostCallback(subScenePostAnimation,direction,duration,callback)
                );
                //selfController.transitionSceneContainer($scene,direction,duration,subSceneCallback);
            }

            switch (direction) {
                case 1: loadSceneForward();
                    break;
                case -1: loadSceneBackwards();
                    break;
            }
        };
        return transIn;
    }

    function makeFirstTransOut($timeframe, $timelineMarker, $scene, subScenePreAnimation, subScenePostAnimation){
        var transOut = function(direction, duration, callback){

            $timelineMarker.toggleClass('active', false);

            function unloadSceneForward(){
                // subSceneCallback();
                timelineFrameTransition(
                    $timeframe,
                    $scene,
                    'out',
                    1,
                    duration,
                    subScenePreCallback(subScenePreAnimation,direction, duration),
                    subScenePostCallback(subScenePostAnimation,direction,duration,callback)
                )
            }

            function unloadSceneBackwards(){
                // timelineFrameTransition($timeframe, $scene, 'out', -1, duration, subSceneCallback)
                subScenePreCallback(subScenePreAnimation,direction,duration)(function(){
                    subScenePostCallback(subScenePostAnimation,direction,duration,callback)();
                });
            }
            switch (direction) {
                case 1: unloadSceneForward();
                    break;
                case -1: unloadSceneBackwards();
                    break;
            }
        };
        return transOut;
    }

    function makeLastTransIn($timeframe, $timelineMarker, $scene, subScenePreAnimation, subScenePostAnimation){
        var transOut = function(direction, duration, callback){

            $timelineMarker.toggleClass('active', true);

            function loadSceneForward(){
                timelineFrameTransition(
                    $timeframe,
                    $scene,
                    'in',
                    1,
                    duration,
                    subScenePreCallback(subScenePreAnimation,direction, duration),
                    subScenePostCallback(subScenePostAnimation,direction,duration, callback)
                )
            }

            function loadSceneBackwards(){
                selfController.transitionSceneContainer(
                    $scene,
                    direction,
                    duration,
                    subScenePostCallback(subScenePostAnimation,direction,duration,callback)
                );
            }

            switch (direction) {
                case 1: loadSceneForward();
                    break;
                case -1: loadSceneBackwards();
                    break;
            }
        };
        return transOut;
    }

    function makeLastTransOut($timeframe, $timelineMarker, $scene, subScenePreAnimation, subScenePostAnimation){
        var transOut = function(direction, duration, callback){

            $timelineMarker.toggleClass('active', false);

            function unloadSceneForward(){
                subScenePreCallback(subScenePreAnimation, direction, duration)(
                    function(){
                        selfController.transitionSceneContainer(
                            $scene,
                            direction,
                            duration,
                            subScenePostCallback(subScenePostAnimation,direction,duration,callback)
                        );
                    }
                );
            }

            function unloadSceneBackwards(){
                timelineFrameTransition(
                    $timeframe,
                    $scene,
                    'out',
                    -1,
                    duration,
                    subScenePreCallback(subScenePreAnimation,direction,duration),
                    subScenePostCallback(subScenePostAnimation,direction,duration,callback)
                )
            }
            switch (direction) {
                case 1: unloadSceneForward();
                    break;
                case -1: unloadSceneBackwards();
                    break;
            }
        };
        return transOut;
    }

// Utility Methods

    function timelineFrameTransition($frame, $scene, inOut, direction, duration, preAnimation, postAnimationCallback){
        var top = '0px';
        var sceneHeight = $scene.css('height');

        preAnimation(function(){
            if(inOut ==="out"){
                if(direction === 1){
                    top = '-' + sceneHeight;
                }
                else{
                    top = sceneHeight ;
                }
            }
            else{
                if(direction === 1){
                    $frame.css({top:sceneHeight})

                }
                else{
                    $frame.css({top:'-'+sceneHeight})
                }
            }
            if(duration>0){
                $frame.animate({
                    top: top
                }, duration, function(){
                    if(top.replace('px','')<0){
                        $(this).css({top:selfController.wayOffNorth});
                    }
                    else if(top.replace('px','')>0){
                        $(this).css({top:selfController.wayOffSouth});
                    }
                    postAnimationCallback();
                });
            }
            else{
                if(top.replace('px','')<0){
                    $frame.css({top:selfController.wayOffNorth});
                }
                else if(top.replace('px','')>0){
                    $frame.css({top:selfController.wayOffSouth});
                }
                else{
                    $frame.css({top:top});
                }
                postAnimationCallback();
            }
            updateMenuIndicator();
        });
    }
    function subScenePostCallback(subScene, direction, duration, callback){
        if(subScene){
            return function(){
                subScene(direction, duration, callback)
            }
        }
        else{
            return function() {
                callback();
            }
        }
    }
    function subScenePreCallback(subScene,direction, duration){
        if(subScene){
            return function(callback){
                subScene(direction, duration, callback)
            }
        }
        else{
            return function(callback) {
                callback();
            }
        }
    }
    return scenes3;
};

