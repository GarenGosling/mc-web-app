$(function() {
	var app = new Org({
		$el: '#elite-model-list',
		events: {
			'add-collect': function() {
				orgCollect.show();
			}
		}
	})

	var orgCollect = new OrgPop({
		$el: '#tpl-pop-collect-wrap',
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
            },
			'add-clip': function() {
                orgClip.show();
            }
        }
	})

	var orgClip = new OrgPop({
		$el: '#tpl-pop-clip-wrap',
		events: {
            close: function() {
                this.hide();
            }
        }
	})
})