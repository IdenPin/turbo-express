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
        console.info('可以定位:forecaset - true');
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

                var startNum = dataJson.probability + 1;
                var tipArr = [
                    '',
                    '您被这所院校录取的机率极小，建议您慎重考虑！',
                    '您被这所院校录取的机率较小，别灰心，换个目标试试吧！',
                    '您报考这所院校有一定风险，再努力努力吧！',
                    '您被这所院校录取的机率较大，很有希望被录取，继续加油！',
                    '您报考这所院校十拿九稳，可以选择更高的目标了！'
                ];
                if (startNum > 0) {
                    var strArr = [];
                    for (var i = 0; i < startNum; i++) {
                        strArr += '<span class="star icon-star-y"></span>';
                    }
                    for (var j = 0; j < 5 - parseInt(startNum); j++) {
                        strArr += '<span class="star icon-star-n"></span>';
                    }
                    $('#tips-txt').html(tipArr[startNum]);
                    $('.star-list').html(strArr);
                    if (startNum > 2) {

                    } else {
                        //$('.btn-recommend').hide();
                    }

                    $('.btn-recommend').show().on('click',function(){

                        util.cookie.setCookie("subjectType", subjectV, 4, "");
                        util.cookie.setCookie("targetScore", scoreV, 4, "");
                        util.cookie.setCookie("targetSchool", universityNameV, 4, "");

                        window.location.assign('http://' + window.location.host + '/predict-school.html');
                    });

                    $('.btn-recommend').show();
                }
                //if (startNum == "0") {
                //    $('.star-list').html('暂无');
                //}
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
                $('#university-score').html(predictData.score);
                $('#university-name').html(predictData.universityName);
                console.info(predictData);
                //alert("1, " + predictData.universityName);
                util.cookie.setCookie('achievement', predictData.score);
                util.cookie.setCookie('universityName', predictData.universityName);
                util.cookie.setCookie('forecaset', 'false');
                console.info(util.cookie.getCookieValue('universityName'));
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
    var universityName = "";
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
                //var subjectType = $('.radio-subject[name="subject"]:checked').val();
                var subjectType = res.bizData.typeId;
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
                universityName = res.bizData.universityName;

                $(".btn-recommend").unbind("click").bind("click", function(){

                    util.cookie.setCookie("subjectType", $("#section2 p").find("span").eq(1).html().trim() == "文史"? 1:2, 4, "");
                    util.cookie.setCookie("achievement", $("#section2 p").find("span").eq(2).html(), 4, "");
                    util.cookie.setCookie("targetSchool", $("#section2 p").find("span").eq(0).html(), 4, "");

                    window.location.assign('http://' + window.location.host + '/predict-school.html');
                });
            } else {
              util.checkLoginTimeout(res);
            }
        });
        //目标分析
        getPredictProbability();
    }

    //表格信息
    function getPredictProbability() {
        //alert("2, " + util.cookie.getCookieValue('universityName'));
        //var universityName = $('#section2 .title-info p').eq(1).find("span").eq(0).html();
        //var type = $('#section2 .title-info p').eq(1).find("span").eq(1).html();
        //var score = $('#section2 .title-info p').eq(1).find("span").eq(2).html();
        //alert("h7, " + universityName);
        //util.cookie.setCookie("universityName", util.cookie.getCookieValue('universityName'));
        util.ajaxFun(util.INTERFACE_URL.getPredictResults, 'GET', {
            'type': util.cookie.getCookieValue('subjectType'),
            'score': util.cookie.getCookieValue('achievement'),
            'universityName': util.cookie.getCookieValue('universityName')
        }, function (res) {
            if (res.rtnCode === "0000000") {
                var dataJson = res.bizData;
                $('#batch3').text(dataJson.batch);
                var tpl = ''
                $.each(dataJson.historyList, function (i, v) {
                    if (v.enrollingNumber == "" || v.enrollingNumber == undefined) {
                        v.enrollingNumber = '-';
                    }
                    if (v.minScore == "" || v.minScore == undefined) {
                        v.minScore = '-';
                    }
                    if (v.avgScore == "" || v.avgScore == undefined) {
                        v.avgScore = '-';
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

                var startNum = dataJson.probability + 1;
                var tipArr = [
                    '',
                    '您被这所院校录取的机率极小，建议您慎重考虑！',
                    '您被这所院校录取的机率较小，别灰心，换个目标试试吧！',
                    '您报考这所院校有一定风险，再努力努力吧！',
                    '您被这所院校录取的机率较大，很有希望被录取，继续加油！',
                    '您报考这所院校十拿九稳，可以选择更高的目标了！'
                ];
                if (startNum > 0) {
                    var strArr = [];
                    for (var i = 0; i < startNum; i++) {
                        strArr += '<span class="star icon-star-y"></span>';
                    }
                    for (var j = 0; j < 5 - parseInt(startNum); j++) {
                        strArr += '<span class="star icon-star-n"></span>';
                    }
                    $('#tips-txt').html(tipArr[startNum]);
                    $('.star-list').html(strArr);
                    if (startNum > 2) {
                        $('.btn-recommend').show().on("click", function(){
                            util.cookie.setCookie("subjectType", util.cookie.getCookieValue('subjectType'), 4, "");
                            util.cookie.setCookie("targetScore", util.cookie.getCookieValue('achievement'), 4, "");
                            util.cookie.setCookie("targetSchool", util.cookie.getCookieValue('universityName'), 4, "");

                            window.location.assign('http://' + window.location.host + '/predict-school.html');
                        });
                    } else {
                        //$('.btn-recommend').hide();
                    }
                }
                if (dataJson.historyList.length == 0) {
                    $('.no-data-tips').show();
                }
            } else {
              util.checkLoginTimeout(res);
            }
        });
    }


    Date.prototype.Format = function(fmt)
    {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    function GetDateDiff(startTime, endTime, diffType)
    {
        //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
        startTime = startTime.replace(/\-/g, "/");
        endTime = endTime.replace(/\-/g, "/");
        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        var sTime = new Date(startTime);      //开始时间
        var eTime = new Date(endTime);  //结束时间
        //作为除数的数字
        var divNum = 1;
        switch (diffType) {
            case "second":
                divNum = 1000;
                break;
            case "minute":
                divNum = 1000 * 60;
                break;
            case "hour":
                divNum = 1000 * 3600;
                break;
            case "day":
                divNum = 1000 * 3600 * 24;
                break;
            default:
                break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
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
                // 基于准备好的dom，初始化echarts实例
                var scoreAccountChartData = {
                    avgScore: [],
                    minScore: [],
                    university: [],
                    date: []
                };

                var dataxAxis = {
                    xAxis: []
                }

                //$.each(dataJson.chart.xAxis.data, function(i, v){
                //    console.log("排序前数据: " + v);
                //});
                //
                //for(var i = 0; i < dataJson.chart.xAxis.data.length - 1; i++)
                //{
                //    for(var j = 0; j < dataJson.chart.xAxis.data.length - 1 - i; j++)
                //    {
                //        alert("haha," + Date.parse(dataJson.chart.xAxis.data[j].replace(/-/g,"/")));
                //        if(Date.parse(dataJson.chart.xAxis.data[j]) > Date.parse(dataJson.chart.xAxis.data[j+1]))
                //        {
                //            var tmp_xAxis = dataJson.chart.xAxis.data[j];
                //            dataJson.chart.xAxis.data = dataJson.chart.xAxis.data[j+1];
                //            dataJson.chart.xAxis.data[j+1] = tmp_xAxis;
                //        }
                //    }
                //}
                //
                //$.each(dataJson.chart.xAxis.data, function(i, v){
                //    console.log("排序后数据: " + v);
                //});


                $.each(res.bizData.forecasts, function (i, v) {
                    scoreAccountChartData.avgScore.push(v.averageScore);
                    scoreAccountChartData.minScore.push(v.lowestScore);
                    scoreAccountChartData.university.push(v.universityName);
                    scoreAccountChartData.date.push(v.createDate);
                    //alert("hehe, date: " + GetDateDiff(new Date(v.createDate).Format('yyyy-MM-dd'), new Date().Format('yyyy-MM-dd'), 'day'));
                });
                //alert(new Date(scoreAccountChartData.date[1]).Format('yyyy-MM-dd'));
                if(scoreAccountChartData.date.length > 1)
                {
                    var lastTestDay = GetDateDiff(new Date(scoreAccountChartData.date[1]).Format('yyyy-MM-dd hh:ss:mm'), new Date().Format('yyyy-MM-dd hh:ss:mm'), 'day');
                    if(lastTestDay)
                    {
                        $(".last-subject").html(lastTestDay + "天");
                    }
                    else
                    {
                        $(".lm").hide();
                    }
                }
                if(scoreAccountChartData.date.length == 1)
                {
                    var lastTestDay = GetDateDiff(new Date(scoreAccountChartData.date[0]).Format('yyyy-MM-dd hh:ss:mm'), new Date().Format('yyyy-MM-dd hh:ss:mm'), 'day');
                    if(lastTestDay)
                    {
                        $(".last-subject").html(lastTestDay + "天");
                    }
                    else
                    {
                        $(".lm").hide();
                    }
                }

                console.log(scoreAccountChartData);
                console.log(dataJson.chart.xAxis.data);

                $.each(scoreAccountChartData.date, function(i, v){
                    dataxAxis.xAxis.push(new Date(v).Format('yyyy-MM-dd'));
                });

                $(".chart-container").hide();
                if(parseInt(dataJson.forecasts.length) > 2 || !dataJson.forecasts)
                {
                    $(".chart-container").show();
                    //成绩统计分析
                    var myScoreAccountChart = echarts.init(document.getElementById('my-score-account-chart'));
                    // 绘制图表
                    myScoreAccountChart.setOption({
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['平均分', '最低分'],
                            bottom: '0'
                        },
                        grid: {
                            left: '0',
                            right: '4%',
                            bottom: '12%',
                            top: '18%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: dataxAxis.xAxis
                        },
                        //xAxis: dataJson.chart.xAxis,
                        yAxis: {
                            type: 'value',
                            scale: true,
                            splitNumber: scoreAccountChartData.minScore.length,
                            min: scoreAccountChartData.avgScore
                        },
                        series: [
                            //需求变更,暂时不展示
                            {
                                name:  '最低分',
                                type: 'line',
                                data: scoreAccountChartData.minScore,
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            //color: '#72bf4a',
                                            width: 4
                                        }
                                    }
                                }
                            },
                            {
                                name: '平均分',
                                type: 'line',
                                data: scoreAccountChartData.avgScore,
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            //color: '#56a9f7',
                                            width: 4
                                        }
                                    }
                                }
                            }
                        ]
                    });
                }
                else
                {
                    $(".chart-container").remove();
                }
                //var chartPercent = '13%';
                //if ((dataJson.chart.legend.data).length > 10) {
                //    var chartPercent = '25%';
                //}
                //if ((dataJson.chart.legend.data).length > 12) {
                //    var chartPercent = '30%';
                //}
                //if ((dataJson.chart.legend.data).length > 20) {
                //    var chartPercent = '45%';
                //}
                //if ((dataJson.chart.legend.data).length > 25) {
                //    var chartPercent = '55%';
                //}
                //option = {
                //    title: {
                //        //text: '成绩走势'
                //    },
                //    tooltip: {
                //        trigger: 'axis',
                //        show: true
                //    },
                //    legend: {
                //        data: dataJson.chart.legend.data,
                //        orient: 'horizontal',
                //        bottom: '0'
                //    },
                //    grid: {
                //        left: '2%',
                //        right: '12%',
                //        top: chartPercent,
                //        containLabel: true
                //    },
                //    toolbox: {},
                //    xAxis: dataJson.chart.xAxis,
                //    //xAxis: {
                //        //type: 'category',
                //        //boundaryGap: true,
                //        //data: dataJson.chart.xAxis,
                //    //},
                //    yAxis: [
                //        {
                //            type: 'value'
                //        }
                //    ],
                //    series: dataJson.chart.series
                //};
                //myScoreAccountChart.setOption(option);
            } else {
              util.checkLoginTimeout(res);
            }
        });
    }


});
