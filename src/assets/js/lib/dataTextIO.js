function DataTextIO(src){
    this.language = 'en';
    this.fallbackLanguage = 'en';
    this.dataObj = src;
}

DataTextIO.prototype.draw = function($elem){
    var self = this;
    $elem = $elem || $('body');
    $elem.find('[data-text-io]').each(function(){
        $(this).html(self.parseTextPath($(this).data('text-io')))
    });
    $elem.find('[data-attr-io]').each(function(){
        var elem = this;
        var attrs = $(elem).data('attr-io');
        attrs = attrs.split(",");
        attrs.forEach(function(attr){
            var obj = self.parseAttrPath(attr);
            $(elem).attr(obj.attr, obj.value);
        });
    })
};

DataTextIO.prototype.parseAttrPath = function(path){
    var pathComponents = path.split("|");
    var attr = pathComponents[0];
    var value = this.parseTextPath(pathComponents[1]);
    return{
        attr: attr,
        value: value
    }
};

DataTextIO.prototype.parseTextPath = function(path){
    var pathComponents = path.split(":");
    if(this.dataObj.hasOwnProperty(this.language)){
        var data = depthIterator(0, this.dataObj[this.language],pathComponents);
        if(data){
            return data;
        }
        else{
            var enData = depthIterator(0, this.dataObj[this.fallbackLanguage],pathComponents);
            return enData ? enData : ''
        }
    }
    function depthIterator(i, subObj, keys){
        if(i<keys.length-1){
            if(subObj.hasOwnProperty(keys[i])){
                var newSubObj = subObj[keys[i]];
                return depthIterator(++i, newSubObj , keys);
            }
            else{
                return null
            }
        }
        else{
            if(subObj.hasOwnProperty(keys[i])){
                return subObj[keys[i]];
            }
            else{
                return null;
            }
        }
    }
};

DataTextIO.prototype.setLanguage = function(lang){
  this.language = lang;
  this.draw();
  $('.language').toggleClass('active',false);
  $('.language.'+lang).toggleClass('active',true);
};

DataTextIO.prototype.setDefaultLanguage = function(){
  this.setLanguage(this.language);
};
