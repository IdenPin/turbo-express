/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
define(['commonjs', '../css/data/data-school-enrollment.css', 'handlebars', 'noDataTips', 'autoComplete'], function (util, dataSchoolEnrollmentCSS, handlebars, noDataTips) {
    // 院校所属
    util.ajaxFun(util.INTERFACE_URL.getProvinceList, 'get', {}, function (res) {
        if (res.rtnCode === "0000000") {
            var template = handlebars.compile($("#province-list-tpl").html());
            $('#province-list').html(template(res));
        }
    });
    getCollegeList('BATCHTYPE', "#college-list-tpl", "#college-list");    //院校分类
    getCollegeList('FEATURE', "#characteristic-list-tpl", "#characteristic-list");    //院校特征
    /*
     * getgetCollegeList()
     * @hdsDom    handlebars模板class或id
     * @htmlDom   html模板class或id
     * */
    function getCollegeList(type, hdsDom, htmlDom) {
        util.ajaxFun(util.INTERFACE_URL.getCollegeList, 'get', {type: type}, function (res) {
            if (res.rtnCode == '0000000') {
                var template = handlebars.compile($(hdsDom).html());
                $(htmlDom).html(template(res));
                $("#college-list dd").children("span").eq(0).addClass("all active _ml45");
            }
        });
    }

    //招生年份
    util.ajaxFun(util.INTERFACE_URL.getAdmissionline, 'get', {}, function (res) {
        if (res.rtnCode === "0000000") {
            var template = handlebars.compile($("#enrol-years-tpl").html());
            $('#enrol-years').html(template(res));
        }
    });

    /*
     * getLineList()
     * 参数说明:
     * @queryparam:搜索框参数（院校名称）
     * @year:年份(选填)
     * @areaId:省份(选填)
     * @property:985/211（选填，无默认）
     * @batch:批次(选填)
     * @type:类型(选填，默认1文史2理工)
     * @page:页
     * @rows:每页条数 默认5条
     * */
    var queryparam = '',
        year = '2015',
        areaId = '',
        property = '',
        batch = '1',
        type = 2,
        page = 1,
        rows = 10;
    var getLineListData = {
        "queryparam": queryparam,
        "year": year,
        "areaId": areaId,
        "property": property,
        "batch": batch,
        "type": type,
        "page": page,
        "rows": rows
    };

    //tab切换
    $('.title b').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        getLineListData.type = $(this).attr('tid');
        $('#line-list').html('');
        getLineListData.page = page;
        getLineListData.rows = rows;
        getLineList();
    });


    function getLineList() {
        util.ajaxFun(util.INTERFACE_URL.getLineList, 'get', getLineListData, function (res) {
            if (res.rtnCode == '0000000') {
                //alert(getLineListData.year)
                handlebars.registerHelper('propertyList', function (date) {
                    var propertyListTpl = '';
                    switch (date){
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


                var template = handlebars.compile($('#line-list-tpl').html());

                if(util.cookie.getCookieValue('vipStatus') == 0)
                {
                    if(getLineListData.year == '2015')
                    {
                        $(".btn-more").hide();
                        $('#line-list').html('');
                        $(".data-not-vip-tip").show();
                    }
                    else
                    {
                        $('#line-list').append(template(res.bizData));
                        $(".data-not-vip-tip").hide();
                        $(".btn-more").show();
                    }
                }
                else
                {
                    $('#line-list').append(template(res.bizData));
                    $(".data-not-vip-tip").hide();
                    $(".btn-more").show();
                }
                //alert("VIP是否: " + util.cookie.getCookieValue('vipStatus'));
                $('.records-num').text($('#total').text());
                $('.tips').find('.records-num').text(res.bizData.records);
                $('.tips').removeClass('hide');
                //判断是否有下一页
                if (res.bizData.rows.length < rows) {
                    $('.btn-next').hide();
                } else {
                    $('.btn-next').show();
                }
                //加载更多按钮
                if (res.bizData.records > rows) {
                    $('.btn-next').show();
                } else {
                    $('.btn-next').hide();
                }
                //没有数据
                if (res.bizData.rows.length == 0) {
                    $('.data-tips').html(noDataTips('真抱歉,没有查到'));
                    $('.btn-next').hide();
                } else {
                    $('.data-tips').html('');
                }
                $('.data-list').removeClass('hide');
                $('.btn-next').text('加载更多').removeAttr('disabled');

            }
        });
    }
    //待优化,临时写
    //getLineListData.areaId = 330000;//浙江
    //getLineListData.batch = 1;//一批本科
    getLineList();
    $('.btn-next').on('click', function () {
        $('.btn-next').text('加载中...').attr('disabled', 'disabled');
        getLineListData.page = getLineListData.page + 1;
        getLineList();
    });
//省份筛选
    $(document).on('click', '#province-list dd span', function () {
        $('.btn-next').hide();
        getLineListData.queryparam = '';
        getLineListData.page = 1;
        getLineListData.areaId = $(this).attr('areaId');
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#line-list').html('');
        getLineList();
    });
//院校分类筛选
    $(document).on('click', '#college-list dd span', function () {
        $('.btn-next').hide();
        getLineListData.queryparam = '';
        getLineListData.page = 1;
        getLineListData.batch = $(this).attr('sortid');
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#line-list').html('');
        getLineList();
    });
//院校特征
    $(document).on('click', '#characteristic-list dd span', function () {
        $('.btn-next').hide();
        getLineListData.queryparam = '';
        getLineListData.page = 1;
        var property = $(this).html();
        if(property == '全部'){
            getLineListData.property = '';
        }else{
            getLineListData.property = property;
        }
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#line-list').html('');
        getLineList();
    });
//院校特征
    $(document).on('click', '#enrol-years dd span', function () {
        $('.btn-next').hide();
        getLineListData.queryparam = '';
        getLineListData.page = 1;



        getLineListData.year = $(this).attr('yearid');
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#line-list').html('');
        getLineList();
    });
//搜索
    $(document).on('click', '.go', function () {
        $('.btn-next').hide();
        $('#province-list dd span').removeClass('active');
        $('#college-list dd span').removeClass('active');
        $('#characteristic-list dd span').removeClass('active');
        $('#enrol-years dd span').removeClass('active');
        getLineListData.page = 1;
        getLineListData.year = '';
        getLineListData.areaId = '';
        getLineListData.property = '';
        getLineListData.batch = '';
        getLineListData.queryparam = $.trim($('#query').val());
        $('#line-list').html('');
        getLineList();
    });

//院校信息详情跳转
    $(document).on('click', '.school-info .name', function () {
        var id = $(this).attr('did');
        window.location = 'http://' + window.location.host + '/data-school-detail.html?id=' + id + '';
    });
});
