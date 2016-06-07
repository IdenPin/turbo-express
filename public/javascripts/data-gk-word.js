/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
define(['commonjs', '../css/data/data-gk-word.css', 'handlebars', 'timeFormat', 'noDataTips'], function (util, dataGkWordCss, handlebars, getTime, noDataTips) {


//    banner
    var banner_img = require('img/news-banner-policy2.jpg');
    $('#banner').css('background', 'url(' + banner_img + ')');

    /*
     * 高考词条
     * @page:页
     * @rows:条
     * */
    var rows = 10,
        page = 1,
        name = '';
    var dataList = {
        "rows": rows,
        "page": page,
        "name": name
    };
    getWorldList();
    function getWorldList() {
        util.ajaxFun(util.INTERFACE_URL.getGkEntryList, 'get', dataList, function (res) {
            if (res.rtnCode === "0000000") {
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                var template = handlebars.compile($("#policy-list").html());
                $('.policy-list').append(template(res.bizData));
                if (res.bizData.page < res.bizData.total) {
                    $('.btn-next').show();
                } else {
                    $('.btn-next').hide();
                }
                if (res.bizData.rows.length == '0') {
                    $('.policy-list').html(noDataTips('真抱歉,没有检索到相关的新闻'));
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
        dataList.name = $.trim($('#query').val());
        $('.policy-list').html('');
        getWorldList();
    });


});
