/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * ---------------------------
 * 注:高考头条|高考热点|政策解读 三个模块公用一个new-detail页面
 * */
define([ 'commonjs','../css/news/news-detail.css', 'handlebars','timeFormat'], function (util, newsDetailCss, handlebars,getTime) {
    /*
     *   热门资讯|高考头条
     *   id = hid
     *
     * */
    var hid = util.getLinkey('hid');
    if(hid){
        util.ajaxFun(util.INTERFACE_URL.getGkHotInfo, 'get', {id: hid}, function (res) {
            if (res.rtnCode == '0000000') {
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                var template = handlebars.compile($("#gk-new-detail").html());
                var html = template(res.bizData);
                $('.article-container').html(html);
            }
        });
    }
    /*
     *
     * 高考政策详情模块
     * id = pid
     *
     * */
    var pid = util.getLinkey('pid');
    if(pid){
        util.ajaxFun(util.INTERFACE_URL.getPolicyInfo, 'get', {id: pid}, function (res) {
            if (res.rtnCode == '0000000') {
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                var template = handlebars.compile($("#gk-new-detail").html());
                var html = template(res.bizData);
                $('.article-container').html(html);
            }
        });
    }

    /*
     *
     * 高考政策详情模块
     * id = wid
     *
     * */
    var wid = util.getLinkey('wid');
    if(wid){
        util.ajaxFun(util.INTERFACE_URL.getGkEntryInfo, 'get', {id: wid}, function (res) {
            if (res.rtnCode == '0000000') {
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                var template = handlebars.compile($("#gk-new-detail").html());
                var html = template(res.bizData);
                $('.article-container').html(html);
            }
        });
    }
});
