$(function() {
	var app = new Org({
		$el: '#middle-invest',
		events: {
			'view-detail': function() {
				orgDetail.show();
			}
		}
	})

	var orgDetail = new OrgPop({
		$el: '#tpl-pop-detail-wrap',
		events: {
			'hide-select': function() {
				$('.j-body-hide').hide();
			},
            close: function() {
                this.hide();
            },
			'toggle-select': function($this, event) {
				var e = event || window.event;
				if(e.stopPropagation) {
					e.stopPropagation();
				} else if(e.cancelBubble) {
					e.cancelBubble = true;
				}
				$this.parent().siblings('ul').toggle();
			},
			select: function($this, event) {
                var txt = $(event.target).html();
                $this.parent().siblings().find('span').html(txt);
                $this.parent().hide();
            }
        }
	})
})