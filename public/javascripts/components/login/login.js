define(['commonjs','tips','md5','timeFormat'], function (util,tips,md5,getTime) {

    var domain = util.domain; // 正式

    require('base64');
    $(function () {
        // 登录提交
        $('#submit-btn').on('click', function () {
            var loginPhoneV = $.trim($('#login-phone').val()),
                loginPwdV = $.trim($('#login-pwd').val());
            if (loginPhoneV == "") {
                tips('#tips', '请输入手机号');
                return false;
            }
            var regMobile = /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/;
            var mobileResult = regMobile.test(loginPhoneV);
            if (mobileResult == false) {
                tips('#tips', '手机号有误,请重新输入');
                return false;
            }
            if (loginPwdV == "") {
                tips('#tips', '请输入密码');
                return false;
            }
            var md5loginPwdV = $.md5(loginPwdV);
            $.base64.utf8encode = true;
            var basePassword = $.base64.btoa(loginPwdV);
            util.ajaxFun(util.INTERFACE_URL.postLogin, 'POST', {
                account: loginPhoneV,
                password: md5loginPwdV,
                basePassword:basePassword
            }, function (res) {
                util.checkLoginTimeout(res);
                if (res.rtnCode === "0000000") {
                    sa.track('login_submit');
                    $(this).attr('disabled','disabled');
                    //alert("登录用户名: " + res.bizData.userInfo.name);
                    var token = res.bizData.token;
                    var userName = res.bizData.userInfo.name;
                    var icon = res.bizData.userInfo.icon;
                    var vipStatus = res.bizData.userInfo.vipStatus;
                    var subjectType = res.bizData.userInfo.subjectType;
                    var phone = res.bizData.userInfo.account;
                    var userKey = res.bizData.userInfo.userKey;
                    var imgIco = require('../../../img/icon_default.png');
                    if (icon == '' || icon == null || icon== undefined) {
                        localStorage.icon = imgIco;
                    } else {
                        localStorage.icon = res.bizData.userInfo.icon;
                    }
                    if(res.bizData.userInfo.activeDate || res.bizData.userInfo.endDate){
                        var vipActiveDate = getTime(res.bizData.userInfo.activeDate);
                        var vipEndDate = getTime(res.bizData.userInfo.endDate);
                        util.cookie.setCookie("vipActiveDate", vipActiveDate, 4, "");
                        util.cookie.setCookie("vipEndDate", vipEndDate, 4, "");
                    }
                    util.cookie.setCookie("token", token, 4, "");
                    util.cookie.setCookie("isLogin", "true", 4, "");
                    util.cookie.setCookie("userName", userName, 4, "");
                    util.cookie.setCookie("vipStatus", vipStatus, 4, "");
                    util.cookie.setCookie("phone",phone, 4, "");
                    util.cookie.setCookie("userKey",userKey, 4, "");
                    window.location.assign('http://' + $.trim(userKey) + '.'+ domain +'/index.html');
                    //var refer=document.referrer;
                    //if( refer.match('zhigaokao')) {
                    //  if( refer.match('login')) {
                    //    window.location.href = '/index.html';
                    //  } else {
                    //    window.location.href = refer;
                    //  }
                    //} else {
                    //  window.location.href = '/';
                    //}
                } else {
                    tips('#tips', res.msg);
                }
            });
        });
        $('#login-pwd').keydown(function() {
            if (event.keyCode == 13) {
                $('#submit-btn').click();
            }
        });
    });


});
