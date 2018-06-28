SceneController.prototype.scene2 = function(){
    var self = this;
    var displayed = false;
    var scene2 = this.Scrolling.scene();
    var $scene2 = $('#scene-2');

    //var $img = $scene2.find('.photo-eric');
    var $panel = $scene2.find('.photo-panel');
    var $morphPanel = $scene2.find('.morph-photos');
    var $bioText = $scene2.find('.bio-text');
    var $terminal = $bioText .find('.terminal');
    var $skillsContent = $scene2.find('.skills .content');
    //var src = 'assets/img/portrait_5.jpg';

    //var glitch = new Glitchy($img,$panel, src);
    var morphPhotos = new PhotoMorph($morphPanel);
    var terminalTypeout = new TerminalTypeout($terminal);
    terminalTypeout.completionCallbacks = [loadPhotoPanel,displayCV, loadSkills,displayQuotes];

    var bloomingSkills = new BloomingSkills($skillsContent);

    var unfoldingCards = new UnfoldingCards($scene2);
    unfoldingCards.cardCallbacks = [paintTerminal];

    var timeouts = [];

    scene2.$body = $scene2;
    scene2.duration = 1000;

    scene2.transIn = function(direction, duration, callback){
        function loadSceneForward(){
            //this.transitionSceneContainer($scene,direction,duration,function(){});
            if(duration !== 0){
                var unfold = setTimeout(function(){
                    unfoldingCards.animateOpen(duration)
                }, 250);
                timeouts.push(unfold);
                if(displayed){
                    restartAnimations()
                }
                SiteTracking.trackPageLoad('About');
                self.Cases.hideTab();
            }
            callback();
        }

        function loadSceneBackwards(){
            if(duration !== 0){
                var unfold = setTimeout(function(){
                    unfoldingCards.animateOpen(duration)
                }, 250);
                timeouts.push(unfold);
                if(displayed){
                    restartAnimations()
                }
                SiteTracking.trackPageLoad('About');
                self.Cases.hideTab();
            }
            self.transitionSceneContainer($scene2,direction,duration,function () {
                callback();
            });
        }

        switch (direction) {
            case 1: loadSceneForward();
                break;
            case -1: loadSceneBackwards();
                break;
        }
    };

    scene2.transOut = function(direction, duration, callback){
        function unloadSceneForward(){
            cancelTimeouts();
            stopAnimations();
            if(!displayed){
                unfoldingCards.resetCards()
            }
            self.transitionSceneContainer($scene2,direction,duration,function(){
                callback();
            });
        }

        function unloadSceneBackwards(){
            //this.transitionSceneContainer($scene,direction,duration,function () {});
            cancelTimeouts();
            stopAnimations();
            if(!displayed){
                unfoldingCards.resetCards()
            }
            morphPhotos.stop();
            callback();
        }

        switch (direction) {
            case 1: unloadSceneForward();
                break;
            case -1: unloadSceneBackwards();
                break;
        }
    };

    function paintTerminal(){
        if(!displayed){
            terminalTypeout.animate(40,600,function(){
                displayed = true;
            })
        }
    }

    function displayQuotes(){
        $scene2.find('.line-out').fadeOut();
        $scene2.find('.final-quotes').toggleClass('displayed', true);
        cycleQuotes();
    }

    function cancelTimeouts(){
        for(var i =0 ; i< timeouts.length ; i++){
            clearTimeout(timeouts[i]);
        }
        timeouts =[];
    }

    function loadPhotoPanel(){
        $morphPanel.toggleClass('hidden', false);
        $panel.remove();
        morphPhotos.start(7000,3000);

        /*$panel.toggleClass('visible', true);
        $morphPanel.toggleClass('hidden', false);
        glitch.startEffect();
        setTimeout(function(){
            glitch.stopEffect();
            $panel.remove();
            morphPhotos.start();
        }, 800);*/

    }

    function loadSkills(){
        bloomingSkills.animate(function(){
            $scene2.find('.skills').toggleClass('loaded', true);
            bloomingSkills.startRandomHighlights()
        })
    }

    function bindScrollSuppression(){
        $scene2.find('.qualifications .content').bind('scroll', function(){
            self.Scrolling.suppress();
        })
    }

    function displayCV(){
        $scene2.find('.qualifications .block').each(function(index){
            doSetQualTimeout(index, $(this));
        });
        function doSetQualTimeout(i, $target){
            setTimeout(function(){
                $target.toggleClass('show', true);
            }, i * 300 + Math.random()*300);
        }
    }

    function cycleQuotes(){
        var $q = $scene2.find('.final-quotes .quote');
        function recursive(i){
            $q.removeClass('active').eq(i).addClass('active');
            var timer = setTimeout(function(){
                recursive(++i % $q.length)
            },8000);
            timeouts.push(timer)
        }
        recursive(0);
    }

    function restartAnimations() {
        bloomingSkills.startRandomHighlights();
        cycleQuotes();
        morphPhotos.start()
    }

    function stopAnimations(){
        unfoldingCards.stopAnimation();
        bloomingSkills.stopRandomHighlights();
        morphPhotos.stop();
    }

    bindScrollSuppression();
    return scene2;
};

