define(['commonjs', 'handlebars', 'timeFormat'], function (util, handlebars, getTime) {
    require('../css/user/user-report.css');
    $(function () {
        $('#banner-info').prepend(require('html!../user-banner.html'));
        var cookie = require('cookie');
        var icon = cookie.getCookieValue('icon');
        var imgIco = require('../img/icon_default.png');
        if (icon == 'undefined') {
            icon = imgIco;
        }
        var userName = cookie.getCookieValue('userName');
        var vipStatus = cookie.getCookieValue('vipStatus');
        $('.user-avatar').attr('src', icon);
        $('.user-name').text(userName);
        if (vipStatus == 0) {
            $('#btn-vip,#user-type').show();
            $('#vip-box').hide();
        } else {
            $('#btn-vip,#user-type').hide();
            $('#vip-box').show();
        }
    });
    /*
     * 我的报告[次数开关]
     * times : 次数 默认2次.
     * */
    var times = 2;
    handlebars.registerHelper('formatDate', function (date) {
        return getTime(date);
    });
    handlebars.registerHelper('noEvaluation', function (date) {
        if (date == undefined) {
            date = times;
        }
        return date;
    });
    handlebars.registerHelper('judge', function (v, options) {
        if (v == undefined || v < times) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    //专业评测报告列表
    util.ajaxFun(util.INTERFACE_URL.getEvaluationList, 'get', {}, function (res) {
        if (res.rtnCode == '0000000') {
            handlebars.registerHelper('sEvaluation', function (data) {
                var sum = times;//测评总数
                var num = sum - parseInt(data);
                return num == 0 ? 0 : num;
            });
            //个性化设置背景
            $.each(res.bizData.apeskObj, function (i, v) {
                v.class = i + 1;
            });
            var template = handlebars.compile($("#evaluation-tpl").html());
            var html = template(res.bizData);
            $('.my-report').html(html);
        }
    });
    //智能填报报告列表
    util.ajaxFun(util.INTERFACE_URL.getIntelligentResult, 'get', {}, function (res) {
        if (res.rtnCode == '0000000') {
            var dataJson = res.bizData.reportObj;
            var template = handlebars.compile($('#intelligent-report-tpl').html());
            $('#intelligent-report').html(template(dataJson));
            //返回的report为false就隐藏智能填报表格
            if (dataJson.report == true) {
                $('#intelli-tab').removeClass('hide');
            }
            //计算结果页面跳转模板url
            var volunteerBase = require("volunteerBase");
            var intelligentCodeUrl = require('volunteerSchoolProfessConf').volunteerSchoolProfessFun(dataJson).resultUrl;
            $(".intelligent-code").attr('href', intelligentCodeUrl)
        }
    });


});
