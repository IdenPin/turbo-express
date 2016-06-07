/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
var util = require('./utils/common.js');
require('../css/news/news-online-detail.css');
$(function () {
    //在线详情
    var id = util.getLinkey('id');
    util.ajaxFun(util.INTERFACE_URL.getQuestionDetail, 'get', {id:id}, function (res) {
        if (res.rtnCode == '0000000') {
            console.info(res);
            util.handlebars.registerHelper('formatDate', function(date) {
                return util.getTime(date);
            });
            var template = util.handlebars.compile($("#online-interactive").html());
            var list = res.bizData;
            var html = template(list);
            $('.online-interactive').html(html);
        }
    });

    //获取热门解答
    util.ajaxFun(util.INTERFACE_URL.getOnlineHot, 'get', {}, function (res) {
        if (res.rtnCode == '0000000') {
            var template = util.handlebars.compile($("#title-list").html());
            var list = res;
            var html = template(list);
            $('.title-list').html(html);
        }
    });


});
