function glamAndGoCaseLoadingFunctions(){
    $('.image-switch').each(function(){
        var imgSwitch = new ImageSwitch($(this));
        imgSwitch.setActiveImg(0);
        imgSwitch.startPlayer();
    });
    var dashboardDemoPlayer = new MediaPlayer($('#dashboard-demo'),'glamandgo-dashboard-demo-video');
    dashboardDemoPlayer.bindClick($('.dashboard-demo-expander'));

    var dailyPunchDemoPlayer = new MediaPlayer($('#dailypunch-demo'),'glamandgo-dailypunch-demo-video');
    dailyPunchDemoPlayer.bindClick($('.dailypunch-demo-expander'));
}

function epiSamplerCaseLoadingFunctions(){
    $('.image-switch').each(function(){
        var imgSwitch = new ImageSwitch($(this));
        imgSwitch.setActiveImg(0);
        imgSwitch.startPlayer();
    });
}

function ipplicantCaseLoadingFunctions(){
    $('.iframe-switch').each(function(){
        var imgSwitch = new IFrameSwitch($(this));
        imgSwitch.setActiveImg(0);
        //imgSwitch.startPlayer();
    });

    $(window).resize(function(){
        sizeIframesToMonitor()
    });
    setTimeout(sizeIframesToMonitor, 1500);
    function sizeIframesToMonitor(){
        $('.iframe-switch iframe').each(function(){
            var $iframe = $(this);
            var container = $iframe.parents('.interactive-container').first();
            $iframe.css({
                height: container.height() + 'px',
                width: container.width() + 'px'
            })
        });
    }
}

function principlyLoadingFunctions(){
    $('#principly-flow-img').click(function(){
        $('#principly-flow-fullsize').toggleClass('show', true).click(function(){
            $(this).toggleClass('show', false)
        })
    });
    $('#principly-imac-mockup').click(function(){
        $('#principly-design-fullsize').toggleClass('show', true).click(function(){
            $(this).toggleClass('show', false)
        })
    });
}

function springshotLoadingFunctions(){
    $('.image-switch').each(function(){
        var imgSwitch = new ImageSwitch($(this));
        imgSwitch.setActiveImg(0);
        imgSwitch.startPlayer();
    });
    var mediaPlayer = new MediaPlayer($('#springshot-demo'),'springshot-demo-video');
    mediaPlayer.bindClick($('.springshot-demo-play'));
}