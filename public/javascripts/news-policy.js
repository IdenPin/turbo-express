/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
define(['commonjs', '../css/news/news-policy.css', 'handlebars', 'timeFormat','noDataTips'], function (util, newsPolicyCss, handlebars, getTime,noDataTips) {
//    banner
    var banner_img = require('img/news-banner-policy.jpg');
    $('#banner').css('background', 'url(' + banner_img + ')');
    /*
     * 高考政策
     * @page:页
     * @rows:条
     * */
    var rows = 10,

        page = 1,
        queryparam = '';
    var dataList = {
        "rows": rows,
        "page": page,
        "queryparam": queryparam
    };
    getWorldList();
    function getWorldList() {
        util.ajaxFun(util.INTERFACE_URL.getPolicyList, 'get', dataList, function (res) {
            if (res.rtnCode === "0000000") {
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                if(res.bizData.rows.length == 0){
                    $('#policy-tpl').html(noDataTips('真抱歉,没有检索到相关的新闻'))
                }
                var template = handlebars.compile($("#policy-list").html());
                $('#policy-tpl').append(template(res.bizData));

                if (res.bizData.page < res.bizData.total) {
                    $('.btn-next').show();
                } else {
                    $('.btn-next').hide();
                }
                if (res.bizData.rows.length == 0) {
                    $('.policy-list').html(noDataTips('真抱歉,没有检索到相关的新闻'))
                }
                $('.data-list').removeClass('hide');
                $('.btn-next').text('加载更多').removeAttr('disabled');
            }
        });
    }

    $('.btn-next').on('click', function () {
        $('.btn-next').text('加载中...').attr('disabled', 'disabled');
        dataList.page++;
        getWorldList();
    });
    $('.go').click(function () {
        dataList.queryparam = $.trim($('#query').val());
        $('#policy-tpl').html('');
        getWorldList();
    });


//    招办电话list
//    ?page=&rows=
    util.ajaxFun(util.INTERFACE_URL.getGkTelList, 'get', {
        page:1,
        rows:10
    }, function (res) {
        if (res.rtnCode == '0000000') {
            var template = handlebars.compile($("#tel-list").html());
            var html = template(res.bizData);
            $('.tel-list').html(html);
        }
    });

});
