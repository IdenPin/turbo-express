/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
define(['commonjs', '../css/news/news-online-interactive.css', 'handlebars', 'timeFormat'], function (util, newsOnlineInteractiveCss, handlebars, getTime) {
    //在线互动和已回答toggle切换
    $('.toggle-title').click(function () {
        var n = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        if (n == 2) n = n - 1;
        $('.list').hide().eq(n).fadeIn(500);
        var url = $(this).attr('urlid');
        if(url == 0){
            url = util.INTERFACE_URL.getOnlineInteractive;
        }else{
            url = util.INTERFACE_URL.getOnlineHot;
        }
        util.ajaxFun(url, 'get', {}, function (res) {
            if (res.rtnCode == '0000000') {
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                var template = handlebars.compile($("#online-hot").html());
                var html = template(res);
                $('.online-hot').html(html);
            }
        });
    });
    //在线互动
    util.ajaxFun(util.INTERFACE_URL.getOnlineInteractive, 'get', {}, function (res) {
        if (res.rtnCode == '0000000') {
            handlebars.registerHelper('formatDate', function (date) {
                return getTime(date);
            });
            var template = handlebars.compile($("#online-interactive").html());
            var html = template(res);
            $('.online-interactive').html(html);
        }
    });
    //已回答
    //util.ajaxFun(util.INTERFACE_URL.getOnlineHot, 'get', {}, function (res) {
    //    if (res.rtnCode == '0000000') {
    //        handlebars.registerHelper('formatDate', function (date) {
    //            return getTime(date);
    //        });
    //        var template = handlebars.compile($("#online-hot").html());
    //        var html = template(res);
    //        $('.online-hot').html(html);
    //    }
    //});
    //获取热门解答
    util.ajaxFun(util.INTERFACE_URL.getOnlineInteractive, 'get', {}, function (res) {
        if (res.rtnCode == '0000000') {
            handlebars.registerHelper('formatDate', function (date) {
                return getTime(date);
            });
            var template = handlebars.compile($("#title-list").html());
            var html = template(res);
            $('.title-list').html(html);
        }
    });




});
