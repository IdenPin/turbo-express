define(['commonjs', 'tips', 'timeFormat', 'uploadFun', 'cookie','autoComplete'], function (util, tips, timeFormat, uploadFun, cookie) {
    require('../css/user/user-account-info.css');
    require('webuploaderCss');
    require('../lib/laydate-master/need/laydate.css');
    require('../lib/laydate-master/skins/default/laydate.css');
    require('laydateJs');
    var dialog = require('dialog');


    /*
     * banner部分数据,表单数据自动录入
     * */
    var phoneNum = cookie.getCookieValue('phone');
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

    $(function () {


        //var jsonObj = {
        //                  "bizData":
        //                      {"batchViews":[
        //                          {"batch":"1","conform":true,"first":true,"liLine":"577","liPlus":10,"line":true,"recommend":false,"wenLine":"573","wenPlus":5},
        //                          {"batch":"2","conform":true,"first":false,"liLine":"483","liPlus":10,"line":false,"recommend":true,"wenLine":"474","wenPlus":5},
        //                          {"batch":"4-1","conform":true,"first":false,"liLine":"483","liPlus":10,"line":false,"recommend":true,"wenLine":"474","wenPlus":5},
        //                          {"batch":"4-2","conform":true,"first":false,"liLine":"483","liPlus":10,"line":false,"recommend":true,"wenLine":"474","wenPlus":5},
        //                          {"batch":"4-3","conform":true,"first":false,"liLine":"483","liPlus":10,"line":false,"recommend":true,"wenLine":"474","wenPlus":5},
        //                          {"batch":"3-1","conform":true,"first":false,"liLine":"407","liPlus":10,"line":false,"recommend":false,"wenLine":"403","wenPlus":5},
        //                          {"batch":"3-2","conform":true,"first":false,"liLine":"280","liPlus":10,"line":false,"recommend":false,"wenLine":"270","wenPlus":5}
        //                                   ]
        //                      },
        //                      "rtnCode":"0000000",
        //                      "ts":1464781240400
        //              };
        //
        //$.each(jsonObj.bizData.batchViews, function(i, v){
        //    //alert(i + ", " + jsonObj.bizData.batchViews[0].liLine + ", 长度: " + jsonObj.bizData.batchViews.length + ", " + v.batch.substr(0, 1));
        //    //alert(i + ", " + parseInt(v.batch.substr(0, 1)));
        //    console.log("排序前数据: " + v.batch + ", liLine: " + v.liLine);
        //});
        //for(var i = 0; i < jsonObj.bizData.batchViews.length - 1; i++)
        //{
        //    for(var j = 0; j < jsonObj.bizData.batchViews.length - 1 - i; j++)
        //    {
        //        if(parseInt(jsonObj.bizData.batchViews[j].batch.substr(0, 1)) > parseInt(jsonObj.bizData.batchViews[j+1].batch.substr(0, 1)))
        //        {
        //            var tmp_batch = jsonObj.bizData.batchViews[j].batch;
        //            jsonObj.bizData.batchViews[j].batch = jsonObj.bizData.batchViews[j+1].batch;
        //            jsonObj.bizData.batchViews[j+1].batch = tmp_batch;
        //
        //            var tmp_conform = jsonObj.bizData.batchViews[j].conform;
        //            jsonObj.bizData.batchViews[j].conform = jsonObj.bizData.batchViews[j+1].conform;
        //            jsonObj.bizData.batchViews[j+1].conform = tmp_conform;
        //
        //            var tmp_first = jsonObj.bizData.batchViews[j].first;
        //            jsonObj.bizData.batchViews[j].first = jsonObj.bizData.batchViews[j+1].first;
        //            jsonObj.bizData.batchViews[j+1].first = tmp_first;
        //
        //            var tmp_liLine = jsonObj.bizData.batchViews[j].liLine;
        //            jsonObj.bizData.batchViews[j].liLine = jsonObj.bizData.batchViews[j+1].liLine;
        //            jsonObj.bizData.batchViews[j+1].liLine = tmp_liLine;
        //
        //            var tmp_liPlus = jsonObj.bizData.batchViews[j].liPlus;
        //            jsonObj.bizData.batchViews[j].liPlus = jsonObj.bizData.batchViews[j+1].liPlus;
        //            jsonObj.bizData.batchViews[j+1].liPlus = tmp_liPlus;
        //
        //            var tmp_line = jsonObj.bizData.batchViews[j].line;
        //            jsonObj.bizData.batchViews[j].line = jsonObj.bizData.batchViews[j+1].line;
        //            jsonObj.bizData.batchViews[j+1].line = tmp_line;
        //
        //            var tmp_recommend = jsonObj.bizData.batchViews[j].recommend;
        //            jsonObj.bizData.batchViews[j].recommend = jsonObj.bizData.batchViews[j+1].recommend;
        //            jsonObj.bizData.batchViews[j+1].recommend = tmp_recommend;
        //
        //            var tmp_wenLine = jsonObj.bizData.batchViews[j].wenLine;
        //            jsonObj.bizData.batchViews[j].wenLine = jsonObj.bizData.batchViews[j+1].wenLine;
        //            jsonObj.bizData.batchViews[j+1].wenLine = tmp_wenLine;
        //
        //            var tmp_wenPlus = jsonObj.bizData.batchViews[j].wenPlus;
        //            jsonObj.bizData.batchViews[j].wenPlus = jsonObj.bizData.batchViews[j+1].wenPlus;
        //            jsonObj.bizData.batchViews[j+1].wenPlus = tmp_wenPlus;
        //        }
        //    }
        //}
        //
        //$.each(jsonObj.bizData.batchViews, function(i, v){
        //    console.log("排序后数据: " + v.batch + ", liLine: " + v.liLine);
        //});

        $('#modify-pwd').on('click', function () {
            var formHtml = ''
                + '        <form class="form-horizontal modify-pwd-form">'
                + '    <div class="form-group">'
                + '        <div class="col-sm-12">'
                + '            <div class="account-number">'
                + '        <b>登录账号</b><span class="number" id="user-phone">'+ phoneNum +'</span>'
                + '    </div>'
                + '        </div>'
                + '    </div>'
                + '    <div class="form-group">'
                + '        <label class="sr-only" for="current-psd">当前密码</label>'
                + '        <div class="col-sm-12">'
                + '            <input type="password" class="form-control" id="current-psd" placeholder="当前密码">'
                + '        </div>'
                + '    </div>'
                + '    <div class="form-group">'
                + '        <label class="sr-only" for="new-psd">新密码</label>'
                + '        <div class="col-sm-12">'
                + '            <input type="password" class="form-control" id="new-psd" placeholder="新密码">'
                + '        </div>'
                + '    </div>'
                + '    <div class="form-group">'
                + '        <label class="sr-only" for="confirm-psd">确认密码</label>'
                + '        <div class="col-sm-12">'
                + '            <input type="password" class="form-control" id="confirm-psd" placeholder="确认密码">'
                + '        </div>'
                + '    </div>'
                + '    <div class="form-group modify-pwd-btn-box">'
                + '<div class="col-sm-12">'
                + '<div id="tips-pwd" class="alert alert-danger" role="alert"></div>'
                + '        <button class="btn btn-primary modify-pwd-btn" type="button" id="modify-pwd-btn">提交</button>'
                + '        <span id="tips"></span>'
                + '    </div>'
                + '    </div>'
                + '    </form>';
            dialog('修改密码', formHtml);

            //修改密码
            $('body').on('click', '#modify-pwd-btn', function () {
                var currentPsd = $('#current-psd');
                var newPsd = $('#new-psd');
                var confirmPsd = $('#confirm-psd');
                if (currentPsd.val() == '') {
                    tips('#tips-pwd', '当前密码不能为空');
                    return false;
                }
                if ($.trim(currentPsd.val()).length > 16 && $.trim(currentPsd.val()).length < 6) {
                    tips('#tips-pwd', '密码输入有误，6-16位');
                    return false;
                }
                if (newPsd.val() == '') {
                    tips('#tips-pwd', '新密码不能为空');
                    return false;
                }
                if ($.trim(newPsd.val()).length > 16 && $.trim(newPsd.val()).length < 6) {
                    tips('#tips-pwd', '新输入有误，6-16位');
                    return false;
                }
                if (confirmPsd.val() == '') {
                    tips('#tips-pwd', '确认密码不能为空');
                    return false;
                }
                if ($.trim(confirmPsd.val()).length > 16 && $.trim(confirmPsd.val()).length < 6) {
                    tips('#tips-pwd', '新输入有误，6-16位');
                    return false;
                }
                if ($.trim(confirmPsd.val()) != $.trim(newPsd.val())) {
                    tips('#tips-pwd', '两次密码输入不一致');
                    return false;
                }
                util.ajaxFun(util.INTERFACE_URL.postModifyPassword, 'POST', {
                    oldPassword: currentPsd.val(),//旧密码
                    password: newPsd.val()//新密码
                }, function (res) {
                    if (res.rtnCode == '0000000') {
                        window.location.href = 'http://' + window.location.host + '/login.html';
                    } else {
                        tips('#tips-pwd', res.msg);
                    }
                });
            });
        });
        laydate({
            elem: '#user-birthday',
            festival: true,
            istoday: false,
            min: '1960-01-01 00:00:00',
            max: '2010-01-01 00:00:00'
        });
        //获取用户信息
        util.ajaxFun(util.INTERFACE_URL.getUserInfo, 'GET', {}, function (res) {
            if (res.rtnCode == '0000000') {
                //alert("非VIP用户: " + res.bizData);
                var personListData = res.bizData;
                var avatar = '';
                var imgIco = require('../img/icon_default.png');
                if (personListData.icon == '' || personListData.icon == null) {
                    avatar = imgIco;
                } else {
                    avatar = personListData.icon;
                }
                //alert("用户名: " + personListData.name);
                $('#header-user-name').text(personListData.name);
                $('.number').text(cookie.getCookieValue('phone'));
                $('#avatar-img,.user-avatar').attr('src', avatar);
                $('#user-name').val(personListData.name);
                $('#school-name').val(personListData.schoolName);
                $('#user-birthday').val(personListData.birthdayDate ? timeFormat(personListData.birthdayDate, 'yyyy-MM-dd') : '1970-01-01');
                $('input[name="sex"][value="' + personListData.sex + '"]').attr('checked', true);
                $('input[name="subject"][value="' + personListData.subjectType + '"]').attr('checked', true);
                $('#user-email').val(personListData.mail);
                $('#user-qq').val(personListData.qq);
                $('.QR-code').attr('src', personListData.qrCodeUrl);
                //查看二维码
                $('.QR-code-box img').click(function () {
                    dialog('我的二维码', "<img src='" + personListData.qrCodeUrl + "' id='view-qrCode'>");
                });
                var tagName = ['高中三年级', '高中一年级', '高中二年级', '高中三年级'];
                $('#grade').val(tagName[personListData.grade]);
                window.localStorage.icon = avatar;
                util.cookie.setCookie("userName", personListData.name, 4, "");
                util.cookie.setCookie('subjectType', personListData.subjectType, 4, '');
                util.cookie.setCookie('subjectType', personListData.subjectType, 4, '');
            } else {
                util.checkLoginTimeout(res);
            }
        });

        function transdate(endTime) {
            var date = new Date();
            date.setFullYear(endTime.substring(0, 4));
            date.setMonth(endTime.substring(5, 7) - 1);
            date.setDate(endTime.substring(8, 10));
            date.setHours(endTime.substring(11, 13));
            date.setMinutes(endTime.substring(14, 16));
            date.setSeconds(endTime.substring(17, 19));
            return Date.parse(date) / 1000;
        }


        // 登录提交
        $('#submit-btn').on('click', function () {
            //修改信息
            var sex = $('input[name="sex"]:checked').val()
                , subject = $('input[name="subject"]:checked').val()
                , school = $.trim($('#school-name').val())
                , str = $.trim($('#user-birthday').val())
                , birthdayDate = transdate(str)
                , name = $.trim($('#user-name').val()) // 用户名

            if (name.length == 0) {
                tips('#tips', '用户名不能为空');
                return false;
            }
            if (name.length > 14) {
                tips('#tips', '用户名不能大于14个字');
                return false;
            }
            if (school.length == 0) {
                tips('#tips', '学校名不能为空');
                return false;
            }
            if (school.length > 20) {
                tips('#tips', '学校名不能大于20个字');
                return false;
            }
            var qq = $.trim($('#user-qq').val());
            var mail = $.trim($('#user-email').val());

            if (qq.length != 0 || mail.length != 0) {
                var mail_reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!mail_reg.test(mail)) {
                    tips('#tips', '邮箱填写有误');
                    return false;
                }
                var qq_reg = /^\s*[.0-9]{5,11}\s*$/;
                if (!qq_reg.test(qq) || qq.length > 20) {
                    tips('#tips', 'QQ号码输入有误');
                    return false;
                }
            }
            var img_url = $('#avatar-img').attr('src');

            var provinceId = $('#province').val(),
                cityId = $('#city').val(),
                countyId = $('#county').val();
            util.ajaxFun(util.INTERFACE_URL.postUpdateUserInfo, 'POST', {
                name: name,
                provinceId: provinceId,
                cityId: cityId,
                countyId: countyId,
                schoolName: school,
                sex: sex,
                birthdayDate: birthdayDate,
                subjectType: subject,
                mail: mail,
                icon: img_url,
                qq: qq
            }, function (res) {
                console.log(res)
                if (res.rtnCode == '0000000') {
                    tips('#tips', '信息更新成功');
                    window.location.href = "/user-account-info.html";
                    $('#header-user-name').text($('#user-name').val());
                } else {
                    tips('#tips', res.msg);
                    util.checkLoginTimeout(res);
                }
            });


        });


    });


});


