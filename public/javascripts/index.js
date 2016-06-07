/*
 * Created by pdeng on 16/1/18.
 * 首页.使用html-loader实现html页面继承
 * */
define(['commonjs', '../css/index.css', 'handlebars', 'tips', 'cookie', 'autoComplete'], function (util, indexCss, handlebars, tips, cookie) {

    //banner
    var bannerUrl = require("img/advertise1.png");
    /*
     * 高考头条|高考日程
     * */
    //头条
    util.ajaxFun(util.INTERFACE_URL.getGkTopList, 'GET', {
        'type': 1
    }, function (res) {
        if (res.rtnCode == '0000000') {
            var template = handlebars.compile($("#gk-top-list").html());
            $('.headlines-list').html(template(res.bizData));
        }
    });
    //高考日程
    util.ajaxFun(util.INTERFACE_URL.getScheduleList + '?scheduleRows=3', 'get', {isIndex: 'false'}, function (res) {
        if (res.rtnCode == '0000000') {
            var template = handlebars.compile($("#gk-schedule-list").html());
            $('#schedule-list').html(template(res));
        }
    });
    //[智],首页用户量统计
    util.ajaxFun(util.INTERFACE_URL.getIndexUserCount, 'get', {}, function (res) {
        if (res.rtnCode == '0000000') {
            $('.num1').html(res.bizData.registeUserCount);
        }
    });

    //会员信息
    var vipEndDate = cookie.getCookieValue('vipEndDate');
    $('#vip-end-date').html(vipEndDate.substr(0, 10));
    if (cookie.getCookieValue('isLogin')) {
        $('.login-into').hide();
        if (cookie.getCookieValue('vipStatus') == '0') {
            $('.noVip').show();
        } else {
            $('.isVip').show();
            $('.intro-vip-login').show();
            $('.intro-login').hide();
        }
    }
    //在线升级
    $('.btn-level-up').on('click', function () {
        if (!cookie.getCookieValue('isLogin')) {
            $('.vip-tips').text('请先登录后再进行升级').show().fadeIn(2000).fadeOut(2000);
            return;
        }
        if ($.trim($('#pay-card').val()) == "") {
            $('.vip-tips').text('卡号不能为空').show().fadeIn(2000).fadeOut(2000);
            return;
        }
        if ($.trim($('#pay-card').val()).length != 10 && $.trim($('#pay-card').val()).length != 8) {
            $('.vip-tips').text('请输入正确的卡号').show().fadeIn(2000).fadeOut(2000);
            return;
        }
        if ($.trim($('#pay-password').val()) == "") {
            $('.vip-tips').text('卡密码不能为空').show().fadeIn(2000).fadeOut(2000);
            return;
        }
        if ($.trim($('#pay-password').val()).length != 10) {
            $('.vip-tips').text('请输入正确的卡密码').show().fadeIn(2000).fadeOut(2000);
            return;
        }
        util.ajaxFun(util.INTERFACE_URL.upgradeVipByCard, 'POST', {
            "cardNumber": $('#pay-card').val(),
            "password": $('#pay-password').val()
        }, function (res) {
            if (res.rtnCode == '0000000') {
                var vipStatus = res.bizData.vipStatus;
                var vipActiveDate = res.bizData.vipActiveDate;
                var vipEndDate = res.bizData.vipEndDate;
                util.cookie.setCookie("vipStatus", vipStatus, 4, "");
                util.cookie.setCookie("vipActiveDate", vipActiveDate, 4, "");
                util.cookie.setCookie("vipEndDate", vipEndDate, 4, "");
                $('.vip-tips').text("申请成功").fadeIn(1000).fadeOut(1000);
                window.location.assign('http://' + window.location.host + '/user-vip.html');
            } else {
                $('.vip-tips').text(res.msg).fadeIn(1000).fadeOut(1000);
            }
            if (res.rtnCode == '0900002' || res.rtnCode == '0900001') {
                $('.vip-tips').text(res.msg).fadeIn(1000).fadeOut(1000);
            }
        });
    });
    /*
     * ================================================
     * index切换(目标定位|智能填报)
     * ================================================
     * */
    //$('.toggle-title span').click(function () {
    //    $(this).addClass('active').siblings().removeClass('active');
    //    var n = $(this).index();
    //    $('.toggle-content').hide().eq(n).fadeIn(500);
    //});
    //目标定位
    $('#report-btn').on('click', function () {
        if (!util.cookie.getCookieValue('isLogin')) {
            tips('#tips', '请先登录后再操作!');
            return false;
        }
        var targetScoreV = $.trim($('#target-score').val());
        var targetSchoolV = escape($.trim($('#target-school').val()));
        var targetCheckV = $('input:radio[name="mwl"]:checked').val();
        if (targetScoreV == '') {
            tips('#tips', '请输入分数!');
            return false;
        }
        if (targetSchoolV == '') {
            tips('#tips', '请输入目标院校!');
            return false;
        }
        if (targetCheckV == undefined) {
            tips('#tips', '请选择文理');
            return false;
        }
        window.location.assign('/user-target.html?targetScoreV=' + targetScoreV + '&targetSchoolV=' + targetSchoolV+"&targetCheckV="+targetCheckV);
    });
    /*
     * 智能填报切换状态
     * 6.7号展示智能填报高亮切换
     * 判断用户是否登录,判断用户是否是vip,判断用户是否输入
     * */
    //var data = new Date();
    //var nowMonth = data.getMonth() + 1;
    //var nowDate = data.getDate();
    //if (nowMonth >= 6 && nowDate >= 7) {
    //    $('#intelligent').addClass('active').siblings().removeClass('active');
    //}
    $('#fillIn').click(function () {
        if (!util.cookie.getCookieValue('isLogin')) {
            tips('#tips', '请先登录后再操作!');
            return false;
        }
        var nowScore = $.trim($('#now-score').val());
        var nowPrecedence = $.trim($('#now-Precedence').val());
        var checkBoxVal = $('input:radio[name="wl"]:checked').val();
        if (nowScore == '' || nowScore.length > 3) {
            tips('#tips', '当前分数输入有误');
            return false;
        }
        if (nowPrecedence == '') {
            tips('#tips', '请输入位次');
            return false;
        }
        if (checkBoxVal == undefined) {
            tips('#tips', '请选择文理');
            return false;
        }
        window.location.assign('./predict-volunteer.html?nowScore=' + nowScore + '&nowPrecedence=' + nowPrecedence + '&checkBoxVal=' + checkBoxVal);
    });
    require('./components/mapData.js');



    $('#report-btn').on('click',function(){
        sa.track('index_start_pos_btn')
    })
});
