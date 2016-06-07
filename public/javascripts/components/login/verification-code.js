define(['commonjs', 'tips','./verification-code.js'], function (util, tips) {

    $(function () {
        var captchaType = '0'; //0.注册标志  1 找回密码
        // 忘记密码
        $('#forget-psd').on('click', function () {
            $('#forget-psd-title,#register-content').show();
            $('#login-reg-tab,#login-content,.areaSel,.place-grade').hide();
            $('#register-btn').text('确定');
            captchaType = '1';
            $('.login-register-box input[type="text"]').val("");
        });
        // 验证码获取
        $('#verification-btn').on('click', function () {
            var _this = $(this);
            var registerPhoneV = $.trim($('#register-phone').val());
            if (registerPhoneV == "") {
                tips('#tips2', '请输入手机号');
                return false;
            }
            var regMobile = /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/;
            var mobileResult = regMobile.test(registerPhoneV);
            if (mobileResult == false) {
                tips('#tips2', '手机号有误,请重新输入');
                return false;
            }
            util.ajaxFun(util.INTERFACE_URL.postConfirmAccountCode, 'POST', {
                type: captchaType,
                account: registerPhoneV
            }, function (res) {
                if (res.rtnCode === "0000000") {
                    util.ajaxFun(util.INTERFACE_URL.postVerificationCode, 'POST', {
                        type: captchaType,
                        account: registerPhoneV
                    }, function (res) {
                        if (res.rtnCode === "0000000") {
                            _this.attr({
                                'background-color': '#ccc',
                                'disabled': true
                            });
                            var s = (JSON.parse(res.bizData)).time;
                            var timer = setInterval(function () {
                                s--;
                                _this.text(s + '秒后重新获取');
                                if (s <= 0) {
                                    clearInterval(timer);
                                    _this.text('重新获取').css('background-color', '#d80c18');
                                    _this.attr('disabled', false)
                                }
                            }, 1000);
                        } else {
                            tips('#tips2', res.msg);
                        }
                    });
                } else {
                    tips('#tips2', res.msg);
                }
            });

        });
    });
});

