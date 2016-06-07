define(['commonjs', '../css/data/data-school-detail.css', 'handlebars', 'cookie', 'echarts', 'noDataTips'], function (util, dataSchoolEnrollmentCSS, handlebars, cookie, echarts, noDataTips) {
    // 设为目标
    $('#school-info').on('click', '.set-target,.forecasting', function () {
        var thisSchool = $(this).attr('schoolName');
        util.cookie.setCookie("targetScore", "", 4, "");
        util.cookie.setCookie("targetSchool", thisSchool, 4, "");
    });

    /*
     * 收藏模块
     * 拉取收藏数据|添加收藏|取消收藏
     * */
    //添加或取消收藏
    function isCollection() {
        if (util.isLogin()) {
            setTimeout(function () {
                util.ajaxFun(util.INTERFACE_URL.getIsUniversityCollect, 'get', {
                    type: 1,//院校收藏
                    projectId: id
                }, function (res) {
                    if (res.rtnCode == '0000000') {
                        res.bizData == 1 ? $('.isCollect').text('已收藏').attr('cid', 1) : $('.isCollect').text('未收藏').attr('cid', 0);
                        res.bizData == 1 ? $('.icon-heart').removeClass('hide') : $('.icon-heart-no').removeClass('hide');
                    }
                });
            }, 800);
            $(document).on('click', '.isCollect', function () {
                var collectId = $(this).attr('cid');
                addOrDelCollect(collectId);
            });
            function addOrDelCollect(type) {
                var url = '';
                if (type == 0) {
                    url = util.INTERFACE_URL.saveUserCollect;  //添加
                    $('.isCollect').text('已收藏').attr('cid', 1);
                    $('.icon-heart').removeClass('hide');
                    $('.icon-heart-no').addClass('hide');
                } else if (type == 1) {
                    url = util.INTERFACE_URL.deleteUserCollect; //取消
                    $('.isCollect').text('未收藏').attr('cid', 0);
                    $('.icon-heart-no').removeClass('hide');
                    $('.icon-heart').addClass('hide');
                }
                var data = {
                    type: 1,//院校收藏
                    projectId: id
                };
                util.ajaxFun(url, 'get', data, function (res, strMsg) {
                    if (res.rtnCode == '0000000') {
                        //alert('操作成功!');
                    }
                });
            }
        } else {
            setTimeout(function () {
                $('.isCollect').html('+加收藏').addClass('no-login-add');

            }, 800);
        }
    }

    //未登录点击收藏提示登录
    $(document).on('click', '.no-login-add', function () {
        var go = confirm('╮(╯▽╰)╭,收藏功能登录后才能操作.');
        if (go == true) {
            window.location.href = '/login.html';
        }
    });
    /*
     *左侧切换
     * @typeid:0~5 一一对应
     * 院校简介|报考指南|开设专业|招生计划|录取情况
     * */
    $(document).on('click', '.info-nav li', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass('active');
        switch (parseInt(_this.attr('typeid'))) {
            case 0:
                //院校基础信息
                if (util.getLinkey('typeId') != 4) {
                    isCollection();
                    getSchoolBaseInfo();
                }
                $('.open-professional,.professional-plan,.admission-situation').hide();
                //$('.open-professional,.school-intro,.professional-plan,.admission-situation').hide();
                break;
            case 1:
                //招生简章(暂缺数据)
                break;
            case 2:
                $('#open-professional2').html('');
                $('.school-intro,.professional-plan,.admission-situation').hide();
                break;
            case 3:
                //招生计划
                $('#professional-plan-select').html('');
                $('.open-professional,.school-intro,.admission-situation').hide();
                break;
            default:
                //录取情况
                $('#professional-situation-table').html('');
                $('.open-professional,.school-intro,.professional-plan').hide();
                break;
        }
    });

    /*
     * ==================================================================
     * 拉取院校基础信息
     * */
    var id = util.getLinkey('id'); //公用院校id
    function getSchoolBaseInfo() {
        util.ajaxFun(util.INTERFACE_URL.getSchoolDetail, 'get', {universityId: id}, function (res) {
            if (res.rtnCode == '0000000') {
                if (util.isLogin) {
                    handlebars.registerHelper('collectionHelper', function (val) {
                        if (val == 1) {
                            return '已收藏'
                        } else {
                            return '未收藏'
                        }
                    });
                }
                handlebars.registerHelper('propertyList', function (date) {
                    var propertyListTpl = '';
                    switch (date) {
                        case '985':
                            propertyListTpl += '<span class="type-985">985</span>';
                            break;
                        case '211':
                            propertyListTpl += '<span class="type-211">211</span>';
                            break;
                        case '有研究生院':
                            propertyListTpl += '<span class="type-yan">研</span>';
                            break;
                        case '含国防生':
                            propertyListTpl += '<span class="type-guo">国</span>';
                            break;
                        case '卓越计划':
                            propertyListTpl += '<span class="type-zhuo">卓</span>';
                            break;
                        case '自主招生':
                            propertyListTpl += '<span class="type-zi">自</span>';
                            break;
                    }
                    return propertyListTpl;
                });
                handlebars.registerHelper('whichOne', function (v1, v2) {
                    if (v1.indexOf('http') > -1) {
                        var str = '<img src="' + v1 + '" class="school-avatar">';
                        return str;
                    } else {
                        return v2.fn(this);
                    }
                });

                handlebars.registerHelper('whichOne', function (v1, v2) {
                    if (v1.indexOf('http') > -1) {
                        return ('<img src="' + v1 + '" class="school-avatar" sid="{{id}}">');
                    } else {
                        return v2.fn(this);
                    }
                });
                var template = handlebars.compile($('#school-info-tpl').html());
                $('#school-info-detail').html(template(res.bizData));
                //展示院校简介
                $('.school-intro').html(res.bizData.universityIntro).show();
                if (util.getLinkey('typeId') == 4) {
                    $('#menu-tab li[typeid="4"]').click(function () {

                        //cubic add code
                        loadSelectCondition('ue');
                        loadSelectCondition('me');

                        //院校录取情况
                        //enrollingChartListData.batch = chartListBatch;
                        //enrollingChartListData.majorType = chartListMajorType;
                        //getSelectParameterList('', '.professional-info-subject', '.professional-info-batch');
                        //queryUniversityEnrollingChartList();
                        //专业录取情况
                        //universityMajorData.year = universityMajorYear;
                        //universityMajorData.batch = universityMajorBatch;
                        //universityMajorData.universityMajorType = universityMajorType;
                        //universityMajorData.offset = universityMajorOffset;
                        //getUniversityMajorEnrollingSituationList();
                        //getSelectParameterList('.professional-enroll-year', '.professional-enroll-subject', '.professional-enroll-batch');
                    });

                    //}).click(); || fuck !

                }

            }
        });
    }

    isCollection();
    getSchoolBaseInfo();
    $('#menu-tab li[typeid="0"]').click(function () {
        $('.school-intro').show();
    });
    /*
     * ==================================================================
     * 开设专业
     * */

    function getOpenProfess() {
        util.ajaxFun(util.INTERFACE_URL.getRemoteUniversityMajorListByUniversityId, 'get', {
            universityId: id
        }, function (res) {
            if (res.rtnCode == '0000000') {
                var jsonData = res.bizData;
                $('.open-professional').show();
                var $specialContent = $('#special-content');
                var tabsHtml = [];

                //var tabsArr = {
                //
                //}
                //$.each(res.bizData, function(i, v){
                //    alert("索引: " + i);
                //});
                //
                for (var tabs in jsonData) {
                    //alert("显示选项卡: " + tabs);
                    tabsHtml.push('<p class="professional-sub-title">' + tabs + '</p>');
                    $('#special-profession-title').html(tabsHtml);
                }
                $('body').on('click', '.professional-sub-title', function () {
                    $(this).addClass('bt3').siblings().removeClass('bt3');
                    $specialContent.html('');
                    if (Object.prototype.toString.call(jsonData[$(this).text()]) === '[object Object]') {
                        for (var tabsub in jsonData[$(this).text()]) {
                            $specialContent.append('<div class="tabsub">' + tabsub + '</div>');
                            for (var j = 0; j < jsonData[$(this).text()][tabsub].length; j++) {
                                var majorId = jsonData[$(this).text()][tabsub][j].majorId,
                                    majorName = jsonData[$(this).text()][tabsub][j].majorName;
                                majorId ? $specialContent.append('<span class="feature-major"><a target="_blank" href="/data-professional-detail.html?id=' + majorId + '">' + majorName + '</a></span>') : $specialContent.append('<span class="feature-major">' + majorName + '</span>');
                            }
                        }
                    }
                    for (var i = 0; i < jsonData[$(this).text()].length; i++) {
                        var majorIdSub = jsonData[$(this).text()][i].majorId,
                            majorNameSub = jsonData[$(this).text()][i].majorName;
                        majorIdSub ? $specialContent.append('<span class="feature-major"><a target="_blank" href="/data-professional-detail.html?id=' + majorIdSub + '">' + majorNameSub + '</a></span>') : $specialContent.append('<span class="feature-major">' + majorNameSub + '</span>');
                    }
                });
                $('body').find('.professional-sub-title:eq(0)').click();

            }
        });


    }

    //$('body').on('click', '.open-professional .btn-next', function () {
    //    getOpenProfessData.offset += openProfessRows;
    //    getOpenProfess()
    //});
    $('#menu-tab li[typeid="2"]').click(function () {
        getOpenProfess();

    });


    /*
     * 招生计划
     * ==================================================================
     * (院校招生计划图标|院校招生计划)
     * */
    function getSelectParameterList(yearDom, subjectDom, batchDom) {
        //获取年份
        util.ajaxFun(util.INTERFACE_URL.getAdmissionline, 'get', {}, function (res) {
            if (res.rtnCode == '0000000') {
                //var html = '<option value="">请选择年份</option>';
                var html = '';
                res.bizData.forEach(function (i) {
                    html += '<option value="' + i + '">' + i + '年</option>';
                });
                $(yearDom).html(html);
            }
        });
        //获取科目
        var universitySubjectListData = {};
        util.ajaxFun(util.INTERFACE_URL.getRemoteDataDictList, 'get', {}, function (res) {
            if (res.rtnCode == '0000000') {
                //var html = '<option value="">请选择科目</option>';
                var html = '';
                $.each(res.bizData, function (i, v) {
                    html += '<option value="' + v.dictId + '">' + v.name + '</option>'
                });
                $(subjectDom).html(html);
            }
        });
        //获取批次
        var universityBatchListData = {
            type: "BATCHTYPE"
        };
        util.ajaxFun(util.INTERFACE_URL.getCollegeList, 'get', universityBatchListData, function (res) {
            if (res.rtnCode == '0000000') {
                //var html = '<option value="">请选择批次</option>';
                var html = '';
                $.each(res.bizData, function (i, v) {
                    html += '<option value="' + v.dictId + '">' + v.name + '</option>'
                });
                $(batchDom).html(html);
            }
        });
    }


    /*  cubic add code
     *   for page data-school-detail.html
     *   used to load select component for filter display list
     *
     *   key-value for predefined terms
     *   year:  YYYY -> YYYY
     *   major type: 1 -> 文科  2 -> 理科
     *   batch: 1 -> 一批本科  2 -> 二批本科  4 -> 三批本科  8 -> 高职（专科）
     */
    var dictMajorType = {"1": "文史", "2": "理工"};
    var dictBatchType = {"1": "一批本科", "2": "二批本科", "4": "三批本科", "8": "高职（专科）"};

    window.zgk = {activeData: {ue: null, me: null, mp: null}};

    function loadSelectCondition(loadType) {
        if (loadType === 'mp') { //for plan
            util.ajaxFun(util.INTERFACE_URL.getMpConditions, 'GET', {universityId: id}, function (res) {
                if (res.rtnCode == '0000000') {
                    var mpData = res.bizData;
                    var yearIndex = null, majorTypeIndex = null;
                    for (yearIndex in mpData) {
                        for (majorTypeIndex in mpData[yearIndex]) {
                            break;
                        }
                        break;
                    }
                    window.zgk.mp = mpData;
                    if (yearIndex !== null) {
                        majorEnrollingPlanListData.year = yearIndex;
                        majorEnrollingPlanListData.universityMajorType = mpData[yearIndex][majorTypeIndex];
                        loadSelectHtml('mp');
                    } else {
                        $('.professional-plan-year').hide();
                        $('.professional-plan-subject').hide();
                        $('#professional-plan-select').html('');
                        majorEnrollingPlanList();
                    }
                } else {
                    console.log(res);
                }
            });
        } else if (loadType === 'ue') { // for taken
            util.ajaxFun(util.INTERFACE_URL.getUeConditions, 'GET', {universityId: id}, function (res) {
                if (res.rtnCode == '0000000') {
                    var ueData = res.bizData;
                    var majorTypeIndex = null, batchIndex = null;
                    for (majorTypeIndex in ueData) {
                        for (batchIndex in ueData[batchIndex]) {
                            break;
                        }
                        break;
                    }
                    window.zgk.ue = ueData;
                    if (majorTypeIndex !== null) {
                        enrollingChartListData.majorType = majorTypeIndex;
                        enrollingChartListData.batch = ueData[majorTypeIndex][batchIndex];
                        loadSelectHtml('ue');
                    } else {
                        $('.professional-info-subject').hide();
                        $('.professional-info-batch').hide();
                        queryUniversityEnrollingChartList();
                    }
                } else {
                    console.log(res);
                }
            });
        } else if (loadType === 'me') {
            util.ajaxFun(util.INTERFACE_URL.getMeConditions, 'GET', {universityId: id}, function (res) {

                if (res.rtnCode == '0000000') {
                    var meData = res.bizData;
                    var yearIndex = null, majorTypeIndex = null, batchIndex = null;
                    for (yearIndex in meData) {
                        console.log(meData)
                        for (majorTypeIndex in meData[yearIndex]) {
                            for (batchIndex in meData[yearIndex][majorTypeIndex]) {
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    window.zgk.me = meData;
                    if (yearIndex !== null) {
                        universityMajorData.year = yearIndex;
                        universityMajorData.universityMajorType = majorTypeIndex;
                        universityMajorData.batch = meData[yearIndex][majorTypeIndex][batchIndex];
                        loadSelectHtml('me');
                    } else {
                        $('.professional-enroll-year').hide();
                        $('.professional-enroll-subject').hide();
                        $('.professional-enroll-batch').hide();
                        getUniversityMajorEnrollingSituationList();
                    }

                } else {
                    console.log(res);
                }
            });
        }
    }

    var showText = {
        lowText: '最低分 - 文史',
        avgText: '平均分 - 文史'
    }

    function loadSelectHtml(e) {
        var $dom, dataType, classFlag, tmpHtml;
        if (typeof e === 'string') {
            dataType = e;
            switch (dataType) {
                case 'mp':
                {
                    tmpHtml = '';
                    $.each(window.zgk.mp, function (k, v) {
                        tmpHtml = '<option value="' + k + '">' + k + '年</option>' + tmpHtml;
                    });
                    $('.professional-plan-year').html(tmpHtml);
                    classFlag = 'professional-plan-year';
                    break;
                }
                case 'ue':
                {
                    tmpHtml = '';
                    $.each(window.zgk.ue, function (k, v) {
                        tmpHtml += '<option value="' + k + '">' + dictMajorType[k] + '</option>';
                    });
                    $('.professional-info-subject').html(tmpHtml);
                    classFlag = 'professional-info-subject';
                    break;
                }
                case 'me':
                {
                    tmpHtml = '';
                    $.each(window.zgk.me, function (k, v) {
                        tmpHtml = '<option value="' + k + '">' + k + '年</option>' + tmpHtml;
                    });
                    $('.professional-enroll-year').html(tmpHtml);
                    classFlag = 'professional-enroll-year';
                    break;
                }
            }
        } else {
            $dom = $(e.target);
            classFlag = $dom.attr('class');
        }

        switch (classFlag) {
            case 'professional-plan-year':
            {
                majorEnrollingPlanListData.year = $('.professional-plan-year').val();
                tmpHtml = '';
                $.each(window.zgk.mp[majorEnrollingPlanListData.year], function (k, v) {
                    tmpHtml += '<option value="' + v + '">' + dictMajorType[v] + '</option>';
                });
                $('.professional-plan-subject').html(tmpHtml);
            }
            case 'professional-plan-subject':
            {
                majorEnrollingPlanListData.universityMajorType = $('.professional-plan-subject').val();
                dataType = 'mp';
                break;
            }
            case 'professional-info-subject':
            {
                enrollingChartListData.majorType = $('.professional-info-subject').val();
                tmpHtml = '';
                switch (parseInt($('.professional-info-subject').val())) {
                    case 1://文史
                        showText.lowText = '最低分 - 文史';
                        showText.avgText = '平均分 - 文史';
                        break;
                    case 2://理工
                        showText.lowText = '最低分 - 理工';
                        showText.avgText = '平均分 - 理工';
                        break;
                }
                $.each(window.zgk.ue[enrollingChartListData.majorType], function (k, v) {
                    tmpHtml += '<option value="' + v + '">' + dictBatchType[v] + '</option>';
                });
                $('.professional-info-batch').html(tmpHtml);
            }
            case 'professional-info-batch':
            {
                enrollingChartListData.batch = $('.professional-info-batch').val();
                dataType = 'ue';
                break;
            }
            case 'professional-enroll-year':
            {
                universityMajorData.year = $('.professional-enroll-year').val();
                tmpHtml = '';
                $.each(window.zgk.me[universityMajorData.year], function (k, v) {
                    tmpHtml += '<option value="' + k + '">' + dictMajorType[k] + '</option>';
                });
                $('.professional-enroll-subject').html(tmpHtml);
            }
            case 'professional-enroll-subject':
            {
                universityMajorData.universityMajorType = $('.professional-enroll-subject').val();
                tmpHtml = '';
                $.each(window.zgk.me[universityMajorData.year][universityMajorData.universityMajorType], function (k, v) {
                    tmpHtml += '<option value="' + v + '">' + dictBatchType[v] + '</option>';
                });
                $('.professional-enroll-batch').html(tmpHtml);
            }
            case 'professional-enroll-batch':
            {
                universityMajorData.batch = $('.professional-enroll-batch').val();
                dataType = 'me';
                break;
            }
        }
        switch (dataType) {
            case 'mp':
            {
                $('#professional-plan-select').html('');
                majorEnrollingPlanListData.offset = 0;
                majorEnrollingPlanList();
                break;
            }
            case 'ue':
            {
                enrollingChartListData.offset = 0;
                queryUniversityEnrollingChartList();
                break;
            }
            case 'me':
            {
                universityMajorData.offset = 0;
                getUniversityMajorEnrollingSituationList();
                break;
            }
        }

    }


    $(document)
        .on('change', '.professional-plan-year', loadSelectHtml)
        .on('change', '.professional-plan-subject', loadSelectHtml)
        .on('change', '.professional-info-subject', loadSelectHtml)
        .on('change', '.professional-info-batch', loadSelectHtml)
        .on('change', '.professional-enroll-year', loadSelectHtml)
        .on('change', '.professional-enroll-subject', loadSelectHtml)
        .on('change', '.professional-enroll-batch', loadSelectHtml);

    /*
     * 筛选查询
     * 年份,科目,批次筛选
     * universityMajorType:文1,理2
     * */
    var searchYear = '2015',
        searchUniversityMajorType = '1',
        searchBatch = '1',
        majorEnrollingPlanRows = 10,
        majorEnrollingPlanOffset = 0,
        majorEnrollingPlanListData = {
            'universityId': id, //院校Id
            'year': searchYear, //年份
            //'batch': searchBatch, //批次
            'universityMajorType': searchUniversityMajorType, //专业类别
            'offset': majorEnrollingPlanOffset, //起始条数（选填）
            'rows': majorEnrollingPlanRows //查询条数（选填）
        };
    /*$(document).on('change', '.professional-plan-year', function () {
     majorEnrollingPlanListData.year = $(this).val();
     majorEnrollingPlanListData.offset = majorEnrollingPlanOffset;
     $('#professional-plan-select').html('');
     majorEnrollingPlanList();
     });
     $(document).on('change', '.professional-plan-subject', function () {
     majorEnrollingPlanListData.universityMajorType = $(this).val();
     majorEnrollingPlanListData.offset = majorEnrollingPlanOffset;
     $('#professional-plan-select').html('');
     majorEnrollingPlanList();
     });
     $(document).on('change', '.professional-plan-batch', function () {
     majorEnrollingPlanListData.batch = $(this).val();
     majorEnrollingPlanListData.offset = majorEnrollingPlanOffset;
     $('#professional-plan-select').html('');
     majorEnrollingPlanList();
     });*/

    function majorEnrollingPlanList() {
        util.ajaxFun(util.INTERFACE_URL.getUniversityMajorEnrollingPlanList, 'get', majorEnrollingPlanListData, function (res) {
            if (res.rtnCode == '0000000') {
                if (res.bizData.length == 0 && majorEnrollingPlanListData.offset != majorEnrollingPlanRows) {
                    $('.professional-plan .no-data-tips').html('(ﾟ∀ﾟ) 真抱歉,没有匹配到院校招生计划相关数据').show();
                } else {
                    $('.professional-plan .no-data-tips').hide();
                    var template = handlebars.compile($('#professional-plan-select-tpl').html());
                    handlebars.registerHelper("lengthOfSchoolingFormat", function (value) {
                        if (value == "0" || !value) {
                            return "-";
                        } else {
                            return value;
                        }
                    });
                    handlebars.registerHelper("schoolFeeFormat", function (value) {
                        if (value == "0" || !value) {
                            return "-";
                        } else {
                            return value;
                        }
                    });
                    //$('#professional-plan-select').html('');
                    $('#professional-plan-select').append(template(res));
                    $('.professional-plan').show();
                }
                if (res.bizData.length >= majorEnrollingPlanRows) {
                    $('.professional-plan .btn-more .btn-next').show();
                } else {
                    $('.professional-plan .btn-more .btn-next').hide();
                }
            }
        });
    }

    //加载更多
    $('body').on('click', '.professional-plan .btn-more .btn-next', function () {
        majorEnrollingPlanListData.offset += majorEnrollingPlanRows;
        majorEnrollingPlanList();
    });
    $('#menu-tab li[typeid="3"]').click(function () {
        majorEnrollingPlanListData.offset = majorEnrollingPlanOffset;
        majorEnrollingPlanListData.year = searchYear;
        majorEnrollingPlanListData.batch = searchBatch;
        majorEnrollingPlanListData.universityMajorType = searchUniversityMajorType;

        //cubic add code
        loadSelectCondition('mp');


        $('#professional-plan-select').html('');
        //majorEnrollingPlanList();
        $('.professional-plan').show();
        //getSelectParameterList('.professional-plan-year', '.professional-plan-subject', '.professional-plan-batch');
    });


    /*
     * 录取情况
     * ==================================================================
     * (院校录取情况|专业录取情况) || 图标展示
     * */
    //院校录取
    var chartListMajorType = '1',
        chartListBatch = '1',
        enrollingChartListData = {
            'universityId': id,
            'majorType': chartListMajorType,
            'batch': chartListBatch
        };
    /*$(document).on('change', '.professional-info-subject', function () {
     enrollingChartListData.majorType = $(this).val();
     queryUniversityEnrollingChartList();
     });
     $(document).on('change', '.professional-info-batch', function () {
     enrollingChartListData.batch = $(this).val();
     queryUniversityEnrollingChartList();
     });*/

    function queryUniversityEnrollingChartList() {
        util.ajaxFun(util.INTERFACE_URL.queryUniversityEnrollingChartList, 'get', enrollingChartListData, function (res) {
            if (res.rtnCode == '0000000') {
                //数据过滤处理 不是vip(2015)
                if (util.cookie.getCookieValue('vipStatus') == 0) {
                    var j = 0;
                    $.each(res.bizData, function (i, v) {
                        //非vip2015年数据都制空.
                        if (v.year == '2015') {
                            v.lockFlag = true;
                            v.batch = '';
                            v.batchName = '';
                            v.highestScore = '';
                            v.planEnrollingNumber = '';
                            v.lowestScore = '';
                            v.realEnrollingNumber = '';
                            v.typeId = '';
                            v.typeName = '';
                        }
                    });
                }
                //console.info(res);
                var template = handlebars.compile($('#university-situation-table-tpl').html());
                $('#university-situation-table').html(template(res));
                if (res.bizData.length == 0) {
                    //空数据提示
                    $('.get-admitted-situation .no-data-tips').html('(ﾟ∀ﾟ) 真抱歉,没有匹配到院校录取详情相关数据').show();
                    $('#chart-container').addClass('no-data-tips').html('(ﾟ∀ﾟ) 真抱歉,数据不全图标暂时无法绘制').show();
                } else {
                    if (util.cookie.getCookieValue('vipStatus') == 0) {
                        $('.admitted-lock-data').show();//展示15年数据
                    }
                    $('.get-admitted-situation .no-data-tips').hide();
                    /*
                     * =============新增录取情况图标统计=================
                     * */
                    // 基于准备好的dom，初始化echarts实例
                    var professionalChartData = {
                        year: [],
                        averageScore: [],
                        lowestScore: []
                    };
                    $.each(res.bizData, function (i, v) {
                        //alert("年份: " + v.year + "最低分: " + v.lowestScore);
                        professionalChartData.year.push(v.year + '年');
                        professionalChartData.averageScore.push(v.averageScore);
                        professionalChartData.lowestScore.push(v.lowestScore);
                    });
                    //$('.professional-info-subject').val() == '1' ? $('#second-title').html('文史类录取数据') : $('#second-title').html('理工类录取数据');
                    $(document).on('change', '.professional-info-subject', function () {
                        var titleDom = $("#second-title");
                        //$(this).val() == 1 ? titleDom.html('文史类录取数据') : titleDom.html('理工类录取数据');
                    });
                    var myChart = echarts.init(document.getElementById('admission-situation-chart'));
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            //text: $('.professional-info-subject').val() == '1' ? '文史类录取数据' : '理工类录取数据',
                            textStyle: {
                                'fontSize': '16',
                                'color': '#666'
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            //data: ['最低分 - 理工'],
                            data: [showText.lowText, showText.avgText],
                            orient: 'horizontal'
                        },
                        grid: {
                            left: '0',
                            right: '4%',
                            bottom: '4%',
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
                            data: professionalChartData.year
                        },
                        yAxis: {
                            type: 'value',
                            scale: true,
                            splitNumber: professionalChartData.lowestScore.length,
                            max: professionalChartData.lowestScore
                        },
                        series: [
                            //需求变更,暂时不展示
                            {
                                name: showText.lowText,
                                type: 'line',
                                data: professionalChartData.lowestScore,
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
                                name: showText.avgText,
                                type: 'line',
                                data: professionalChartData.averageScore,
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
                }
                $('.admission-situation').show();
            }
        });
    }

    // 专业录取
    var universityMajorOffset = 0,
        universityMajorRows = 10,
        universityMajorType = '1',
        universityMajorBatch = '1',
        universityMajorYear = '2015',
        universityMajorData = {
            'universityId': id,
            'year': universityMajorYear,
            'batch': universityMajorBatch,
            'universityMajorType': universityMajorType,
            'offset': universityMajorOffset,
            'rows': universityMajorRows
        };
    $(document).on('change', '.professional-enroll-year', function () {
        universityMajorData.year = $(this).val();
        universityMajorData.offset = universityMajorOffset;
        $('#professional-situation-table').html('');
        //getUniversityMajorEnrollingSituationList();
    });
    $(document).on('change', '.professional-enroll-subject', function () {
        universityMajorData.universityMajorType = $(this).val();
        universityMajorData.offset = universityMajorOffset;
        $('#professional-situation-table').html('');
        //getUniversityMajorEnrollingSituationList();
        $('.professional-plan').hide();
    });
    $(document).on('change', '.professional-enroll-batch', function () {
        universityMajorData.batch = $(this).val();
        universityMajorData.offset = universityMajorOffset;
        $('#professional-situation-table').html('');
        //getUniversityMajorEnrollingSituationList();
    });
    function getUniversityMajorEnrollingSituationList() {
        util.ajaxFun(util.INTERFACE_URL.getUniversityMajorEnrollingSituationList, 'get', universityMajorData, function (res) {
            if (res.rtnCode == '0000000') {
                if (res.bizData.length == 0 && universityMajorData.offset != universityMajorRows) {
                    $('.professional-situation .no-data-tips').html('(ﾟ∀ﾟ) 真抱歉,没有匹配到专业录取详情相关数据').show();
                } else {
                    var template = handlebars.compile($('#professional-situation-table-tpl').html());
                    $('#professional-situation-table').append(template(res));
                    /*
                     * =======专业录取数据2015年隐藏==========
                     * */
                    if (util.cookie.getCookieValue('vipStatus') == 0) {
                        var universityMajorEnrollingYear = $('.professional-enroll-year').val();
                        if (universityMajorEnrollingYear == 2015) {
                            var strTips = "<div class='admitted-lock-data'>" +
                                "<div class='lock-tip'>成为VIP会员，即可查看2015年最新数据！！！" +
                                "<a href='/school-video-buy.html' class='btn-go-buy' target='_blank'>购买VIP</a>" +
                                "</div> </div>";
                            $('#professional-situation-table').html(strTips);//2015年非vip制空
                            $('#professional-situation-table .admitted-lock-data').css({
                                'border': '1px solid #f1f1f1',
                                'height': '100px',
                                'line-height': '100px'
                            }).show();
                        }
                    }
                }
                if (res.bizData.length >= universityMajorRows) {
                    $('.professional-situation .btn-more .btn-next').show();

                } else {
                    $('.professional-situation .btn-more .btn-next').hide();
                }
            }
        });
    }

    //加载更多
    $('body').on('click', '.professional-situation .btn-next', function () {
        universityMajorData.offset += universityMajorRows;
        getUniversityMajorEnrollingSituationList();
    });
    $('#menu-tab li[typeid="4"]').click(function () {

        loadSelectCondition('ue');
        loadSelectCondition('me');
        //院校录取情况
        //enrollingChartListData.batch = chartListBatch;
        //enrollingChartListData.majorType = chartListMajorType;
        //getSelectParameterList('', '.professional-info-subject', '.professional-info-batch');
        //queryUniversityEnrollingChartList();
        //专业录取情况
        //universityMajorData.year = universityMajorYear;
        //universityMajorData.batch = universityMajorBatch;
        //universityMajorData.universityMajorType = universityMajorType;
        //universityMajorData.offset = universityMajorOffset;
        //getUniversityMajorEnrollingSituationList();
        //getSelectParameterList('.professional-enroll-year', '.professional-enroll-subject', '.professional-enroll-batch');

    });


});
