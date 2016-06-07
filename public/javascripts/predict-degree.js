define(['commonjs', 'tips', 'handlebars', 'cookie', 'echarts', 'noDataTips', 'autoComplete'], function (util, tips, handlebars, cookie, echarts, noDataTips) {
    require('../css/volunteer/predict-degree.css');
    $(function () {
        var targetScoreV = util.cookie.getCookieValue('targetScore');
        var targetSchoolV = util.cookie.getCookieValue('targetSchool');
        var subjectType = util.cookie.getCookieValue('subjectType');
        $('#score').val(targetScoreV);
        $('#universityName').val(targetSchoolV);
        $('.radio-subject[value="' + subjectType + '"]').attr('checked', 'checked');
        var volunteerBanner = require('../img/volunteer-banner.jpg');
        var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
        $('.volunteer-banner').html(volunteerBannerImg);

        ////默认填写目标院校
        //var forecastSchool = util.getLinkey(encodeURIComponent('forecastSchool'));
        //$('#universityName').val(forecastSchool);
        $('#predict-degree-btn').on('click', function () {
            var subjectV = $('.radio-subject[name="subject"]:checked').val(),
                scoreV = $.trim($('#score').val()),
                universityNameV = $.trim($('#universityName').val());
            if (!cookie.getCookieValue('isLogin')) {
                tips('#tips', '请先登录后再操作!');
                return false;
            }
            //非vip
            var vipStatus = cookie.getCookieValue('vipStatus');
            if (vipStatus == 0) {
                tips('#tips', '您还不是vip,请升级vip后使用!');
                return false;
            }

            if (subjectV == "" || subjectV == undefined) {
                tips('#tips', '请选择科目');
                return false;
            }

            if (scoreV == "") {
                tips('#tips', '请输入分数');
                return false;
            }
            var re = /^[1-9]+[0-9]*]*$/;
            if (!re.test(scoreV)) {
                tips('#tips', '请输入正确分数');
                return false;
            }
            if (universityNameV == "") {
                tips('#tips', '请输入目标院校');
                return false;
            }
            util.ajaxFun(util.INTERFACE_URL.getPredictProbability, 'GET', {
                'type': subjectV,
                'score': scoreV,
                'universityName': universityNameV
            }, function (res) {
                util.checkLoginTimeout(res);
                if (res.rtnCode === "0000000") {
                    var tipArr = [
                        '',
                        '您被这所院校录取的机率极小，建议您慎重考虑！',
                        '您被这所院校录取的机率较小，别灰心，换个目标试试吧！',
                        '您报考这所院校有一定风险，再努力努力吧！',
                        '您被这所院校录取的机率较大，很有希望被录取，继续加油！',
                        '您报考这所院校十拿九稳，可以选择更高的目标了！'
                    ];
                    $('#content-a').hide();
                    $('#content-b').show();
                    var template = handlebars.compile($("#temp-content").html());
                    $('#content-b').html(template(res.bizData));
                    var startNum = res.bizData.probability + 1;
                    startNum > 2 ? $('#recommend').show() : $('#recommend').hide();
                    var strArr = [];
                    for (var i = 0; i < startNum; i++) {
                        strArr += '<span class="star icon-star-y"></span>';
                    }
                    for (var j = 0; j < 5 - parseInt(startNum); j++) {
                        strArr += '<span class="star icon-star-n"></span>';
                    }
                    $('#tips-txt').html(tipArr[startNum]);
                    $('#star-list').html(strArr);

                    $('.radio-subject[name="subject"]:checked').val() == '1' ? $('#type-subject').text('文史') : $('#type-subject').text('理工');
                    if (res.bizData.historyList.length == 0) {
                        $('.data-tips').html(noDataTips('真抱歉,暂无数据'));
                    } else {
                        $('.data-tips').html('');
                    }


                    // 基于准备好的dom，初始化echarts实例
                    var historyChartData = {
                        year: [],
                        avgScore: [],
                        minScore: []
                    };
                    console.log(res.bizData.historyList);
                    $.each(res.bizData.historyList, function (i, v) {
                        //alert("年份: " + v.year + "最低分: " + v.minScore);
                        historyChartData.year.push(v.year + '年');
                        historyChartData.avgScore.push(v.avgScore);
                        historyChartData.minScore.push(v.minScore);
                    });
                    var myChart = echarts.init(document.getElementById('admission-situation-chart'));
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            text: '历年录取分数线: ',
                            textStyle: {
                                'fontSize': '16',
                                'fontWeight': 'normal',
                                'color': '#333'
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['平均分 - 理工', '最低分 - 理工'],
                            orient: 'horizontal',
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
                                //saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: historyChartData.year
                        },
                        yAxis: {
                            type: 'value',
                            scale: true,
                            splitNumber: historyChartData.minScore.length,
                            max:historyChartData.minScore
                        },
                        series: [
                            //需求变更,暂时不展示
                            {
                                name: '平均分 - 理工',
                                type: 'line',
                                data: historyChartData.avgScore,
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: '#FF9A9A',
                                            width: 4
                                        }
                                    }
                                }
                            },
                            {
                                name: '最低分 - 理工',
                                type: 'line',
                                data: historyChartData.minScore,
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: '#5A96CA',
                                            width: 4
                                        }
                                    }
                                }
                            }
                        ]
                    });


                } else {
                    tips('#tips', res.msg);
                }
            });
        });
        $('#content-b').on('click', '#prev-btn', function () {
            $('#content-a').show();
            $('#content-b').hide();
        });


        // 设为我的目标
        $('#content-b').on('click', '#set-my-target-btn', function () {
            setCookie();
            window.location.assign('http://' + window.location.host + '/user-target.html');
        });


        function setCookie() {
            var subjectType = $('.radio-subject[name="subject"]:checked').val(),
                scoreV = $.trim($('#score').val()),
                universityNameV = $.trim($('#universityName').val());
            util.cookie.setCookie("subjectType", subjectType, 4, "");
            util.cookie.setCookie("targetScore", scoreV, 4, "");
            util.cookie.setCookie("targetSchool", universityNameV, 4, "");
        }


        $('#content-b').on('click', '#system-school-btn', function () {
            setCookie();
            window.location.assign('http://' + window.location.host + '/predict-school.html');
        })


    });
});
