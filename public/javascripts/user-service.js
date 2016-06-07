define(['commonjs'], function (util) {
    require('../css/user/user-account-info.css');
    $(function () {
        var yxxxImg = require('../img/yxxx-img.png');
        $('#yxxx-img').attr('src',yxxxImg);
        var zyxxImg = require('../img/zyxx-img.png');
        $('#zyxx-img').attr('src',zyxxImg);
        var zyxxsImg = require('../img/zyxxs-img.png');
        $('#zyxxs-img').attr('src',zyxxsImg);
        var lqnyyc = require('../img/lqnyyc.png');
        $('#lqnyyc').attr('src',lqnyyc);
        var yxyc = require('../img/yxyc.png');
        $('#yxyc').attr('src',yxyc);

        var zytb = require('../img/zytb.png');
        $('#zytb').attr('src',zytb);
        var zypc = require('../img/zypc.png');
        $('#zypc').attr('src',zypc);
        var gkxt = require('../img/gkxt.png');
        $('#gkxt').attr('src',gkxt);


        var cookie = require('cookie');
        /*
         * banner部分数据,表单数据自动录入
         * */
        $('#banner-info').prepend(require('html!../user-banner.html'));
        var forecastSchool = util.getLinkey(encodeURIComponent('forecastSchool'));
        $('.user-name').text(cookie.getCookieValue('userName'));
        if (cookie.getCookieValue('vipStatus') == 0) {
            $('#btn-vip,#user-type').show();
            $('#vip-box').hide();
        } else {
            $('#btn-vip,#user-type').hide();
            $('#vip-box').show();
        }
        var targetScoreV = util.cookie.getCookieValue('achievement');
        var targetSchoolV = util.cookie.getCookieValue('universityName');
        var subjectType = util.cookie.getCookieValue('subjectType');
        if (targetSchoolV != 'undefined') {
            $('#university-name').text(targetSchoolV);
            $('#target-school').val(targetSchoolV);
        } else {
            $('.score-and-school').hide();
        }
        if (targetScoreV != 'undefined') {
            $('#university-score').text(targetScoreV);
            $('#target-score').val(targetScoreV);
        } else {
            $('.score-and-school').hide();
        }
        var icon = cookie.getCookieValue('icon');
        var imgIco = require('../img/icon_default.png');
        if (icon == 'undefined') {
            icon = imgIco;
        }
        var userName = cookie.getCookieValue('userName');
        var vipStatus = cookie.getCookieValue('vipStatus');
        var vipActiveDate = cookie.getCookieValue('vipActiveDate');
        var vipEndDate = cookie.getCookieValue('vipEndDate');
        if (vipStatus != 0) {
            //是vip
            $('#btn-vip,#user-type,.vip-end').hide();
            $('#vip-box,.vip-end-text').show();
            if(vipActiveDate && vipActiveDate){
                $('#vip-date').text("VIP时效:从"+vipActiveDate.substr(0,10)+"到"+vipEndDate.substr(0,10));
            }
        } else {
            //不是vip
            $('#btn-vip,#user-type,.vip-end').show();
            $('#vip-box,.vip-end-text').hide();
        }



    });



});



