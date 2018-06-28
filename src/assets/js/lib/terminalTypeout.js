function TerminalTypeout($elem){
    this.$elem = $elem;
    this.commands = ['cmd: photo .display', 'cmd: cv .publish', 'cmd: skills .launch', 'cmd: inspire .print'];
    this.$lines = [];
    this.completionCallbacks = [];
    this.constructHTML();
    this.timers = [];
    this.typingSpeed= 1000;
    this.linePace = 2500;
    this.terminalStub = 'ericphelan $ : ';
}

TerminalTypeout.prototype.constructHTML = function(){
      for(var i = 0; i< this.commands.length;i++){
          var $line = $(getElem(i+1));
          this.$lines.push($line);
          this.$elem.append($line);
      }
      function getElem(n){
        return '<div class="cmd line-out cmd-line-'+ n +'"></div>';
      }
};

TerminalTypeout.prototype.animate = function(typingSpeed, linePace, callback){
    var self = this;
    this.typingSpeed = typingSpeed || this.typingSpeed;
    this.linePace = linePace || this.linePace;

    iterator(0, callback);

    function iterator(i, complete){
        if(i < self.commands.length){
            setTimeout(function(){
                self.typeOutString(self.commands[i],self.$lines[i],function(){
                    if(self.completionCallbacks[i]){
                        self.completionCallbacks[i]();
                    }
                    iterator(++i, complete);
                });

            }, (self.linePace/2 * Math.random()) + self.linePace/2)
        }
        else{
            complete();
        }

    }
};

TerminalTypeout.prototype.typeOutString = function(str, $target, callback){
    var speed = this.typingSpeed;
    var strLength = str.length;

    $target.html(this.terminalStub);
    iterator(0,callback);

    function iterator(i,complete){
        if(i<strLength){
            setTimeout(function(){
                $target.html($target.html()+str[i]);
                iterator(++i, complete)
            },(speed/2 * Math.random()) + speed/2)
        }
        else{
            complete();
        }
    }
};