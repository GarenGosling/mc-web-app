;(function($) {
	function Slide(element, options) {
		this.element = element;
		this.oUl = element.find('ul').eq(0);
		this.aLi = this.oUl.find('li');
		this.aLi.width(this.element.width());
		this.oUl.width(element.width()*this.aLi.length);
		this.element.height(this.aLi.eq(0).height());
		this.timer = null;
		this.ol = $('<ol></ol>');
		this.options = {
			picIndex: options.picIndex
		};
		this.init();
	}

	Slide.prototype = {
		constructor: Slide,
		init: function() {
			this.autoPlay();
			this.bindEvent();
		},
		autoPlay: function() {
			var that = this;
			var picIndex = that.options.picIndex;
			var wh = that.element.width();
			var $oUl = that.oUl;
			var $aLi = that.aLi;
			that.createHtm();
			clearTimeout(that.timer);
			$oUl.stop().animate({'left': -wh*picIndex + 'px'}, 300, 'linear');
			that.timer = setTimeout(function() {
				if(picIndex < $aLi.length - 1) {
					that.options.picIndex++;
				} else {
					that.options.picIndex = 0;
				}
				that.autoPlay();
			}, 3000);
		},
		createHtm: function() {
			var that = this;
			var $aLi = that.aLi;
			var picIndex = that.options.picIndex;
			var htm = '';
			for(var i = 0; i < $aLi.length; i++) {
				if(i == picIndex) {
					htm += '<li class="active">' + i + '</li>';
				} else {
					htm += '<li>' + i + '</li>';
				}
			}
			that.ol.html(htm);
			that.element.append(that.ol);
		},
		bindEvent: function() {
			var that = this;
			var $btn = that.element.find('ol').find('li');
			var idx;
			that.element.on('mouseover', 'li', function() {
				if($(this).parent().is('ol')) {
					idx = $(this).index();
					that.options.picIndex = idx;
					that.autoPlay();
				}
			});
			that.element.on('click', 'div', function() {
				var id = $(this).attr('id');
				if(id == 'banner_pre') {
					if(that.options.picIndex == 0) {
						that.options.picIndex = 0;
					} else {
						that.options.picIndex = that.options.picIndex - 1;
					}
				} else if(id == 'banner_next') {
					if(that.options.picIndex == that.aLi.length - 1) {
						that.options.picIndex = that.aLi.length - 1;
					} else {
						that.options.picIndex = that.options.picIndex + 1;
					}
				}
				that.autoPlay();
			});
		}
	};

	$.fn.slide = function(options) {
		return new Slide($(this), options);
	};
})(jQuery);