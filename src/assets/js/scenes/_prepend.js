function SceneController(){
    this.Scrolling = new ScrollPlayer();
    this.bindScenes();
    this.wayOffNorth = '-3000px';
    this.wayOffSouth = '3000px';
    this.Cases = null;

// Utility Functions
    this.transitionSceneContainer = function($scene,direction, duration, callback){
        var self = this;
        var sceneHeight = $scene.css('height');
        if(duration > 0){
            switch (direction){
                case 1:
                    $scene.animate({
                            top : '-' + sceneHeight
                        }, duration,this.Scrolling.bezierCurve,
                        function(){
                            $(this).css({top:self.wayOffNorth});
                            callback()
                        });
                    break;
                case -1:
                    $scene.css({top:'-' + sceneHeight});
                    $scene.animate({
                        top : 0
                    },duration, this.Scrolling.bezierCurve, callback);
                    break;
            }
        }
        else{
            switch (direction){
                case 1:
                    $scene.css({
                        top:self.wayOffNorth
                    });
                    callback();
                    break;
                case -1:
                    $scene.css({top : 0});
                    callback();
                    break;
            }
        }

    };
}

SceneController.prototype.bindCases = function(cases){
    this.Cases = cases;
};

SceneController.prototype.bindScenes = function(){
    var self = this;
    this.Scrolling.addScene(this.scene1());
    this.Scrolling.addScene(this.scene2());

    function addSubScenes(){
        var scenes3 = self.scenes3();
        for(var key in scenes3){
            if(scenes3.hasOwnProperty(key)){
                var scene = scenes3[key];
                self.Scrolling.addScene(scene);
            }
        }
    }
    addSubScenes();
    this.Scrolling.addScene(this.scene4());
    this.Scrolling.listen();
};