SceneController.prototype.scene4 = function(){
    var self = this;
    var scene4 = this.Scrolling.scene();
    scene4.duration = 1000;
    var $scene4 = $('#scene-4');


    scene4.transIn = function(direction, duration, callback){
        function loadSceneForward(){
            //this.transitionSceneContainer($scene4,direction,duration,function(){});
            SiteTracking.trackPageLoad('Contact');
            turnOnPhone();
            zoomMap(500);
            $('body').toggleClass('contact', true);
            callback();
        }

        function loadSceneBackwards(){
            SiteTracking.trackPageLoad('Contact');
            callback();
        }

        switch (direction) {
            case 1: loadSceneForward();
                break;
            case -1: loadSceneBackwards();
                break;
        }
    };

    scene4.transOut = function(direction, duration, callback){

        function unloadSceneForward(){
            callback();
        }

        function unloadSceneBackwards(){
            $('body').toggleClass('contact', false);
            //this.transitionSceneContainer($scene,direction,duration,function () {});
            callback();
            //this.transitionSceneContainer($scene4,direction,duration,function(){});
        }

        switch (direction) {
            case 1: unloadSceneForward();
                break;
            case -1: unloadSceneBackwards();
                break;
        }
    };

    function turnOnPhone(){
        setTimeout(function(){
            $scene4.find('.contact-phone .loading-mask').toggleClass('on', true)
        }, 2000);
        setTimeout(function(){
            $scene4.find('.contact-phone .loading-mask').fadeOut(function(){
                $(this).hide();
            })
        }, 4500)

    }



    /// Messaging

    function bindSend(){
        $scene4.find('.send-button').click(sendMessage)
    }

    function sendMessage(){
        if(validMessageForm()){
            $scene4.find('.contact-phone .sending-mask').fadeIn();
            var email = $scene4.find('#contact-email').val();
            var name = $scene4.find('#contact-name').val();
            var body = $scene4.find('#contact-message').val();
            ajaxSendMessage(email,name,body,function(res){
                if(res.success){
                    animateMessageSuccess();
                }
                else{
                    animateMessageFailure()
                }
            })
        }
    }

    function animateMessageSuccess(){
        $scene4.find('.contact-phone .sending-mask').fadeOut();
        $scene4.find('.contact-phone .form-container form').css({
            transform:"translateY(-100%)"
        });
        setTimeout(function(){
            $scene4.find('.contact-phone .success-background').fadeIn('slow');
        },800)
    }

    function animateMessageFailure(){
        $scene4.find('.contact-phone .sending-mask').fadeOut();
        $scene4.find('.contact-phone .form-container form').css({
            transform:"translateY(-100%)"
        });
        setTimeout(function(){
            $scene4.find('.contact-phone .failure-background').fadeIn('slow');
        },800)
    }

    function validMessageForm(){
        var $email = $scene4.find('#contact-email');
        var $body = $scene4.find('#contact-message');
        $body.toggleClass('invalid', false);
        $email.toggleClass('invalid', false);
        if(!validEmail($email.val())){
            $email.toggleClass('invalid', true);
            return false;
        }
        if(!$body.val().length >0){
            $body.toggleClass('invalid', true);
            return false;
        }

        return true;
    }

    function validEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function ajaxSendMessage(email, name, body, callback){
        $.post('api/email',{email:email, name:name, body:body}, function(data){
            callback(data);
        })
    }

    function resetPhone(){
        $scene4.find('.contact-phone .loading-mask').show();
    }

    function zoomMap(delay){
        setTimeout(function(){
            $scene4.find('.map').css({
                transform:'scale(1) rotate(00deg)'
            })
        }, delay?delay:0)

    }

    function resetMap(){

    }


    bindSend();
    return scene4;
};

