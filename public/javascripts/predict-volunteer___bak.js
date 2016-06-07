var util = require('commonjs');
require('chanceAlertWindow');
require('../css/volunteer/volunteer-prediction-common.css');
var tips = require('tips');
var configData = require('volunteerSchoolProfessConf');
var volunteerBanner = require('../img/volunteer-banner.jpg');
var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
$('.volunteer-banner').html(volunteerBannerImg);
//$('#chanceAlertWindow').modal('show');
/*
 * url参数接收处理
 * 分数,位次,文理
 * */
var nowScore = util.getLinkey('nowScore');
var nowPrecedence = util.getLinkey('nowPrecedence');
var checkBoxVal = util.getLinkey('checkBoxVal');
$('#aggregateScore-input').val(nowScore);
$('#ranking-input').val(nowPrecedence);
if (checkBoxVal == 1) {
    $('.type-radio input').first().attr('checked', true);
} else {
    $('.type-radio input').last().attr('checked', true);
}

var UI = {
    volunteerBtn: $('#chanceAlertWindow-submit-btn'),
    openWindowBtn: $('#volunteer-flow1-btn')
};
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
        + "<p class='info'>2015年省控线：文史类{1}理工类{2}</p>"
        + "<a href='{3}' class='btn btn-primary batchList-btn' batch='{4}'  id='batch{5}-btn' liPlus='{6}' wenPlus='{7}' wenLine='{1}' liLine='{2}'>开始智能填报</a>"
        + '</div>';
}
// 志愿填报第一步
$(function () {

    util.ajaxFun(util.INTERFACE_URL.getUserPredictInfo, 'GET', {
        "misc": new Date().getTime()
    }, function ( res) {
        util.checkLoginTimeout(res);
        if( res.rtnCode == '0000000' && res.bizData.report.existReport) {
            $('#aggregateScore-input').val(res.bizData.report.score).attr( "readonly", "readonly");
            $('#ranking-input').val(res.bizData.report.precedence).attr( "readonly", "readonly");
            ( res.bizData.report.majorType == 1 ) && $($('[name="subjectType"]').get(0)).attr( 'checked', 'checked') && $($('[name="subjectType"]').get(1)).attr( 'disabled', 'disabled');
            ( res.bizData.report.majorType == 2 ) && $($('[name="subjectType"]').get(1)).attr( 'checked', 'checked') && $($('[name="subjectType"]').get(0)).attr( 'disabled', 'disabled');
            $(document).on( 'click', '#volunteer-flow1-btn', function () {
                $('#chanceAlertWindow-submit-btn').click();
            });
//        } else if( !res.bizData.report.existReport) {
        } else {
            $(document).on( 'click', '#volunteer-flow1-btn', function () {
                $('#chanceAlertWindow').modal('show');
                sa.track('reported_btn');
            });
        }
    });

//    UI.volunteerBtn.on('click', function () {
    $(document).on('click', '#chanceAlertWindow-submit-btn', function () {
        $('#chanceAlertWindow').modal('hide');
        if (util.isLogin() == '' || util.isLogin() == false) {
            tips('#tips', '请先登录后再操作');
            return false;
        }
        var aggregateScoreV = $('#aggregateScore-input').val().trim()
            , rankingV = $('#ranking-input').val().trim()
            , subjectTypeV = $('input[name="subjectType"]:checked').val()
            , pattern = /^[0-9]*[1-9][0-9]*$/;
        if (subjectTypeV == undefined) {
            tips('#tips', '选择文理科');
            return false;
        }
        if (aggregateScoreV == '') {
            tips('#tips', '请输入分数');
            return false;
        }
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
        $('#volunteer-flow1-btn').attr('disabled', 'disabled');
        util.ajaxFun(util.INTERFACE_URL.getVolunteerReport, 'GET', {
            "score": aggregateScoreV,
            "cate": subjectTypeV,
            "province": util.provinceKey
        }, function (res) {

            if (res.rtnCode == '1000004') {
                tips('#tips', res.msg);
                window.location.href = '/login.html';
            }
            if (res.rtnCode == '0000000') {
                $('#reported-content-a').removeClass('hide');
                $('#reported-content-b').addClass('hide');
                var subjectTypeText = '';
                if (subjectTypeV == "1") {
                    subjectTypeText = '文史';
                } else {
                    subjectTypeText = '理科';
                }
                $('#volunteer-subjectType').text(subjectTypeText);
                $('#volunteer-score').text(aggregateScoreV);
                $('#volunteer-precedence').text($('#ranking-input').val());
                var batchList = res.bizData.batchViews;
                var batchViewsList = '';
                if (batchList.length > 0) {
                    var province = util.cookie.getCookieValue('userKey');
                    $('.tips-txt').hide();
                    var selSchoolUrl = 'javascript:void(0);';
                    /*
                     * *************************浙江零时默认展示1批次.*************************
                     * */
                    if (province == 'zj') {
                        util.cookie.setCookie("volunteerBatch", '1');
                        window.location.href = '/predict-selSchool-tpl1.html';
                        //    ===============
                    } else {
                        $.each(batchList, function (i) {
                            var batchObj = batchList[i];
                            if ($.inArray(batchObj.batch, configData.config[province].batch) >= 0) {
                                var bach = batchObj.batch.split('-');
                                var wordConstant = "", strongStr = "";
                                if (!!bach) {
                                    if (bach.length > 1) {
                                        wordConstant = (configData.config.constantWord).substring(parseInt(bach[1]) - 1, parseInt(bach[1])) + "类";
                                    }
                                }
                                var batch = parseInt(bach[0]);
                                var strongStr = batch === 3 ? "普通类高职专科" : "普通类" + (batch == 4 ? batch - 1 : batch) + "批本科";
                                $('#batch-list').append(stringFormat(volHtml(), strongStr + wordConstant, batchObj.wenLine, batchObj.liLine, selSchoolUrl, batchObj.batch, batchObj.batch, batchObj.liPlus, batchObj.wenPlus));
                            }
                        });
                    }
                    util.cookie.setCookie("volunteerScore", aggregateScoreV, 4, "");
                    util.cookie.setCookie("volunteerCate", subjectTypeV, 4, "");
                    util.cookie.setCookie("rankingV", rankingV, 4, "");

                    if (province == 'zj') {
                    }
                    $(".batchList-btn").click(function () {
                        util.cookie.setCookie("volunteerBatch", $(this).attr('batch'), 4, "");
                        util.cookie.setCookie("SCORE_PLUS_VALUE", (subjectTypeV == 1 ? $(this).attr('wenPlus') : $(this).attr('liPlus')), 4, "");
                        util.cookie.setCookie("PROVIN_CONLINE", (subjectTypeV == 1 ? $(this).attr("wenLine") : $(this).attr("liLine")), 4, "");

                        /***********************************后续持续优化 2016 -04-23***********************************/
                        var batchNum = $(this).attr('batch');
                        var btchArr = batchNum.split("-");
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
                        window.location.href = selSchoolUrl;
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

});
