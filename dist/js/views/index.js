$(function() {
    loginSuccessCallback();    // 登录成功回调方法
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
                url: url.mc.partnerLink_all
            })
            .done(function(res) {
                _this.data.host_source = url.oss.download;
                _this.data.list = res.data;
                _this.$render();
            })
        }
    });

    var orgList2 = new Org({
        $el: '#index',
        $renderEl: '#banner',
        $tpl: '#tpl-banner',
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
                url: url.mc.carousel_all
            })
            .done(function(res) {
                _this.data.host_source = url.oss.download;
                _this.data.list = res.data;
                _this.$render();
                _this.setBanner();
            })
        },
        setBanner: function() {
            setTimeout(function() {
                $('#banner').slide({
                    picIndex: 0
                });
            }, 500)
        }
    });

    var orgList3 = new Org({
        $el: '#index',
        $renderEl: '#banner2',
        $tpl: '#tpl-banner2',
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
            	url: url.mc.carousel_all
            })
            .done(function(res) {
                _this.data.host_source = url.oss.download;
                _this.data.list = res.data;
                _this.$render();
                _this.setBanner();
            })
        },
        setBanner: function() {
            setTimeout(function() {
                $('#banner2').slide({
                    picIndex: 0
                });
            }, 500)
        }
    });
})