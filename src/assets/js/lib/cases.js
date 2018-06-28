(function () {
    var $triangles = document.querySelectorAll('.triangle');
    var template = '<svg class="triangle-svg" viewBox="0 0 140 141">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n      <polygon class="triangle-polygon"  points="70 6 136 138 4 138"></polygon>\n    </g>\n  </svg>';

    Array.prototype.forEach.call($triangles, function ($triangle, index) {
        $triangle.innerHTML = template;
    });
})();

$(document).ready(function(){
    Cases               = new CaseStudy();
    Booster             = new SpeedBoost();
    Menu                = new DynamicMenu();
    SiteTracking        = new SiteTracker();
    SiteTracking.trackPageLoad('Case');

    DataText = new DataTextIO(EricPhelan);
    DataText.setDefaultLanguage();
    DataText.draw();


    Cases.addDataTextIO(DataText);
    Cases.addSpeedBoost(Booster);
    Cases.addSiteTracking(SiteTracking);
    Cases.setMode('detail');
    Cases.addCase('glamAndGo','#glam-and-go-case',null,3, glamAndGoCaseLoadingFunctions);
    Cases.addCase('principly','#principly-case','springshot',4, principlyLoadingFunctions);
    Cases.addCase('vagabondStartup','#vagabond-startup-case','springshot',4);
    Cases.addCase('gathered','#gathered-case','springshot',4);
    Cases.addCase('springshot','#springshot-case', 'ipplicant',5,springshotLoadingFunctions);
    Cases.addCase('ipplicant','#ipplicant-case','episampler',6, ipplicantCaseLoadingFunctions);
    Cases.addCase('episampler','#episampler-case', 'lassa', 7,epiSamplerCaseLoadingFunctions);
    Cases.addCase('lassa','#lassa-case',null, 8);
    Menu.arm();
    Booster.startResizeListener();
    addNextPageTarget();
    showPageCase();
});

function removeLoadingMask(){
    $('.bootstrap-loading-mask').toggleClass('loaded', true).delay(500).fadeOut(2000,function(){
        $(this).remove();
    });
}

function addNextPageTarget(){
    var nextUrl = $('body').data('next-target');
    if(nextUrl){
        Cases.setDetailTarget(nextUrl);
    }
}

function showPageCase(){
    var caseId = $('body').data('case-id');
    if(caseId){
        Cases.show(caseId);
        setTimeout(function(){
            removeLoadingMask();
        },400)
    }
}