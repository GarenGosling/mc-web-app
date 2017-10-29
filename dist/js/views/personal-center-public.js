// $(function() {
// 	var app = new Org({
// 		$el: '#personal-center-public',
// 		init: function() {
//         	$('#treeview').treeview();
//         	setTimeout(function() {
// 				$('.j_btn_treeview').trigger('click');
//         	}, 0)
//         },
// 		events: {
// 			'hide-select': function() {
// 				$('.j-body-hide').hide();
// 				$('#treeview').hide();
// 			},
// 			'toggle-select': function($this, event) {
// 				var e = event || window.event;
// 				if(e.stopPropagation) {
// 					e.stopPropagation();
// 				} else if(e.cancelBubble) {
// 					e.cancelBubble = true;
// 				}
// 				$this.parent().siblings('ul').toggle();
// 			},
// 			select: function($this, event) {
//                 var txt = $(event.target).html();
//                 $this.parent().siblings().find('span').html(txt);
//                 $this.parent().hide();
//             },
//             'show-treeview': function($this, event) {
//             	var e = event || window.event;
// 				if(e.stopPropagation) {
// 					e.stopPropagation();
// 				} else if(e.cancelBubble) {
// 					e.cancelBubble = true;
// 				}
// 				$('#treeview').animate({'height': 'toggle'}, 0);
//             },
//             'stop-propagation': function($this, event) {
//             	var e = event || window.event;
// 				if(e.stopPropagation) {
// 					e.stopPropagation();
// 				} else if(e.cancelBubble) {
// 					e.cancelBubble = true;
// 				}
//             },
//             classify: function($this) {
// 				var selfTx = $this.text();
// 				var pt = $this.parents('ul');
// 				var arr = [];
// 				var str = '';
//
// 				arr.push(selfTx);
// 				for(var i = 0; i < pt.length; i++) {
// 					var parentTx = pt.eq(i).prev('span').text();
// 					if(parentTx) {
// 						arr.unshift(parentTx);
// 					}
// 				}
// 				str = arr.join('/');
// 				$('.j_btn_treeview').text(str);
// 				$('#treeview').hide();
//             }
//         }
// 	})
//
//
// })