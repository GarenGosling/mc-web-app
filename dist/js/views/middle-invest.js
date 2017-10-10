$(function() {
	var app = new Org({
		$el: '#middle-invest',
		events: {
			'view-detail': function() {
				orgDetail.show();
			},
			'toggle-select': function($this, event) {
				$this.parent().siblings('ul').toggle();
			},
			select: function($this, event) {
                var txt = $(event.target).html();
                $this.parent().siblings().find('span').html(txt);
                $this.parent().hide();
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
            }
        }
	})
})