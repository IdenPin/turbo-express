//账号信息模块
var userInfo = require('html!../../../comm_tmpl/user/account-info.html');
//VIP模块
var userVip = require('html!../../../comm_tmpl/user/user-vip.html');
//我的收藏模块
var myCollection = require('html!../../../comm_tmpl/user/my-collection.html');
//我的回答模块
var myAnswer = require('html!../../../comm_tmpl/user/my-answer.html');
//我的预约
var myOrder = require('html!../../../comm_tmpl/user/my-order.html');
//目标定位
var targetLocation = require('html!../../../comm_tmpl/user/target-location.html');
//服务中心
var serviceCenter = require('html!../../../comm_tmpl/user/service-center.html');
//我的报告
var myReport = require('html!../../../comm_tmpl/user/my-report.html');
//window.location.hash = '#userInfo';
$('.sidebar li').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    var hash = $(this).find('span').attr('hash');
    switch (hash) {
        case "#userInfo":
            $('#comm-tpl').html(userInfo);
            break;
        case "#userVip":
            $('#comm-tpl').html(userVip);
            break;
        case "#myCollection":
            $('#comm-tpl').html(myCollection);
            break;
        case "#myAnswer":
            $('#comm-tpl').html(myAnswer);
            break;
        case "#myOrder":
            $('#comm-tpl').html(myOrder);
            break;
        case "#targetLocation":
            $('#comm-tpl').html(targetLocation);
            break;
        case "#serviceCenter":
            $('#comm-tpl').html(serviceCenter);
            break;
        default:
            $('#comm-tpl').html(myReport);
            break;
    }
    window.location.hash = hash;
});
if (window.location.hash === "") {
    window.location.hash = '#userInfo';
}
$('.sidebar li span[hash="' + window.location.hash + '"]').click();

