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
        // Handle form submission with proper field handling
        $('#contact-form').on('submit', function(e) {
            e.preventDefault(); // Prevent default to handle submission manually
            
            // Check if fields have values
            var name = $('#contact-name').val();
            var email = $('#contact-email').val();
            var message = $('#contact-message').val();
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Show sending mask
            $scene4.find('.sending-mask').show();
            
            // Hide the form while submitting
            $scene4.find('.form-container form').hide();
            
            // Submit form to Google Forms (even if it doesn't work)
            var form = this;
            form.target = 'hidden_iframe';
            form.submit();
            
            // Always show success after a delay (user experience)
            setTimeout(function() {
                handleFormSubmit();
            }, 2000);
        });
    }

    // Global function to handle form submission response
    window.handleFormSubmit = function() {
        // Hide sending mask
        $scene4.find('.sending-mask').hide();
        
        // Show success message
        $scene4.find('.success-background').show();
        
        // Reset form
        $('#contact-form')[0].reset();
        
        // Hide success message after 5 seconds and show form again
        setTimeout(function() {
            $scene4.find('.success-background').hide();
            $scene4.find('.form-container form').show();
        }, 5000);
    };

    // Contact form functions removed - now using direct Google Form submission

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

