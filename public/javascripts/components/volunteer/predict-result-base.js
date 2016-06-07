/*
 *
 * 智能填报 报告结果页面base ()
 * 所有省份结果页面继承base
 * */

define(['commonjs', 'handlebars', 'timeFormat', 'printArea'], function (util, handlebars, getTime, printArea) {
    var commonReport = {
        commonBanner: function () {
            var volunteerBanner = require('../img/volunteer-banner.jpg');
            var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
            $('.volunteer-banner').html(volunteerBannerImg);
        },
        router: function () {
            var Router = require('volunteerRouter');
            Router.router();
        },
        doPrint: function () {
            var bdhtml = window.document.body.innerHTML,
                sprnstr = "<!--startprint-->",
                eprnstr = "<!--endprint-->",
                prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17),
                prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
            window.document.body.innerHTML = prnhtml;
            window.print();
            window.document.body.innerHTML = bdhtml;
        },
        getReportDetail: function () {
            var finalInfoData = {
                "score": util.cookie.getCookieValue('volunteerScore'),
                "cate": util.cookie.getCookieValue('volunteerCate'),
                "province": util.cookie.getCookieValue('userKey')
            };
            util.ajaxFun(util.INTERFACE_URL.getVolunteerFinalInfo, 'get', finalInfoData, function (res) {
                if (res.rtnCode == '0000000') {
                    var dataJson = res.bizData.reportInfoView,
                        reportResultStr = dataJson.reportResultView.reportResultJson,
                        reportResultObj = JSON.parse(reportResultStr),
                        template = handlebars.compile($('#reportResultTemp').html());
                    $('.reportResultDiv').html(template(reportResultObj));
                    var template = handlebars.compile($('#intelligent-tpl').html());
                    $('.result-container').html(template(dataJson));
                    $('#final-results').html($('.reportResultDiv').html());
                    dataJson.complete == 'false' ? $('.step1-0').hide() : $('.step1-1').show();
                    dataJson.reasonable == 'false' ? $('.step1-2').hide() : $('.step1-3').show();
                }
            });
        }
    };
    return commonReport;

    //module.exports = {
    //    doPrint: doPrint, //报告打印
    //    router: router //路由防止跳转
    //}
});