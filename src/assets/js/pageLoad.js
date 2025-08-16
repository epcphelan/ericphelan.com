var Cases = null,
    Scrolling = null,
    DataText = null,
    Menu = null,
    Controller = null,
    Booster = null,
    SiteTracking = null;

function PageLoad(){
    var styles = 'assets/css/styles.css';
    var bodyContent ='contents';
    var javaScripts = [
        'assets/js/plugins-min.js',
        'assets/js/eric-min.js',
        'assets/js/libs-min.js',
        'assets/js/scenes-min.js'
    ];
    var stylesLoaded = false;
    var scriptsLoaded = false;
    var htmlLoaded = false;

    loadStyles(function(){
        stylesLoaded=true;
        scanComplete();
    });
    loadScripts(function(){
        scriptsLoaded=true;
        scanComplete();
    });
    loadHTML(function(){
        htmlLoaded = true;
        scanComplete();
    });

    function scanComplete(){
        if(stylesLoaded && scriptsLoaded && htmlLoaded){
            initializeSite();
        }
    }

    function loadScripts(callback){
        var loadedScripts = 0;
        var scriptCount = javaScripts.length;
        javaScripts.forEach(function(src){
            $.getScript(src,markLoaded)
        });
        function markLoaded(){
            loadedScripts ++;
            if(scriptCount === loadedScripts){
                callback();
            }
        }
    }

    function loadStyles(callback){
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.onload = callback;
        link.setAttribute("href", styles);
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function loadHTML(callback){
        $('.bootstrap-content-target').load(bodyContent,callback);
    }

    function removeLoadingMask(){
        $('.bootstrap-loading-mask').toggleClass('loaded', true).delay(500).fadeOut(2000,function(){
            $(this).remove();
        });
    }

    function bindOnVideoLoad(){
        var homeVideo = document.getElementById('home_bg_video');
        homeVideo.oncanplay = function(){
            removeLoadingMask();
            var location = window.location.hash.substr(1);
            if(location){
                if(location ==='home'){
                    $(this)[0].play();
                }
            }
            else{
                $(this)[0].play();
            }
        };
    }

    function initializeSite(){
        Controller          = new SceneController();
        Cases               = new CaseStudy();
        Booster             = new SpeedBoost();
        Menu                = new DynamicMenu();
        SiteTracking        = new SiteTracker();
        SiteTracking.trackPageLoad('Home');
        Controller.bindCases(Cases);
        Scrolling = Controller.Scrolling;
        Scrolling.loadURL(function(){
            Controller.Scrolling.addTransitionDelegate(function disarmScrollHint(){
                Controller.Scrolling.removeTransitionDelegate(disarmScrollHint);
            });
        });

        DataText = new DataTextIO(EricPhelan);
        DataText.setDefaultLanguage();
        DataText.draw();

        Cases.bindScrollPlayer(Scrolling);
        Cases.addDataTextIO(DataText);
        Cases.addSpeedBoost(Booster);
        Cases.addSiteTracking(SiteTracking);
        Cases.addCase('glamAndGo','#glam-and-go-case','principly',3, glamAndGoCaseLoadingFunctions);
        Cases.addCase('principly','#principly-case','springshot',4, principlyLoadingFunctions);
        Cases.addCase('vagabondStartup','#vagabond-startup-case','springshot',4);
        Cases.addCase('gathered','#gathered-case','springshot',4);
        Cases.addCase('springshot','#springshot-case', 'ipplicant',5,springshotLoadingFunctions);
        Cases.addCase('ipplicant','#ipplicant-case','episampler',6, ipplicantCaseLoadingFunctions);
        Cases.addCase('episampler','#episampler-case', 'lassa', 7,epiSamplerCaseLoadingFunctions);
        Cases.addCase('lassa','#lassa-case',null, 8);

        Menu.arm();
        Booster.startResizeListener();
        bindOnVideoLoad();
    }
}

$(document).ready(function(){
    PageLoad();
});

(function () {
    var $triangles = document.querySelectorAll('.triangle');
    var template = '<svg class="triangle-svg" viewBox="0 0 140 141">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n      <polygon class="triangle-polygon"  points="70 6 136 138 4 138"></polygon>\n    </g>\n  </svg>';

    Array.prototype.forEach.call($triangles, function ($triangle, index) {
        $triangle.innerHTML = template;
    });
})();



