/*
 * pdeng
 * 注:目前该路由只能针对小于9个模板的,大于9个的需要修改部分代码.
 * 模板0 - 广西
 * 模板1 - 非广西
 * 模板2 - 非北京高职福建高职
 * 模板3 - 北京|广东
 * 域名前缀字典:
 *      zj浙江sn陕西 fj福建 gd广东 hb湖北 hn湖南 gx广西 ha河南 sd山东 he河北 sc四川
 *      sh上海 cq重庆 jx江西 yn云南 bj北京 tj天津 hi海南 ah安徽 js江苏 jl吉林 ln辽宁
 *      gs甘肃 sx山西 gz贵州 nx宁夏 xj新疆 hl黑龙
 * */

function router() {
    var util = require('commonjs'),
        provinceKey = util.cookie.getCookieValue('userKey'),
        batch = util.cookie.getCookieValue('volunteerBatch'),
        provinceObj = {
            "gx": 0,
            "ha": 1,
            "he": 1,
            "hn": 1,
            "hb": 1,
            "sd": 1,
            "sn": 1,
            "gz": 1,
            "js": 1,
            "fj": 1,
            "gd": 3,

            "jx": 1,
            "sc": 1,
            "cq": 1,
            "ah": 1,
            "yn": 1,
            "gs": 1,

            "xj": 1,
            "nx": 1,
            "bj": 1,
            "hi": 1,
            "sx": 1,

            "jl": 1,
            "hl": 1,
            "tj": 1,
            "ln": 1,
            "zj": 1,
            "sh": 1
        };
    var btch = batch.split("-");
    //福建高职走模板2
    if (provinceKey == 'fj' && btch[0] == '3') {
        provinceObj.fj = 2;
    }
    if (provinceKey == 'gd' && btch[0] == '3') {
        provinceObj.gd = 1;
    }
    //if (provinceKey == 'ha' && btch[0] == '3') {
    //    provinceObj.ha = 3;
    //}
    if (provinceKey == 'jl' && btch[0] == '2') {
        provinceObj.jl = 3;
    }
    if (provinceKey == 'jl' && btch[0] == '4') {
        provinceObj.jl = 3;
    }
    if (provinceKey == 'jl' && btch[0] == '3') {
        provinceObj.jl = 3;
    }
    var addrUrl = window.location.pathname;

    var tmpTag = addrUrl.substr(addrUrl.lastIndexOf(".") - 1, 1);

    var len = addrUrl.length - 6;
    var path = addrUrl.substr(0, len);

    if (provinceObj[provinceKey] != tmpTag) {
        window.location.href = path + eValue + '.html';
    }
}

module.exports = {
    router: router
};


