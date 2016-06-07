var util = require('commonjs');
require('chanceAlertWindow');
require('../css/volunteer/volunteer-prediction-common.css');
var tips = require('tips');
var handlebars = require('handlebars');
var configData = require('volunteerSchoolProfessConf');
var volunteerBanner = require('../img/volunteer-banner.jpg');
var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
$('.volunteer-banner').html(volunteerBannerImg);


/**
 * 非VIP用户显示 智能填报介绍页面 开始
 */
var sequence1 = require('../img/sequence1.png');
var sequence1Img = '<img src="' + sequence1 + '" />';
$('.sequence1').html(sequence1Img);
var sequence2 = require('../img/sequence2.png');
var sequence2Img = '<img src="' + sequence2 + '" />';
$('.sequence2').html(sequence2Img);
var sequence3 = require('../img/sequence3.png');
var sequence3Img = '<img src="' + sequence3 + '" />';
$('.sequence3').html(sequence3Img);
var vipStatus = util.cookie.getCookieValue('vipStatus');
if (vipStatus == "0") {
    $('#reported-content-c').removeClass('hide');
    $('#reported-content-a,#reported-content-b').remove();
} else {
    $('#reported-content-c').remove();
    $('#reported-content-b').removeClass('hide');
}

//$('#chanceAlertWindow').modal('show');
/*
 * url参数接收处理
 * 分数,位次,文理
 * */
//var nowScore = util.getLinkey('nowScore');
//var nowPrecedence = util.getLinkey('nowPrecedence');
//var checkBoxVal = util.getLinkey('checkBoxVal');
//
//$('#aggregateScore-input').val(nowScore);
//$('#ranking-input').val(nowPrecedence);
//if (checkBoxVal == 1) {
//    $('.type-radio input').first().attr('checked', true);
//} else {
//    $('.type-radio input').last().attr('checked', true);
//}

var UI = {
    volunteerBtn: $('#chanceAlertWindow-submit-btn'),
    openWindowBtn: $('#volunteer-flow1-btn')
};
/*
 * string.format 函数
 * */
function stringFormat() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}
function volHtml() {
    return "<div class='into-list'>"
        + "<strong>{0}</strong>"
        + "<p class='info'>2015年省控线：文史类{1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;理工类{2}</p>"
        + "<a href='{3}' class='btn btn-primary batchList-btn' batch='{4}'  id='batch{5}-btn' liPlus='{6}' wenPlus='{7}' wenLine='{1}' liLine='{2}' first='{9}' conform='{10}'>开始填报</a>{8}"
        + '</div>';
}

