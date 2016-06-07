/*
 *  pdeng
 */
define(['commonjs', 'tips', 'cookie', 'handlebars'], function (util, tips, cookie, handlebars) {
    require('../css/volunteer/predict-professional.css');
    $(function () {
        // banner
        var volunteerBannerImg = '<img src="' + require('../img/volunteer-banner.jpg') + '" />';
        $('.volunteer-banner').html(volunteerBannerImg);









        /*
         * 拉取评测项目列表
         * */
        util.ajaxFun(util.INTERFACE_URL.getEvaluationList, 'get', {}, function (res) {
            util.checkLoginTimeout(res);
            if (res.rtnCode == '0000000') {
                //var res = {
                //    "bizData": {
                //        "apeskObj": [
                //            {
                //                "createDate": 1456475070000,
                //                "gradeDescribe": "适用于所有年级",
                //                "introduce": "霍兰德提出的6种基本职业类型：实用型R、研究型I、艺术型A、社会型S、企业型E、常规型C，主要用于确定被测试者的职业兴趣倾向,进而用于指导被测试者选择适合自身职业兴趣的专业发展方向和职业发展方向，帮助高中生提前规划职业方向。",
                //                "name": "霍兰德职业兴趣测试",
                //                "num": 1,
                //                "picUrl": "/images/forground/ass03.jpg",
                //                "reportDate": 1457856847000,
                //                "reportId": 985219,
                //                "reportUrl": "http://www.apesk.com/mensa/common_report_getid/holland2_report_getid.asp?id=",
                //                "userId": 53,
                //                "type":1
                //            },
                //            {
                //                "createDate": 1456475070000,
                //                "gradeDescribe": "适用于所有年级",
                //                "introduce": "霍兰德提出的6种基本职业类型：实用型R、研究型I、艺术型A、社会型S、企业型E、常规型C，主要用于确定被测试者的职业兴趣倾向,进而用于指导被测试者选择适合自身职业兴趣的专业发展方向和职业发展方向，帮助高中生提前规划职业方向。",
                //                "name": "霍兰德职业兴趣测试",
                //                "num": 0,
                //                "picUrl": "/images/forground/ass03.jpg",
                //                "reportDate": 1457856847000,
                //                "reportId": 985219,
                //                "reportUrl": "http://www.apesk.com/mensa/common_report_getid/holland2_report_getid.asp?id=",
                //                "userId": 53,
                //                "type":2
                //            },
                //            {
                //                "createDate": 1456475070000,
                //                "gradeDescribe": "适用于所有年级",
                //                "introduce": "霍兰德提出的6种基本职业类型：实用型R、研究型I、艺术型A、社会型S、企业型E、常规型C，主要用于确定被测试者的职业兴趣倾向,进而用于指导被测试者选择适合自身职业兴趣的专业发展方向和职业发展方向，帮助高中生提前规划职业方向。",
                //                "name": "霍兰德职业兴趣测试",
                //                "num": 2,
                //                "picUrl": "/images/forground/ass03.jpg",
                //                "reportDate": 1457856847000,
                //                "reportId": 985219,
                //                "reportUrl": "http://www.apesk.com/mensa/common_report_getid/holland2_report_getid.asp?id=",
                //                "userId": 53,
                //                "type":3
                //            }
                //        ]
                //    },
                //    "rtnCode": "0000000",
                //    "ts": 1462867230858
                //};
                handlebars.registerHelper('sEvaluation', function (data) {
                    var sum = 2;//测评总数
                    var num = sum - parseInt(data);
                    num == 0 ? num = "您的机会已经用完了" : num = '您还剩下' + num + '次测评机会';
                    return num;
                });
                handlebars.registerHelper('lock', function (data) {
                    var sum = 2;//测评总数
                    var num = sum - parseInt(data);
                    //flag判断是否可评测 1可评测,0不可评测
                    return num == 0 ? 0 : 1;
                });
                //个性化设置背景
                $.each(res.bizData.apeskObj, function (i, v) {
                    v.class = i + 1;
                });
                var template = handlebars.compile($("#evaluation-tpl").html());
                var html = template(res.bizData);
                $('#evaluation').append(html);
                if (cookie.getCookieValue('vipStatus') == 1) {
                    //vip展示次数
                    $('.deline-chance').removeClass('hide');
                }
                $(document).on('click', '.star-evaluate', function () {
                    if (!util.isLogin()) {
                        window.location.href = '/login.html';
                        return false;
                    }
                    //非vip
                    if (cookie.getCookieValue('vipStatus') == 0) {
                        tips('#tips', '您还不是vip,请升级vip后使用 !');
                        return false;
                    }
                    var _this = $(this);
                    if (parseInt(_this.attr('flag')) == 1) {
                        window.location.href = '/volunteer-detail.html?Type=' + _this.attr('ctype');
                    }
                });
                // 专业测试图片加载 | 注意图片[1,2,3,4]
                $('.j-img1').attr('src', require('../img/evaluate-1.png'));
                $('.j-img2').attr('src', require('../img/evaluate-2.png'));
                $('.j-img3').attr('src', require('../img/evaluate-3.png'));
                $('.j-img4').attr('src', require('../img/evaluate-4.png'));

                if(util.provinceKey=='sh' || util.provinceKey=='zj' || util.provinceKey=='tj'){
                    $('.common-row.row1').remove();
                }
            }
        });
    });
});
