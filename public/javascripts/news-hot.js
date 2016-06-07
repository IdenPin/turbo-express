define(['commonjs', '../css/news/news-hot.css', 'handlebars'], function (util, newHotCss, handlebars) {
    //获取高考头条列表
    util.ajaxFun(util.INTERFACE_URL.getGkTopList, 'get', {'type':1}, function (res) {
        if (res.rtnCode == '0000000') {
            var template = handlebars.compile($("#gk-top-list").html());
            var list = res.bizData;
            var html = template(list);
            $('.headlines-list').html(html);
        }
    });
    /*
     * 热门资讯
     * @page:页
     * @rows:条
     * @queryparam:模糊查询
     * */
    var rows = 5,
        page = 1,
        queryparam = '';
    var dataList = {
        "type": 0,
        "rows": rows,
        "page": page,
        "queryparam": queryparam
    };
    getInfoList();
    function getInfoList() {
        util.ajaxFun(util.INTERFACE_URL.getGkHotList, 'get', dataList, function (res) {
            if (res.rtnCode == '0000000') {
                var template = handlebars.compile($("#gk-hot-list").html());
                var list = res.bizData;
                var html = template(list);
                $('#data-module-tpl').append(html);

                if (res.bizData.page < res.bizData.total) {
                    $('.btn-next').show();
                } else {
                    $('.btn-next').hide();
                }
                if (res.bizData.rows.length == 0) {
                    $('.policy-list').html(noDataTips('真抱歉,没有检索到相关的新闻'))
                }

                var defaultImg = require('../img/news-default.png');
                $('.no-img-blank').attr('src', defaultImg); //资讯没有图片显示默认图片
                $('.data-list').removeClass('hide');
                $('.btn-next').text('加载更多').removeAttr('disabled');
            }
        });
    }

    $('.btn-next').on('click', function () {
        $('.btn-next').text('加载中...').attr('disabled', 'disabled');
        dataList.page++;
        getInfoList();
    });
    $('.go').click(function () {
        dataList.queryparam = $.trim($('#query').val());
        getInfoList();
    });

});