$(function () {
    /*
     * 拉取接口判断是位次法还是线差法,线差发就隐藏位次输入
     * ?province=省份&cate=科类(选填)
     * */
    var provinceKey = util.cookie.getCookieValue('userKey'),
        precedenceLock = false,//位次|是否展示
        subjectName = $('.subject-first');
    $('.type-radio input[name=subjectType]').click(function () {
        var _this = $(this);
        //subjectName = $('.subject-first');
        _this.val() == 1 ? subjectName.text('历史') : subjectName.text('物理');
    });
    util.ajaxFun(util.INTERFACE_URL.getIntelligentLoginC, 'GET', {
        //"province": 'sx',
        "province": provinceKey,
        "cate": ''//预留字段
    }, function (res) {
        //console.info(res);
        if (res.rtnCode == '0000000') {
            if (res.bizData.logic == '1') {
                precedenceLock = true;
                //隐藏位次输入|位次展示
                $('#precedence,.wei-ci,.modal-body .dh').show();
            }
        }
        if (provinceKey == 'js') {
            if ($('.type-radio input[name=subjectType]:checked').val() != undefined) {
                $('.type-radio input[name=subjectType]:checked').val() == 1 ? subjectName.text('历史').attr('data-val', 0) : subjectName.text('物理').attr('data-val', 1);
            } else {
                subjectName.text('历史')
            }
            //江苏展示志愿指导
            $('#reported-content-b .level,.choose-table,.choose-grade').show();
            $('.s-tips').text('分数位次和选测等级');
        }
        if (!precedenceLock) {
            $('.s-tips').text('分数');
        }
    })
    var subjectKeyArr = ["历史", "物理", "政治", "地理", "化学", "生物"],
        wordKey = ['A', "A+", "B", "B+", "C", "D"];
    //定位后不可更改分数位次
    util.ajaxFun(util.INTERFACE_URL.getUserPredictInfo, 'GET', {
        "misc": new Date().getTime()
    }, function (res) {
        console.info(res);
        util.checkLoginTimeout(res);
        if (res.rtnCode == '0000000' && res.bizData.reports.length > 0) {
            //if (res.rtnCode == '0000000' && res.bizData.reports[0].existReport) {
            $('#aggregateScore-input').val(res.bizData.reports[0].score).attr("readonly", "readonly");
            $('#ranking-input').val(res.bizData.reports[0].precedence).attr("readonly", "readonly");
            ( res.bizData.reports[0].majorType == 1 ) && $($('[name="subjectType"]').get(0)).attr('checked', 'checked') && $($('[name="subjectType"]').get(1)).attr('disabled', 'disabled');
            ( res.bizData.reports[0].majorType == 2 ) && $($('[name="subjectType"]').get(1)).attr('checked', 'checked') && $($('[name="subjectType"]').get(0)).attr('disabled', 'disabled');
            $('.fuck-mask').show()
            $(document).on('click', '#volunteer-flow1-btn', function () {
                $('#chanceAlertWindow-submit-btn').click();
            });
            var chooseL = res.bizData.reports[0].extendProper;
            //fuck-js江苏选测逻辑填值
            if (provinceKey == 'js' && chooseL) {
                var chooseArrRadioKey = [],
                    chooseArrRadioKeyValue = [];
                for (i in JSON.parse(chooseL).chooseLevelObj) {
                    chooseArrRadioKey.push(i);
                    chooseArrRadioKeyValue.push((JSON.parse(chooseL).chooseLevelObj)[i]);
                }
                $(".subject-first").text(subjectKeyArr[chooseArrRadioKey[0]]);
                $('.subject-second [value="' + chooseArrRadioKey[1] + '"]').attr('selected', 'selected');
                $('[name="subject-level-wl"]').eq(parseInt(chooseArrRadioKeyValue[0])).attr('checked', 'checked');
                $('[name="subject-level-xc"]').eq(parseInt(chooseArrRadioKeyValue[1])).attr('checked', 'checked');
            }
            if (provinceKey == 'zj') {
                var dataJson = res.bizData.reports,
                    batchArr = configData.config[provinceKey].batch,
                    batchLockArr = [],
                    cachesBatchDom = '';
                $.each(dataJson, function (i, v) {
                    if (dataJson[i].existReport == true) {
                        batchLockArr.push(v.batch);
                    }
                    if (dataJson[0].majorType) {
                        $('#xxx-ws,#xxx-lg').attr('disabled', 'disabled');
                        dataJson[0].majorType == 1 ? $('#xxx-ws').attr('checked', 'checked') : $('#xxx-lg').attr('checked', 'checked')
                    }
                })
                $.each(batchLockArr, function (i, v) {
                    cachesBatchDom = $('[b=' + batchLockArr[i] + ']');
                    cachesBatchDom.find('.xxx-mask').show();
                    cachesBatchDom.find('[name="score"]').val(dataJson[i].score).addClass('input-disabled');
                    cachesBatchDom.find('[name="rank"]').val(dataJson[i].precedence).addClass('input-disabled');
                    //解决浙江和上海已填报分数提示bug
                    cachesBatchDom.find('.batchList-btn').attr('existReport', dataJson[i].existReport);
                })
            }
        } else {
            $(document).on('click', '#volunteer-flow1-btn', function () {
                $('#chanceAlertWindow').modal('show');
                sa.track('reported_btn');
            });
        }
    });
    $(document).on('click', '#chanceAlertWindow-submit-btn', function () {
        $('#chanceAlertWindow').modal('hide');
        if (util.isLogin() == '' || util.isLogin() == false) {
            tips('#tips', '请先登录后再操作');
            return false;
        }
        var aggregateScoreV = $('#aggregateScore-input').val().trim()
            , rankingV
            , subjectTypeV = $('input[name="subjectType"]:checked').val()
            , pattern = /^[0-9]*[1-9][0-9]*$/;
        if (subjectTypeV == undefined) {
            tips('#tips', '选择文理科');
            return false;
        }
        if (aggregateScoreV == '' || aggregateScoreV.length != 3) {
            tips('#tips', '请输入3位数字分数');
            return false;
        }
        //位次展示precedenceLock为true执行
        var sapV = '';
        if (precedenceLock) {
            rankingV = $('#ranking-input').val().trim()
            if (pattern.test(aggregateScoreV) == false || aggregateScoreV.length != 3) {
                tips('#tips', '请输入3位数字分数');
                return false;
            }
            if (rankingV == '') {
                tips('#tips', '请输入位次');
                return false;
            }
            if (pattern.test(rankingV) == false || rankingV.length > 6) {
                tips('#tips', '请输入小于6位数字位次');
                return false;
            }
        } else {
            rankingV = aggregateScoreV;
        }
        /*
         * 江苏选填等级处理
         * chooseLevelObj = {1: "3", 5: "3"}
         * key:0历史|1物理|2政治|3地理|4化学|5生物|
         * val:0~5(A,A+,B,B+,C,,D)
         * */
        var objLevel = {};
        if (provinceKey == 'js') {
            var wl = $('[name="subject-level-wl"]:checked').val();
            var xc = $('[name="subject-level-xc"]:checked').val();
            var firstSubjectKey = $('.subject-first').text();
            var secondSubjectKey = $('.subject-second').val();
            objLevel.chooseLevelObj = {}
            for (i in subjectKeyArr) {
                if (firstSubjectKey == subjectKeyArr[i]) {
                    objLevel.chooseLevelObj[i] = wl;
                }
                if (subjectKeyArr[secondSubjectKey] == subjectKeyArr[i]) {
                    objLevel.chooseLevelObj[i] = xc;
                }
            }
            $('#reported-content-b .level,.choose-table,.choose-grade').show();
            $('.choose-grade strong').text(wordKey[wl] + ',' + wordKey[xc]);
            util.cookie.setCookie('objLevel', JSON.stringify(objLevel), 4, "");
        }
        $('#volunteer-flow1-btn').attr('disabled', 'disabled');
        util.ajaxFun(util.INTERFACE_URL.getVolunteerReport, 'GET', {
            "sap": rankingV,
            "score": aggregateScoreV,
            "cate": subjectTypeV,
            "province": util.provinceKey
        }, function (res) {
            if (res.rtnCode == '0000000') {
                $('#reported-content-a').removeClass('hide');
                $('#reported-content-b').addClass('hide');
                var subjectTypeText = '';
                subjectTypeV == "1" ? subjectTypeText = '文史' : subjectTypeText = '理科';
                $('#volunteer-subjectType').text(subjectTypeText);
                $('#volunteer-score').text(aggregateScoreV);
                $('#volunteer-precedence').text($('#ranking-input').val());
                var batchList = res.bizData.batchViews, batchViewsList = '', tagName = ['', '一', '二', '三'];
                if (batchList.length > 0) {
                    var province = util.cookie.getCookieValue('userKey');
                    $('.tips-txt').hide();
                    var selSchoolUrl = 'javascript:void(0);';
                    var lock = true, warmTips = '';
                    $.each(batchList, function (i, v) {
                        //if ($.inArray(v.batch, configData.config[province].batch) >= 0) {!!!!!!!!!!!!!!!!!!!!
                        var bach = v.batch.split('-');
                        var wordConstant = "", strongStr = "";
                        if (!!bach) {
                            if (bach.length > 1) {
                                wordConstant = (configData.config.constantWord).substring(parseInt(bach[1]) - 1, parseInt(bach[1])) + "类";
                            }
                        }
                        var tuiJianStr = "";
                        v.recommend == true ? tuiJianStr = "<span class='recommend-icon'>荐</span>" : tuiJianStr = '';
                        var batch = parseInt(bach[0]);
                        var strongStr = batch === 3 ? "普通类高职专科" : "普通类" + (batch == 4 ? tagName[batch - 1] : tagName[batch]) + "批本科";
                        $('#batch-list').append(stringFormat(volHtml(), strongStr + wordConstant, v.wenLine, v.liLine, selSchoolUrl, v.batch, v.batch, v.liPlus, v.wenPlus, tuiJianStr, v.first, v.conform));
                    });
                    //批次顺序处理冒泡排序
                    for (var i = 0; i < batchList.length - 1; i++) {
                        for (var j = 0; j < batchList.length - 1 - i; j++) {
                            if (parseInt(batchList[j].batch.substr(0, 1)) > parseInt(batchList[j + 1].batch.substr(0, 1))) {
                                var tmp_batch = batchList[j].batch;
                                batchList[j].batch = batchList[j + 1].batch;
                                batchList[j + 1].batch = tmp_batch;
                            }
                        }
                    }
                    /*
                     * 温馨提示:warmTips | recommend
                     * 二本以外的都以压线生提示.
                     * conform:考生您好，您的分数属于（x）批次，建议填报（x）院校
                     * line:考生您好，您的分数填报（x）有风险，建议填报（x）院校
                     * configData.config[provinceKey].batchNameTag
                     * */
                    var tagArr = configData.config[provinceKey].batchNameTag, recommendTips = '', batchNumArr = '', batchClassArr = '', foo = '';
                    batchList[batchList.length - 1].line = false; //高职高专&最后一个批次不存在压线.
                    $.each(batchList, function (i, v) {
                        batchNumArr = v.batch.split('-')[0];//批次
                        batchClassArr = v.batch.split('-')[1] //ab类
                        i == 1 ? foo = 3 : foo = 1;
                        //普通模板批次:['一本', '二本', '三本', '高职(专科)']
                        if (v.line == true) {
                            //压线生逻辑
                            recommendTips = "考生您好，您的分数填报" + tagArr[batchNumArr] + "有风险, 建议填报" + tagArr[parseInt(i + 2)] + "的院校";
                            $('.warm-tips').html(recommendTips);
                            console.info('压线生逻辑', v.batch + '批次')
                            return false;
                        } else {
                            if (v.conform == true) {
                                //推荐逻辑
                                recommendTips = "考生您好，您的分数属于" + tagArr[batchNumArr] + "，建议填报" + tagArr[batchNumArr] + "的院校";
                                console.info('i:', i);
                                $('.warm-tips').html(recommendTips);
                                console.info('推荐逻辑', v.batch + '批次')
                                return false;
                            }
                        }
                    });
                    console.table(batchList);
                    util.cookie.setCookie("volunteerScore", aggregateScoreV, 4, "");
                    util.cookie.setCookie("volunteerCate", subjectTypeV, 4, "");
                    util.cookie.setCookie("rankingV", rankingV, 4, "");
                    //**************fuck-start 零时处理推荐图标问题{{零时}}
                    for (var i = 0; i < $('.into-list').length; i++) {
                        if (i > 1) {
                            $('.into-list').eq(i).find('.recommend-icon').hide();
                        }
                    }
                    //**************fuck-end 零时处理推荐图标问题{{零时}}
                    $(".batchList-btn").click(function () {
                        util.cookie.setCookie("volunteerBatch", $(this).attr('batch'), 4, "");
                        util.cookie.setCookie("SCORE_PLUS_VALUE", (subjectTypeV == 1 ? $(this).attr('wenPlus') : $(this).attr('liPlus')), 4, "");
                        util.cookie.setCookie("PROVIN_CONLINE", (subjectTypeV == 1 ? $(this).attr("wenLine") : $(this).attr("liLine")), 4, "");
                        /***********************************后续持续优化 2016 -04-23***********************************/
                        var batchNum = $(this).attr('batch');
                        var btchArr = batchNum.split("-");
                        var f = $(this).attr('first');
                        util.cookie.setCookie("batch", (subjectTypeV == 1 ? $(this).attr("wenLine") : $(this).attr("liLine")), 4, "");
                        switch (province) {
                            case 'gx':
                                selSchoolUrl = '/predict-selSchool-tpl0.html';
                                break;
                            case 'gd':
                                selSchoolUrl = '/predict-selSchool-tpl3.html';
                                break;
                            case 'fj':
                                if (!!btchArr && parseInt(btchArr[0]) == 3) {
                                    selSchoolUrl = '/predict-selSchool-tpl2.html';
                                } else {
                                    selSchoolUrl = '/predict-selSchool-tpl1.html';
                                }
                                break;
                            case 'ha':
                                if (!!btchArr && parseInt(btchArr[0]) == 3) {
                                    selSchoolUrl = '/predict-selSchool-tpl3.html';
                                } else {
                                    selSchoolUrl = '/predict-selSchool-tpl1.html';
                                }
                                break;
                            default:
                                selSchoolUrl = '/predict-selSchool-tpl1.html';
                                break;
                        }
                        var _this = $(this)
                        $('.modal-body').html('您好，您的分数还未达到' + _this.parent().find('strong').html() + '，请重新选择批次！');
                        $('#chanceAlertWindow-submit-btn').html('重新选择').click(function () {
                            $('#chanceAlertWindow').modal('hide');
                        })
                        if (_this.attr('conform') == 'false') {
                            $('#chanceAlertWindow').modal('show');
                            $('#chanceAlertWindow-submit-btn').click(function (e) {
                                e.stopPropagation();
                                e.cancelBubble = true;
                            })
                        } else {
                            window.location.href = selSchoolUrl + '?f=' + f;
                        }

                        /***********************************后续持续优化***********************************/
                    });
                    $('#volunteer-flow1-btn').removeAttr('disabled');
                } else {
                    $('.tips-txt').show();
                }
            } else {
                tips('#tips', res.msg);
            }
        });
    });
    /* ==============================
     * fuck-浙江&上海:批次选择
     * ==============================
     * */
    if (provinceKey == 'zj' || provinceKey == 'sh') {
        $('#reported-content-b').hide();
        $('#reported-content-xxx').show();
        var arrName = ['', '普通类一批', '普通类二批', '普通类高职高专', '普通类三批']
        handlebars.registerHelper('tagName', function (data) {
            return arrName[parseInt(data)];
        })
        var template = handlebars.compile($('#batch-tpl').html());
        $('#batch-dom').html(template(configData.config[provinceKey].batchViews))
        $(document).on('click', '.batchList-btn', function () {
            var _this = $(this);
            var f = $(this).attr('first')
            var tip = arrName[parseInt(_this.attr('batch'))]
            var inputParentDom = _this.parent().parent();
            var thisScore = $.trim(inputParentDom.find('[name="score"]').val());
            var thisRank = $.trim(inputParentDom.find('[name="rank"]').val());
            var subjectTypeV = $('.xxx-radio [name="xxx"]:checked').val();
            var pattern = /^[0-9]*[1-9][0-9]*$/;
            if (!(pattern.test(thisScore)) || thisScore == '' || thisScore.length < 3) {
                tips('#xxx-tips', '对不起，' + tip + '分数输入有误');
                return false;
            }
            if (provinceKey == 'zj') {
                if (!(pattern.test(thisRank)) || thisRank == '') {
                    tips('#xxx-tips', '对不起，' + tip + '名次输入有误');
                    return false;
                }
            }
            //用户输入分数和省控线作比较,
            var scoreLine = '';
            $('.xxx-radio [name="xxx"]:checked').val() == 1 ? scoreLine = inputParentDom.find('[name="score"]').attr('data-wenline') : scoreLine = inputParentDom.find('[name="score"]').attr('data-liline')
            if (thisScore < scoreLine) {
                tips('#xxx-tips', '您好，您的分数还未达到' + tip + '请重新选择批次');
                return false;
            }
            util.cookie.setCookie("volunteerScore", thisScore, 4, "");
            util.cookie.setCookie("volunteerCate", subjectTypeV, 4, "");
            util.cookie.setCookie("rankingV", thisRank, 4, "");
            util.cookie.setCookie("volunteerBatch", $(this).attr('batch'), 4, "");
            util.cookie.setCookie("SCORE_PLUS_VALUE", (subjectTypeV == 1 ? $(this).attr('wenPlus') : $(this).attr('liPlus')), 4, "");
            util.cookie.setCookie("PROVIN_CONLINE", (subjectTypeV == 1 ? $(this).attr("wenLine") : $(this).attr("liLine")), 4, "");
            //修复浙江上海已定位弹层bug
            if (_this.attr('existreport') == 'true') {
                switch (provinceKey) {
                    case 'gx':
                        selSchoolUrl = '/predict-selSchool-tpl0.html';
                        break;
                    case 'gd':
                        selSchoolUrl = '/predict-selSchool-tpl3.html';
                        break;
                    case 'fj':
                        if (!!btchArr && parseInt(btchArr[0]) == 3) {
                            selSchoolUrl = '/predict-selSchool-tpl2.html';
                        } else {
                            selSchoolUrl = '/predict-selSchool-tpl1.html';
                        }
                        break;
                    case 'ha':
                        if (!!btchArr && parseInt(btchArr[0]) == 3) {
                            selSchoolUrl = '/predict-selSchool-tpl3.html';
                        } else {
                            selSchoolUrl = '/predict-selSchool-tpl1.html';
                        }
                        break;
                    default:
                        selSchoolUrl = '/predict-selSchool-tpl1.html';
                        break;
                }
                if (_this.attr('conform') == 'false') {
                    $('#chanceAlertWindow').modal('show');
                    $('#chanceAlertWindow-submit-btn').click(function (e) {
                        e.stopPropagation();
                        e.cancelBubble = true;
                    })
                } else {
                    window.location.href = selSchoolUrl + '?f=' + f;
                }
            } else {
                $('#chanceAlertWindow').modal('show');
            }
            $('#chanceAlertWindow-submit-btn').click(function () {
                window.location.href = '/predict-selSchool-tpl1.html' + '?f=' + _this.attr('data-first');
            })
        })
        if (provinceKey == 'zj') {
            $('.js-switch').css('display', 'inline-block');
        }
    }

});
