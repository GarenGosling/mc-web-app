$(function() {

    var orgList1 = new Org({
        $el: '#index',
        $renderEl: '#tpl-cooperate-wrap',
        $tpl: '#tpl-cooperate',
        data: {
            searchData: {
            },
            list: []
        },
        events: {},
        init: function() {
            this.getList();
        },
        getList: function(data) {
            var _this = this;
            var _data = $.extend({}, this.data.searchData, data);
            var __data = {};
            $.each(_data, function(k, v) {
                if (v !== '') __data[k] = v;
            });
            $.ajax({
            	url: url.partner_link()
            })
            .done(function(res) {
                console.log(res)
                _this.data.host_source = url.host_source;
                _this.data.list = res.data;
                _this.$render();
            })
        }
    });
})