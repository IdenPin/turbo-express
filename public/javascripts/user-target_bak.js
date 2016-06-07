define(['commonjs', 'handlebars', 'tips', 'noDataTips', 'timeFormat', 'echarts','autoComplete'], function (util, handlebars, tips, noDataTips, getTime, echarts) {
    require('../css/user/user-account-info.css');
    /*
     * banner部分数据,表单数据自动录入
     * */
    $('#banner-info').prepend(require('html!../user-banner.html'));
    var forecastSchool = util.getLinkey(encodeURIComponent('forecastSchool'));
    $('.user-name').text(util.cookie.getCookieValue('userName'));
    if (util.cookie.getCookieValue('vipStatus') == 0) {
        $('#btn-vip,#user-type').show();
        $('#vip-box').hide();
    } else {
        $('#btn-vip,#user-type').hide();
        $('#vip-box').show();
    }
    /*
     * url参数解析
     * */
    var targetScoreV = '',
        targetSchoolV = '',
        subjectType = '';
    if (util.getLinkey('targetScoreV') == '') {
        targetScoreV = util.cookie.getCookieValue('achievement')
    } else {
        targetScoreV = util.getLinkey('targetScoreV')
    }
    if (util.getLinkey('targetSchoolV') == '') {
        targetSchoolV = util.cookie.getCookieValue('universityName')
    } else {
        targetSchoolV = util.getLinkey('targetSchoolV')
    }
    if (util.getLinkey('targetCheckV') == '') {
        subjectType = util.cookie.getCookieValue('subjectType')
    } else {
        subjectType = util.getLinkey('targetCheckV')
    }
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
    $('.radio-subject[value="' + subjectType + '"]').attr('checked', 'checked');
    /*
     * 初始化
     * */
    getLastForecaset();
    var predictLock = util.cookie.getCookieValue('forecaset');
    if (predictLock == 'false') {
        console.info('不能定位:forecaset - false')
        $('#section1').hide();
        $('.alert-danger').show();
    } else {
        $('#section1').show();
        console.info('可以定位:forecaset - true')
    }

    /*
     * 目标定位
     * */
    var targetTypeImg = require('../img/user-target-jbtm.png');
    var targetJbtmTypeImg = require('../img/icon-jbtm.png');
    $('#predict-btn').on('click', function () {
        targetPos();
    });
    function targetPos() {
        //判断是否登录
        if (!util.cookie.getCookieValue('isLogin')) {
            tips('#tips', '请先登录后再进行操作');
            return;
        }
        //非vip
        if (util.cookie.getCookieValue('vipStatus') == 0) {
            tips('#tips', '您还不是vip,请升级vip后使用!');
            return false;
        }
        //一天一次定位机会
        if (predictLock == 'false') {
            tips('#tips', '温馨提示:您今天已经预测过了，请明天再来！');
            $('#section1').hide();
            return false;
        }
        var subjectV = $('.radio-subject[name="subject"]:checked').val(),
            scoreV = $.trim($('#target-score').val()),
            universityNameV = $.trim($('#target-school').val());
        if (subjectV == "" || subjectV == undefined) {
            tips('#tips', '请选择科目');
            return false;
        }
        if (scoreV == "") {
            tips('#tips', '请输入分数');
            return false;
        }

        if (scoreV.length != 3) {
            tips('#tips', '请输入正确分数');
            return false;
        }
        if (universityNameV == "") {
            tips('#tips', '请输入目标院校');
            return false;
        }
        var predictData = {
            'type': subjectV,
            'score': scoreV,
            'universityName': universityNameV
        };
        util.ajaxFun(util.INTERFACE_URL.getTallyPredictProbability, 'POST', predictData, function (res) {
            if (res.rtnCode === "0000000") {
                $('#section1').hide();
                $('.alert-danger').show();
                var dataJson = res.bizData;
                var template = handlebars.compile($("#temp-content-section2").html());
                $('#section2').html(template(dataJson)).show();

                var startNum = dataJson.probability;
                if (startNum > 0) {
                    var strArr = '';
                    for (var i = 0; i < startNum; i++) {
                        var star = '<span class="star icon-star-y"></span>';
                        strArr += star;
                    }
                    $('.star-list').html(strArr);
                    if (startNum > 2) {
                        $('.btn-recommend').show();
                    } else {
                        $('.btn-recommend').hide();
                    }
                }
                if (startNum == "0") {
                    $('.star-list').html('暂无');
                }
                dataJson.countType == 'averageScore' ? $('#score-type').text('平均分') : $('#score-type').text('最低分');
                var subjectType = $('.radio-subject[name="subject"]:checked').val();
                subjectType == '1' ? $('#type-subject').text('文史') : $('#type-subject').text('理工');
                var wanting = res.bizData.wanting;
                if (wanting == '-') {
                    $('.about-target-result').html('(ﾟ∀ﾟ)正在努力整理数据中，请大家耐心等待');
                }
                if (parseInt(wanting) > 0) {
                    $('.user-target-img').attr('src', targetTypeImg);
                }
                if (parseInt(wanting) < 0) {
                    $('.target-content').html('恭喜您, 已经顺利达到目标!' + '<br>您可以设置更高的目标,去超越哦!');
                    $('.user-target-img').attr('src', targetJbtmTypeImg);
                }
                if (res.bizData.historyList.length == 0 || !res.bizData.historyList) {
                    $('.no-data-tips').show();
                }
                //成绩走势分析
                getHistoryScoreList();
                //定位成功强制重置banner顶部信息
                $('#university-score').html(predictData.score)
                $('#university-name').html(predictData.universityName)
                util.cookie.setCookie('achievement', predictData.score);
                util.cookie.setCookie('universityName', predictData.universityName);
                util.cookie.setCookie('forecaset', 'false');
                //目标分析
                getPredictProbability();
            } else {
                tips('#tips', res.msg);
                util.checkLoginTimeout(res);
            }
        });
    }

    /*
     * 获取最后一次的定位结果
     * */
    //判断对象是否为空
    function isEmptyObject(obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    }

    function getLastForecaset() {
        util.ajaxFun(util.INTERFACE_URL.getLastoFrecast, 'GET', {}, function (res) {
            if (res.rtnCode == '0000000') {
                //新用户一次都没有定位的
                var dataJson = res.bizData;
                if (!isEmptyObject(dataJson)) {
                    $('#section2').show();//不为空
                    $('#section3').show();
                } else {
                    return false;
                }
                var template = handlebars.compile($("#temp-content-section3").html());
                $('#section2').html(template(dataJson)).show();
                dataJson.countType == 'averageScore' ? $('#score-type3').text('平均分') : $('#score-type3').text('最低分');
                var subjectType = $('.radio-subject[name="subject"]:checked').val();
                subjectType == '1' ? $('#type-subject3').text('文史') : $('#type-subject3').text('理工');
                var wanting = res.bizData.wanting;
                if (wanting == '-') {
                    $('.target-content').html('<h5 class="text-center" style="width: 650px;">(ﾟ∀ﾟ)正在努力整理数据中，请大家耐心等待</h5>');
                }
                if (parseInt(wanting) > 0) {
                    $('.user-target-img').attr('src', targetTypeImg);
                }
                if (parseInt(wanting) < 0) {
                    $('.target-content').html('恭喜您, 已经顺利达到目标!' + '<br>您可以设置更高的目标,去超越哦!');
                    $('.user-target-img').attr('src', targetJbtmTypeImg);
                }
                //成绩走势分析
                getHistoryScoreList();
            } else {
                util.checkLoginTimeout(res);
            }
        });
        //目标分析
        getPredictProbability();
    }

    //表格信息
    function getPredictProbability() {
        util.ajaxFun(util.INTERFACE_URL.getPredictProbability, 'GET', {
            'type': util.cookie.getCookieValue('subjectType'),
            'score': util.cookie.getCookieValue('achievement'),
            'universityName': util.cookie.getCookieValue('universityName')
        }, function (res) {
            if (res.rtnCode === "0000000") {
                var dataJson = res.bizData;
                $('#batch3').text(dataJson.batch);
                var tpl = ''
                $.each(dataJson.historyList, function (i, v) {
                    if (v.enrollingNumber == undefined) {
                        v.enrollingNumber = '-';
                    }
                    tpl += '<tr>' +
                        '<td>' + v.year + '</td>' +
                        '<td>' + v.universityName + '</td>' +
                        '<td>' + v.batch + '</td>' +
                        '<td>' + v.enrollingNumber + '</td> ' +
                        '<td class="lowest-minscore">' + v.minScore + '</td>' +
                        '<td class="lowest">' + v.avgScore + '</td>' +
                        '</tr>'
                })
                $('#table-data').html(tpl);

                var startNum = dataJson.probability;
                if (startNum > 0) {
                    var strArr = '';
                    for (var i = 0; i < startNum; i++) {
                        var star = '<span class="star icon-star-y"></span>';
                        strArr += star;
                    }
                    $('.star-list').html(strArr);
                    if (startNum > 2) {
                        $('.btn-recommend').show();
                    } else {
                        $('.btn-recommend').hide();
                    }
                }
                if (startNum == "0") {
                    $('.star-list').html('暂无');
                }
                if (dataJson.historyList.length == 0) {
                    $('.no-data-tips').show();
                }
            } else {
                util.checkLoginTimeout(res);
            }
        });
    }


    /*
     * 成绩走势曲线分析
     * 目标定位历史记录(曲线分析)
     * 分差:  正数 - 不足
     *        负数 - 超过
     * */
    function getHistoryScoreList() {
        util.ajaxFun(util.INTERFACE_URL.getPerformanceDetail, 'GET', {}, function (res) {
            if (res.rtnCode == '0000000') {
                var dataJson = res.bizData;
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                handlebars.registerHelper('wantingFun', function (wanting) {
                    if (parseInt(wanting) > 0) {
                        wanting = '差' + wanting;
                        return wanting;
                    }
                    if (parseInt(wanting) < 0) {
                        wanting = '超' + wanting * (-1);
                        return wanting;
                    }
                    if (parseInt(wanting) == 0) {
                        wanting = '达标';
                        return wanting;
                    }
                    if (wanting == '-') {
                        wanting = '-';
                        return wanting;
                    }
                });
                var template = handlebars.compile($("#results-details-tpl").html());
                $('#results-details').html(template(dataJson));
                //成绩统计分析
                var myScoreAccountChart = echarts.init(document.getElementById('my-score-account-chart'));
                var chartPercent = '13%';
                if ((dataJson.chart.legend.data).length > 10) {
                    var chartPercent = '25%';
                }
                if ((dataJson.chart.legend.data).length > 12) {
                    var chartPercent = '30%';
                }
                if ((dataJson.chart.legend.data).length > 20) {
                    var chartPercent = '45%';
                }
                if ((dataJson.chart.legend.data).length > 25) {
                    var chartPercent = '55%';
                }
                option = {
                    title: {
                        //text: '成绩走势'
                    },
                    tooltip: {
                        trigger: 'axis',
                        show: true
                    },
                    legend: {
                        data: dataJson.chart.legend.data,
                    },
                    dataZoom: [
                        {xAxisIndex: 0, start: 0, end: 100},
                        {yAxisIndex: 0, start: 0, end: 100}
                    ],
                    grid: {
                        left: '2%',
                        right: '12%',
                        top: chartPercent,
                        containLabel: true
                    },

                    toolbox: {},
                    xAxis: dataJson.chart.xAxis,
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: dataJson.chart.series
                };
                myScoreAccountChart.setOption(option);
            } else {
                util.checkLoginTimeout(res);
            }
        });
    }


});
