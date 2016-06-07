define(['commonjs', 'cookie'], function (util, cookie) {
    require('../css/user/user-account-info.css');
    require('../js/utils/pingpp-pc.js');
    $(function () {
        var token = cookie.getCookieValue('token');
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
        //敬请期待
        var expectImg = require('../img/expectImg.png');
        $('.expect-module').attr('src',expectImg);
        var vipBanner = require('../img/vip-module-banner.jpg');
        $('#vipBanner').attr('src', vipBanner);


        util.ajaxFun(util.INTERFACE_URL.getFindProduct, 'GET', {
            code: 10000002
        }, function (result) {
            console.log(result)
            if (result.rtnCode == '0000000') {
                var price = result.bizData.price,
                    userId = result.bizData.id,
                    validValue = result.bizData.validValue,
                    vipCode = result.bizData.code;
                $('#pay-price').text(price);

                //创建订单
                $('#createOrderBtn').on('click', function () {
                    var products = [];
                    var product = {};
                    product["productCode"] = vipCode;
                    product["productNum"] = 1;
                    product["unitPrice"] = price;
                    product["validValue"] = validValue;
                    products[0] = product;
                    var pay = {
                        "userId": userId
                    };
                    pay["products"] = JSON.stringify(products);
                    var extra = {};
                    var hrefUrl = encodeURIComponent(window.location.href.substr(7));
                    //extra["success_url"] = "http://dev.service.zhigaokao.cn/payCallback.do?token="+token+"&returnUrl="+window.location.href;
                    extra["success_url"] = "http://172.16.160.90:8080/payCallback.do?token="+token;
                    pay["returnUrl"] = hrefUrl;
                    pay["channel"] = 'alipay_pc_direct';
                    pay["extra"] = JSON.stringify(extra);
                    console.log(JSON.parse(pay.products));
                    console.log(pay);
                    $.ajax({
                        url: util.INTERFACE_URL.getCreateOrders+"?token="+token,
                        type: 'GET',
                        dataType: 'JSON',
                        data: pay,
                        success: function (result) {
                            console.log(1);
                            console.log(result);
                            if (result.rtnCode === '0900001') {
                                alert(result.msg)
                            }
                            if (result.rtnCode === '0000000') {

                                var charge = result.bizData;
                                console.log('成功')
                                console.log(charge)
                                pingppPc.createPayment(charge, function (result, error) {
                                    console.log("result:" + result);
                                    console.log("error:" + error);
                                    var first = "http://";
                                    if (result == "success") {
                                        // 微信公众账号支付的结果会在这里返回
                                        //window.location.href = first + window.location.host + '/success.jsp';
                                    } else if (result == "fail") {
                                        // charge 不正确或者微信公众账号支付失败时会在此处返回
                                        //window.location.href = first+window.location.host + '/fail.jsp';
                                    } else if (result == "cancel") {
                                        // 微信公众账号支付取消支付
                                        //window.location.href = first+window.location.host + '/index.jsp';
                                    }
                                });
                            }
                        }
                    });
                })
            } else {
              util.checkLoginTimeout(res);
            }
        });

        //高考志愿卡升级
        var phone = cookie.getCookieValue('phone');
        console.log(phone)
        $('.phone').val(phone);

        $('#accountBtn').on('click', function () {
            if ($.trim($('#pay-card').val()) == "") {
                $('.error-tips').text("卡号不能为空").fadeIn(1000).fadeOut(1000);
                return;
            }
            if ($.trim($('#pay-card').val()).length != 10 && $.trim($('#pay-card').val()).length != 8) {
                $('.error-tips').text("请输入正确的卡号").fadeIn(1000).fadeOut(1000);
                return;
            }
            if ($.trim($('#pay-password').val()) == "") {
                $('.error-tips').text("卡密码不能为空").fadeIn(1000).fadeOut(1000);
                return;
            }
            if ($.trim($('#pay-password').val()).length != 10) {
                $('.error-tips').text("请输入正确的卡密码").fadeIn(1000).fadeOut(1000);
                return;
            }

            util.ajaxFun(util.INTERFACE_URL.upgradeVipByCard, 'POST', {
                "cardNumber": $('#pay-card').val(),
                "password": $('#pay-password').val()
            }, function (res) {
                console.log(res)
                if (res.rtnCode == '0000000') {
                    var vipStatus = res.bizData.vipStatus;
                    var vipActiveDate = res.bizData.vipActiveDate;
                    var vipEndDate = res.bizData.vipEndDate;
                    util.cookie.setCookie("vipStatus", vipStatus, 4, "");
                    util.cookie.setCookie("vipActiveDate", vipActiveDate, 4, "");
                    util.cookie.setCookie("vipEndDate", vipEndDate, 4, "");
                    $('.error-tips').text("升级成功").fadeIn(1000).fadeOut(1000);
                    window.location.assign('http://'+ window.location.host +'/user-vip.html');
                }else{
                    $('.error-tips').text(res.msg).fadeIn(1000).fadeOut(1000);
                    util.checkLoginTimeout(res);
                }

                if (res.rtnCode == '0900002' || res.rtnCode == '0900001') {
                    $('.error-tips').text(res.msg).fadeIn(1000).fadeOut(1000);

                }
            });
        });

        var vipIntroData = [
            '<p>升级智高考VIP有两种方式：<br/>1、在线购买升级<br/> 2、绑定VIP卡升级。进入“个人中心”模块，点击“VIP特权”即可选择方式，并进行升级操作。</p>',
            '进入“个人中心”模块，点击“VIP特权”即可在线支付进行VIP购买，购买成功后您的账号将自动激活成为VIP用户。',
            '线下购买智高考志愿填报绿色通道产品盒后，登录智高考官网，进入个人中心的“VIP特权”页面，在高考志愿卡升级中，输入志愿卡的卡号和密码即可进行升级。',
            '升级成为VIP后，可免费观看高考学堂全部视频；进行权威职业测评服务；在线浏览数据库资料，全国各大高等院校专业资料；提前熟悉志愿填报流程，享受智能推荐填报志愿服务。'
        ];

        $('#vip-intro-tab').on('click', '.tab', function () {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('#vip-intro-content').html(vipIntroData[index]);

        });
        setInterval(function () {
            var tNum = Math.round(Math.random() * 3);
            $('#vip-intro-tab .tab:eq("' + tNum + '")').click();
        }, 2500);
        $('#vip-intro-tab .tab:eq(0)').click();


        var urlDomain = window.location.hostname + '';
        var urlArr = urlDomain.split('.');
        var provinceKey = urlArr[0];


        if (provinceKey == "gx") {
            $('.expect-module').hide();
            $('.show-price-box').show();
            $('#pay-price').text('580');
        }




    });
});
