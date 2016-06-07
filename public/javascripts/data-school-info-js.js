/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
define(['commonjs', '../css/data/data-school-info.css', 'handlebars', 'timeFormat', 'cookie', 'noDataTips', 'autoComplete'], function (util, dataSchoolInfoCss, handlebars, getTime, cookie, noDataTips) {

    var volunteerBanner = require('../img/volunteer-banner.jpg');
    var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
    $('.volunteer-banner').html(volunteerBannerImg);

    // 获取省份
    util.ajaxFun(util.INTERFACE_URL.getProvinceList, 'get', {}, function (res) {
        if (res.rtnCode === "0000000") {
            var template = handlebars.compile($("#temp-province-list").html());
            $('#province-list').html(template(res));
        }
    });
    getCollegeList('PROPERTY', "#temp-college-list", "#college-list"); //院校分类
    getCollegeList('EDULEVEL', "#temp-degree-list", "#degree-list"); //学历层次
    getCollegeList('FEATURE', "#temp-characteristic-list", "#characteristic-list"); //院校特征
    /*
     * getgetCollegeList()
     * @hdsDom    handlebars模板class或id
     * @htmlDom   html模板class或id
     * */
    function getCollegeList(type, hdsDom, htmlDom) {
        util.ajaxFun(util.INTERFACE_URL.getCollegeList, 'get', {
            type: type
        }, function (res) {
            if (res.rtnCode == '0000000') {
                handlebars.registerHelper("collectHelper", function (val) {
                    if (val == 1) {
                        return '已收藏'
                    } else if (val == 0) {
                        return '未收藏'
                    }
                });
                var template = handlebars.compile($(hdsDom).html());
                $(htmlDom).html(template(res));

            }
        });
    }


    setInterval(function () {
        //登陆后显示收藏
        if (cookie.getCookieValue('isLogin')) {
            $('.collect').removeClass('hide');  //没有登录影藏院校收藏
        }
    }, 100);
    $(document).on('click', '.collect', function () {
        var url = '',
            _this = $(this),
            type = parseInt(_this.attr('type')),
            sid = _this.attr('sid');
        if (type == 0) {
            url = util.INTERFACE_URL.saveUserCollect; //添加
            _this.html('<i class="icon-heart"></i>已收藏').attr('type', 1);
            _this.find('i').addClass('icon-heart');
        } else if (type == 1) {
            url = util.INTERFACE_URL.deleteUserCollect; //取消
            _this.html('<i class="icon-heart-no"></i>未收藏').attr('type', 0);
            _this.find('i').addClass('.icon-heart-no');
        }
        var data = {
            type: 1, //院校收藏
            projectId: sid
        };
        util.ajaxFun(url, 'get', data, function (res, strMsg) {
            if (res.rtnCode == '0000000') {
                //alert('操作成功!');
            }
        });
    });


    //院校列表(筛选)

    /*
     * getSchoolList()
     * 参数说明:
     * @universityName:院校名称
     * @areaid:省份
     * @educationLevel:学历层次
     * @type:院校分类
     * @property:院校特征
     * @offset:起始条数
     * @rows:每页条数 默认5条
     * */
    var universityName = '',
        areaid = '',
        sortId = '',
        //educationLevel = '',
        educationLevel = '1',//零时
        property = '',
        offset = 0,
        rows = 10,
        searchSchoolListData = {
            "universityName": universityName,
            "areaid": areaid,
            "type": sortId,
            "educationLevel": educationLevel,
            "property": property,
            "offset": offset,
            "rows": rows
        };

    function getSchoolList() {
        util.ajaxFun(util.INTERFACE_URL.getSearchList, 'get', searchSchoolListData, function (res) {
            if (res.rtnCode == '0000000') {
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
                var template = handlebars.compile($('#temp-search-list').html());

                handlebars.registerHelper('whichOne', function (v1,v2) {
                    if(v1.indexOf('http')>-1){
                        var str = '<img src="'+v1+'" class="school-logo" sid="{{id}}">'
                        return str;
                    }else{
                        return v2.fn(this);
                    }
                });


                $('#search-list-main').append(template(res));
                $('.tips').find('.records-num').text(res.bizData.count);
                $('.tips').removeClass('hide');
                //判断是否有下一页
                if (res.bizData.universityList.length < rows) {
                    $('.btn-next').hide();
                } else {
                    $('.btn-next').show();
                }
                //加载更多按钮
                if (res.bizData.count > rows) {
                    $('.btn-next').show();
                } else {
                    $('.btn-next').hide();
                }
                //没有数据
                if (res.bizData.universityList.length == 0) {
                    $('.data-tips').html(noDataTips('真抱歉,貌似没有了'));
                    $('.btn-next').hide();
                } else {
                    $('.data-tips').html('');
                }
                $('.data-list').removeClass('hide');
                $('.btn-next').text('加载更多').removeAttr('disabled');
                //$('.line-loader-animate').addClass('hide');
            }
        });
    }


    getSchoolList();
    //加载更多
    $('.btn-next').on('click', function () {
        $('.btn-next').text('加载中...').attr('disabled', 'disabled');
        searchSchoolListData.offset += searchSchoolListData.rows;
        getSchoolList();
    });
    //省份筛选
    $(document).on('click', '#province-ul li', function () {
        $('.btn-next').hide();
        searchSchoolListData.areaid = $(this).attr('areaId');
        searchSchoolListData.universityName = '';
        searchSchoolListData.offset = 0;
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#search-list-main').html('');
        getSchoolList();
    });
    //院校分类筛选
    $(document).on('click', '#sort-ul li', function () {
        $('.btn-next').hide();
        searchSchoolListData.type = $(this).attr('sortId');
        searchSchoolListData.universityName = '';
        searchSchoolListData.offset = 0;
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#search-list-main').html('');
        getSchoolList();
    });
    //学历层次筛选
    $(document).on('click', '#educationLevel-ul li', function () {
        $('.btn-next').hide();
        searchSchoolListData.educationLevel = $(this).attr('levelId');
        searchSchoolListData.universityName = '';
        searchSchoolListData.offset = 0;
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#search-list-main').html('');
        getSchoolList();
    });
    //院校特征
    $(document).on('click', '#property-ul li', function () {
        $('.btn-next').hide();
        searchSchoolListData.universityName = '';
        searchSchoolListData.offset = 0;
        var propertySelect = $(this).text();
        if (propertySelect != '全部') {
            searchSchoolListData.property = propertySelect;
        } else {
            searchSchoolListData.property = '';
        }
        $(this).addClass('active').siblings().removeClass('active').parent().siblings().find('.all').removeClass('active');
        $('#search-list-main').html('');
        setTimeout(function () {
            getSchoolList();
        }, 500);
        //if ($(this).attr('class') == 'active') {
        //    searchSchoolListData.property = '';
        //    $(this).removeClass('active');
        //}
    });

    //搜索
    $(document).on('click', '.go', function () {
        $('.btn-next').hide();
        searchSchoolListData.offset = 0;
        searchSchoolListData.areaid = '';
        searchSchoolListData.type = '';
        searchSchoolListData.educationLevel = '';
        searchSchoolListData.property = '';
        searchSchoolListData.universityName = $.trim($('#query').val());
        $('#province-ul li').removeClass('active')
        $('#sort-ul li').removeClass('active')
        $('#educationLevel-ul li').removeClass('active')
        $('#property-ul li').removeClass('active')
        $('#search-list-main').html('');
        getSchoolList();
    });


    $("#query").keypress(function (e) {
        if (e.keyCode == 13) {
            e.cancelBubble = true;
            e.returnValue = false;
            $(".go").click();
        }
    })

    //院校信息详情跳转
    $(document).on('click', '.school-logo,.school-name', function () {
        var id = $(this).attr('sid');
        window.location = 'http://' + window.location.host + '/data-school-detail.html?id=' + id + '';
    });

});
