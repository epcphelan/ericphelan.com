function BloomingSkills($elem){
    this.$elem = $elem;
    this.$circles = [];
    this._setup();
    this.timer = null;
    this.interval = 6000;
}

BloomingSkills.prototype._setup = function(){
    this.$circles = this.$elem.find('.donut .circle-front');
    this.$bubbles = this.$elem.find('.bubble');
    this.setupCircleInitialOffsets();
    this.bindCircleHover();
    this.bindDonutClick();
    this.bindHideSkillsList();
};

BloomingSkills.prototype.setupCircleInitialOffsets = function(){
    this.$elem.find('.circle-front').each(function(){
        var radius = parseInt($(this).attr('r'));
        var initialOffset = Math.floor((2 * radius * 3.14) + 1);
        $(this).css({
            'stroke-dashoffset': initialOffset + 'px',
            'stroke-dasharray': initialOffset + 'px'
        }).css('transition', 'all .5s ease');
    });
};

BloomingSkills.prototype.animate = function(callback){
    this.show();
    var self = this;
    iterate(0, this.$circles, this.bloomCircle,function(){
        iterate(0, self.$bubbles, self.bloomBubble, function(){
            callback();
        });
    });


    function iterate(i,elems,method, complete){
        if(i< elems.length){
            setTimeout(function(){
                method($(elems[i]));
                iterate(++i, elems, method, complete);
            },12)
        }
        else{
            complete();
        }
    }
};

BloomingSkills.prototype.show = function(){
    this.$elem.toggleClass('visible',true);
};


BloomingSkills.prototype.bloomCircle = function($circle){
    var radius = parseInt($circle.attr('r'));
    var offsetMax = 2 * radius * 3.14;
    var value = (1-($circle.attr('value')/100)) * offsetMax;
    $circle.css({
      'stroke-dashoffset': value + 'px'
    })
};

BloomingSkills.prototype.bloomBubble = function($bubble){
    $bubble.toggleClass('open', true);
};


BloomingSkills.prototype.startRandomHighlights = function(){
    var self = this;
    function skills(){
        self.timer = setTimeout(function(){
            skills()
        },self.interval);
        self.showSkillCircleDetail(self.$circles.random());
    }
    skills();
};

BloomingSkills.prototype.stopRandomHighlights = function(){
    this.$elem.find('.circle-detail').toggleClass('visible', false);
    this.$elem.find('.circle-front').toggleClass('circle-highlight', false);
    clearTimeout(this.timer);
    this.timer = null;
};

BloomingSkills.prototype.bindCircleHover = function(){
    var self = this;
    this.$elem.find('.circle-front').mouseenter(function(){
        self.stopRandomHighlights();
        self.showSkillCircleDetail($(this))
    });
};

BloomingSkills.prototype.bindHideSkillsList = function(){
    var self = this;
    var $skills = this.$elem.parents('.skills');
    var $skillsListClose = $skills.find('.skill-list-wrap .close');
    $skillsListClose.bind('click', function(){
        self.hideSkillsList();
    })
};


BloomingSkills.prototype.bindDonutClick = function(){
    var self = this;
    this.$elem.find('.donut').click(function(){
        self.enumerateSkills($(this));
    });
    this.$elem.find('.skill-list-wrap .close').click(function(){
        self.hideSkillsList();
    })
};

BloomingSkills.prototype.showSkillCircleDetail = function($circle){
    this.$elem.find('.circle-highlight').toggleClass('circle-highlight', false);
    this.$elem.find('.donut .value-label').html('');

    var label = $circle.attr('ring-label');
    var $detail = this.$elem.find('.circle-detail').first();
    var $valueLabel = $circle.parents('.donut').find('.value-label');
    $valueLabel.html($circle.attr('value'));
    $detail.find('.label').html(label);

    var location = $circle.offset();
    var $skills = this.$elem.parents('.skills');
    var parentLocations = $skills .offset();
    $detail.find('.pointer').toggleClass('left', true);

    var left = 0;
    if(location.left < $skills .width() / 2){
        left = Math.max(location.left - parentLocations.left + 50, 50);
    }
    else{
        left = Math.max(location.left - parentLocations.left - 50, 50);
    }
    var top = Math.max(location.top - parentLocations.top - 35, 10);

    $detail.css({
        'top': top,
        'left': left
    }).toggleClass('visible', true);

    $circle.toggleClass('circle-highlight', true);
};

BloomingSkills.prototype.hideSkillsList = function(){
    var $skills = this.$elem.parents('.skills');
    $skills.find('.skill-list-wrap').toggleClass('visible',false);
    this.startRandomHighlights();
};

BloomingSkills.prototype.enumerateSkills = function($donut){
    this.stopRandomHighlights();
    var header = $donut.find('.label').html();
    var $skills = this.$elem.parents('.skills');
    var $list = $skills.find('.skill-list-wrap .skills');
    var $header = $skills.find('.skill-list-wrap .header');
    $list.html('');
    $header.html(header);
    $skills.find('.skill-list-wrap').toggleClass('visible',true);
    $donut.find('.circle-front').each(function(index){
        var name = $(this).attr('ring-label');
        var skillValue = $(this).attr('value');
        var item = skillFromTemplate(name, skillValue);
        $list.append(item);
        doSetTimeout(index, $list.find('li').last())
    });


    function doSetTimeout(i, $this){
        setTimeout(function(){
            $this.toggleClass('open', true)
        }, i * 50)
    }

    function skillFromTemplate(name, skillValue){
        var template = $('#skill-detail-template').html();
        var templateData = {
            name: name,
            skillValue: skillValue,
            barWidth: skillValue + '%'
        };
        return Mustache.render(template,templateData);
    }
};

$.fn.random = function() {
    return this.eq(Math.floor(Math.random() * this.length));
};