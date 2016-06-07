/*
 *
 * 院校预测最终结果页 =====================================
 * 录取规则、提档线规则有时显示具体的规则，没有时显示无
 * 热度提醒：具有热度提醒时，显示热度提醒，没有热度提醒时，不显示该项。
 * 动态风险率：根据杨老师给出的动态风险率的形式再做调整。
 * 招生计划：显示的是总的招生计划
 * “智高考”报名人数、排名为空时显示
 * */
define(['commonjs', 'tips', 'handlebars', 'cookie', 'timeFormat', 'printArea', '../css/volunteer/predict-result-tpl1'], function (util, tips, handlebars, cookie, getTime, printArea) {
    //路由判断
    var Router = require('volunteerRouter');
    Router.router()
    var volunteerBanner = require('../img/volunteer-banner.jpg');
    var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
    $('.volunteer-banner').html(volunteerBannerImg);
    var finalInfoData = {
        "score": util.cookie.getCookieValue('volunteerScore'),
        "cate": util.cookie.getCookieValue('volunteerCate'),
        "province": util.cookie.getCookieValue('userKey')
    };
    handlebars.registerHelper('formatDate', function (data) {
        return getTime(data);
    });
    //filter-文理
    handlebars.registerHelper('sType', function (data) {
        var stype = '';
        data == 1 ? stype = '文史' : stype = '理工';
        return stype;
    });
    handlebars.registerHelper("isOne", function (data, options) {
        return (data == 1 ? options.fn(this) : options.inverse(this));
    });
    //filter-志愿
    handlebars.registerHelper('sequenceNum', function (data) {
        var sequenceNum = '';
        switch (data) {
            case 1:
                sequenceNum = 'A';
                break;
            case 2:
                sequenceNum = 'B';
                break;
            case 3:
                sequenceNum = 'C';
                break;
            case 4:
                sequenceNum = 'D';
                break;
            case 5:
                sequenceNum = 'E';
                break;
            case 6:
                sequenceNum = 'F';
                break;
            case 7:
                sequenceNum = 'G';
                break;
            case 8:
                sequenceNum = 'H';
                break;
            case 9:
                sequenceNum = 'I';
                break;
            case 10:
                sequenceNum = 'J';
                break;
        }
        return sequenceNum;
    });
    //fileter-省控线Provincial-control-line
    handlebars.registerHelper('controlLine', function (data) {
        var provinceYearLine = data.split('-');

        var nowYear = 2015;
        var strTpl = '';
        var upper = ["本科一批", "本科二批", "高职专科", "本科三批"];
        var tag = ["A", "B", "C", "D", "E", "F"];
        var provin = util.cookie.getCookieValue('userKey');
        provin == 'zj' ? provinceYearLine.length = 1 : provin == "js" ? provinceYearLine.length : provinceYearLine.length = 3;
        for (var i = 0; i < provinceYearLine.length; i++) {
            var provinceLine = provinceYearLine[i];
            var proArr = provinceLine.split("|");
            //var conlines=proArr.length>1?proArr[0]:
            if (proArr.length > 1) {
                for (var j = 0; j < proArr.length; j++) {
                    strTpl += "<li><i class='icon-item-li'></i>" + nowYear + '年本省' + upper[i] + tag[j] + '类省控线：' + proArr[j] + "分</li>";
                }
            } else {
                if (provinceLine > 0)
                    strTpl += "<li><i class='icon-item-li'></i>" + nowYear + '年本省' + upper[i] + '省控线：' + proArr[0] + "分</li>";
            }
        }
        return strTpl;
    });
    //filter-录取率
    handlebars.registerHelper('rate', function (data) {
        return data * 100 + '%';
    });
    //filter-6个专业
    handlebars.registerHelper('subjectSix', function (data, options) {
        if (util.cookie.getCookieValue('userKey') == 'hl') {
            return (data < 12 ? options.fn(this) : options.inverse(this));
        } else {
            return (data < 6 ? options.fn(this) : options.inverse(this));
        }
    });
    handlebars.registerHelper('subjectExtendSix', function (data, options) {
        if (util.cookie.getCookieValue('userKey') == 'hl') {
            return (data >= 12 ? options.fn(this) : options.inverse(this));
        } else {
            return (data >= 6 ? options.fn(this) : options.inverse(this));
        }
    });

    handlebars.registerHelper('subjectExtendSix', function (data, options) {
        //==============伪代码黑龙江12个专业========================
        if (util.cookie.getCookieValue('userKey') == 'hl') {
            return (data >= 12 ? options.fn(this) : options.inverse(this));
        } else {
            return (data >= 6 ? options.fn(this) : options.inverse(this));
        }
    });
    //==============伪代码========================

    handlebars.registerHelper('isCompl', function (data, options) {

        return (data == 2 ? options.fn(this) : options.inverse(this));
    });

    handlebars.registerHelper('isCompl2', function (data) {

        var dataNumTxt = ''
        if (data == 0) {
            dataNumTxt = "是";
        } else if (data == 1) {
            dataNumTxt = "否";
        } else {
            dataNumTxt = "部分服从";
        }
        return dataNumTxt;
    });
    //filter-序列化
    handlebars.registerHelper('parse', function (data) {
        return JSON.parse(data);
    })

    //filter-addOn
    handlebars.registerHelper('addOn', function (data) {
        return parseInt(data) + 1;
    })

    handlebars.registerHelper('exOn', function (data) {
        return parseInt(data) - 5;
    })

    //filter-length
    handlebars.registerHelper('len', function (data) {
        return data.splice(0, data.length);
    })
    /**
     * 梯度合理性评估
     */
    handlebars.registerHelper('isReasonable', function (data, options) {
        return (parseInt(data) === 1 ? options.fn(this) : options.inverse(this));
    });
    /**
     * 专业完整性评估
     */
    handlebars.registerHelper('isComplete', function (data, options) {
        return (parseInt(data) === 1 ? options.fn(this) : options.inverse(this));
    });

    handlebars.registerHelper('converEnrollFont', function (seq) {
        var fontStr = "无";
        switch (parseInt(seq)) {
            case 0:
                fontStr = "极低";
                break;
            case 1:
                fontStr = "较低";
                break;
            case 2:
                fontStr = "适中";
                break;
            case 3:
                fontStr = "较高";
                break;
        }
        return fontStr;
    });
    handlebars.registerHelper('converTag', function (seq) {
        var seq = seq + '',
            str = '';
        switch (seq) {
            case '0':
                str = '<span class="volun volun-chong">冲</span>';
                break;
            case '1':
                str = '<span class="volun volun-wen">稳</span>';
                break;
            case '2':
                str = '<span class="volun volun-bao">保</span>';
                break;
            case '3':
                str = '<span class="volun volun-dian">垫</span>';
                break;
        }
        return str;
    });

    //选测等级
    //新增选测等级chooseLevelObj
    //key:0历史|1物理|2政治|3地理|4化学|5生物|
    //val:0~5(A,A+,B,B+,C,,D)
    handlebars.registerHelper('chooseL', function (data) {
        var levelObj = JSON.parse(data), level = '', levelMap = ['A', 'A+', 'B', 'B+', 'C', 'D'];
        $.each(levelObj.chooseLevelObj, function (i, v) {
            level += levelMap[v] + '、';
        })
        return level.substr(0, level.length - 1)
    })
    util.ajaxFun(util.INTERFACE_URL.getVolunteerFinalInfo, 'get', finalInfoData, function (res) {
        if (res.rtnCode == '1000004') {
            tips('#tips', res.msg);
            window.location.href = '/login.html';
        }
        if (res.rtnCode == '0000000') {
            var dataJson = res.bizData.reportInfoView;
            var reportResultStr = dataJson.reportResultView.reportResultJson;
            var reportResultObj = JSON.parse(reportResultStr);
            var template = handlebars.compile($('#reportResultTemp').html());
            //var selfReportUniversityViewList.[0].selfReportMajorViewList
            $('.reportResultDiv').html(template(reportResultObj));

            var template = handlebars.compile($('#intelligent-tpl').html());
            $('.result-container').html(template(dataJson));
            $('#final-results').html($('.reportResultDiv').html())
            var reasonableType = dataJson.reasonable,
                completeType = dataJson.complete;
            completeType == 'false' ? $('.step1-0').hide() : $('.step1-1').show();
            reasonableType == 'false' ? $('.step1-2').hide() : $('.step1-3').show();
        }
    });
    //打印
    $(document).on('click', '.btn-finish', function () {
        doPrint()
    });


    function doPrint() {
        bdhtml = window.document.body.innerHTML;
        sprnstr = "<!--startprint-->"; //开始打印标识字符串有17个字符
        eprnstr = "<!--endprint-->"; //结束打印标识字符串
        prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始打印标识之后的内容
        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //截取开始标识和结束标识之间的内容
        window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML
        window.print(); //调用浏览器的打印功能打印指定区域

        window.document.body.innerHTML = bdhtml;//重新给页面内容赋值；
    }


})

