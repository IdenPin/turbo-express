define(['commonCss', 'jquery', 'loginTimeoutWindow'], function () {
    var host = window.location.host;
    var y = host.substring(0, host.length - 13);
    var local = y.indexOf('local');
    var dev = y.indexOf('dev');
    var test = y.indexOf('test');
    var pre = y.indexOf('pre');
    var pro = y.indexOf('pro');
    var devzntb = y.indexOf('devzntb');//智能填报测试使用

    var domainStr = '';
    if (local > -1) {
        domainStr = 'local.zhigaokao.cn:3005';
    } else if (devzntb > -1) {
        domainStr = 'devzntb.zhigaokao.cn'; //智能填报测试使用
    } else if (dev > -1) {
        domainStr = 'dev.zhigaokao.cn';
    } else if (test > -1) {
        domainStr = 'test.zhigaokao.cn';
    } else if (pre > -1) {
        domainStr = 'pre.zhigaokao.cn';
    } else {
        domainStr = 'zhigaokao.cn';
    }


    //浏览器判断 开始=============================
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : 0;
    var vesion = parseInt(Sys.ie);
    if (Sys.ie && vesion <= 8) {
        window.location.href = '/terrible-broswer.html';
    }
    //公共头尾=============================
    $('head').prepend(require('html!../../meta.html'));
    var noHeaderFooterUrl = window.location.pathname;
    if (noHeaderFooterUrl != '/login.html') {
        $('body')
            .prepend(require('html!../../header.html'))
            .append(require('html!../../footer.html'));
    }
    //获取域名前缀=============================
    var urlDomain = window.location.hostname + '';
    var urlArr = urlDomain.split('.');
    var provinceKey = urlArr[0];


    if (provinceKey == "www" || provinceKey == 'undefined') {
        window.location.assign('http://zj.zhigaokao.cn');
    }
    $('#current-province').text($('#select-province li a[href="http://' + provinceKey + '.zhigaokao.cn/"]').text());
    //$('#current-province').text($('#select-province li a[href="http://' + provinceKey + '.test.zhigaokao.cn/"]').text())


    //判断是否登录=============================
    var cookie = require('cookie');
    var loginUserKey = cookie.getCookieValue('userKey');
    if (cookie.getCookieValue('isLogin') == 'true') {
        $('#login-front').hide();
        $('#login-end').show();
        $('.current-province').addClass('isLogin');

        if (provinceKey != loginUserKey) {
            window.location.assign('http://' + $.trim(loginUserKey) + '.zhigaokao.cn/index.html');
        }
    } else {
        $('#login-front').show();
        $('#login-end').hide();
        filterUrl();
        $('.current-province').removeClass('isLogin');
        $('.select-province').on('click', 'a', function () {
            $('#current-province').text($(this).text());
        });
    }
    $('.overseas-study').hover(function () {
        $('#overseas-study-img').removeClass('icon-earth-0').addClass('icon-earth-1');
    }, function () {
        $('#overseas-study-img').removeClass('icon-earth-1').addClass('icon-earth-0');
    });


    //获取登录用户信息=============================

    $('body').on('click', '#logout-btn', function () {
        cookie.deleteCookie('isLogin', '');
        cookie.deleteCookie('token', '');
        cookie.deleteCookie('icon', '');
        cookie.deleteCookie('phone', '');
        cookie.deleteCookie('subjectType', '');
        cookie.deleteCookie('userKey', '');
        cookie.deleteCookie('userName', '');
        cookie.deleteCookie('vipStatus', '');
        cookie.deleteCookie('SC', '');
        window.location.assign('http://' + window.location.host + '/index.html')
    });
    //地址过滤=============================
    var paths = window.location.pathname.split('/');
    var pagePath = paths[paths.length - 1];
    switch (pagePath) {
        case 'index.html':
            $('#nav-index').addClass('active');
            break;
        case 'news-hot.html':
        case 'news-detail.html':
        case 'news-policy.html':
        case 'news-schedule.html':
        case 'news-online-interactive.html':
        case 'data-gk-word.html':
            $('#nav-news-hot').addClass('active');
            break;
        case 'data-school-info.html':
        case 'data-professional-info.html':
        case 'data-school-enrollment.html':
        case 'data-occupational-info.html':
        case 'data-occupational-detail.html':
        case 'data-school-detail.html':
        case 'data-professional-detail.html':
        case 'data-area-scores.html':
        case 'news-admissions-office-phone.html':
            $('#nav-data-school-info').addClass('active');
            break;
        case 'class-college.html':
        case 'class-college-detail.html':
            $('#nav-class-college').addClass('active');
            break;
        case 'predict-degree.html':
        case 'predict-school.html':
        case 'predict-professional.html':
        case 'predict-result.html':
        case 'predict-volunteer.html':
        case 'predict-selSchool-tpl0.html':
        case 'predict-selSchool-tpl1.html':
        case 'predict-selSchool-tpl2.html':
        case 'predict-selSchool-tpl3.html':
        case 'predict-result-tpl0.html':
        case 'predict-result-tpl1.html':
        case 'predict-result-tpl2.html':
        case 'predict-result-tpl3.html':
        case 'predict-result-tpl4.html':

            $('#nav-predict-degree').addClass('active');
            break;
        default:
            break;
    }

    function filterUrl() {
        var pathName = window.location.pathname.split('/');
        var pageName = pathName[pathName.length - 1];
        switch (pageName) {
            case 'index.html':
                $('#nav-index').addClass('active');
                break;
            case 'user-account-info.html':
            case 'user-vip.html':
            case 'user-collection.html':
            case 'user-order.html':
            //case 'user-target.html':
            case 'user-answer':
            case 'user-service.html':
            case 'user-report.html':
            //case 'predict-degree.html':
            case 'class-college-detail.html':
            //case 'predict-volunteer.html':
                window.location.assign('http://' + window.location.host + '/login.html')
                break;
            default:
                break;
        }
    }

    var isLogin = function () {
        return cookie.getCookieValue('isLogin')
    };

    var INTERFACE_URL = require('urlConfig');
    //ajax拉取数据 IE8 跨域
    function ajaxFun(url, method, reqData, callback, callbackError) {
        var data = {};
        if (cookie.getCookieValue('token')) {
            data.token = cookie.getCookieValue('token');
        }
        data.userKey = provinceKey;
        data.req = "ajax";
        for( var index in reqData ) {
          data[index] = reqData[index];
        }
        var strParameter = '';
        for (var i in data) {
            strParameter += "&" + i + "=" + data[i];
        }
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : 0;
        var vesion = parseInt(Sys.ie);

        if (Sys.ie && vesion >= 8 && vesion < 10) {
            $.ajax({
                url: url,
                type: method,
                data: data || {},
                dataType: "jsonp",
                jsonp: "callback",
                success: callback,
                error: callback
            });
        } else {
            $.ajax({
                url: url,
                type: method,
                data: data || {},
                success: function (res, textStatus, XMLHttpRequest) {
                    callback(res);
                },
                error: function (res) {
                    if (callbackError && typeof(callbackError) === "function") {
                        callbackError(res);
                    }
                }
            });
        }
    };

    //cubic add // Check User Status, show a relogin alert when login is timeout.
    function checkLoginTimeout(returnJson) {
        if (returnJson.rtnCode == '1000004') {
            if (cookie.getCookieValue('isLogin')) {
              $('#loginTimeoutWindow').modal('show');
            } else {
              $('#loginTimeoutWindow').modal('show');
              $('#loginTimeoutWindow-jump-btn').html('登录');
              $('.loginTimeoutWindow-body').attr('class', 'modal-body nologinWindow-body');
            }
        }
    }

    var getLinkey = function getLinkey(name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(window.location.href)) return unescape(RegExp.$2.replace(/\+/g, " "));
        return "";
    };
    ajaxFun(INTERFACE_URL.getUserInfo, 'GET', {}, function (res) {
        if (res.rtnCode == '0000000') {
            var personListData = res.bizData;
            var avatar = '';
            var imgIco = require('../../img/icon_default.png');
            if (personListData.icon == '' || personListData.icon == null) {
                avatar = imgIco;
            } else {
                avatar = personListData.icon
            }
            var subjectType = res.bizData.typeId;
            var universityName = res.bizData.universityName;
            var achievement = res.bizData.achievement;
            var forecaset = res.bizData.forecaset;
            cookie.setCookie("subjectType", subjectType, 4, "");
            cookie.setCookie("universityName", universityName, 4, "");
            cookie.setCookie("achievement", achievement, 4, "");
            cookie.setCookie("forecaset", forecaset, 4, "");
            $('#header-user-name').text(personListData.name);
            $('#avatar-img,.user-avatar').attr('src', avatar);
            $('#user-name').val(personListData.name);
            window.localStorage.icon = avatar;
        }
    });

    $(function(){
        // 导航首页
        $('body').on('click','#nav-index',function(){
            sa.track('index_visit');
        });
        // 导航高考热点
        $('body').on('click','#nav-news-hot,#news-hot',function(){
            sa.track('nav_news_hot');
        });
        // 导航高考政策
        $('body').on('click','#news-policy',function(){
            sa.track('news_policy');
        });
        // 导航高考日程
        $('body').on('click','#news-schedule',function(){
            sa.track('news_schedule');
        });
        // 导航高考词条
        $('body').on('click','#data-gk-word',function(){
            sa.track('data_gk_word');
        });
        // 导航院校信息
        $('body').on('click','#nav-data-school-info,#data-school-info',function(){
            sa.track('nav_data_school_info');
        });
        // 导航专业信息
        $('body').on('click','#data-professional-info',function(){
            sa.track('data_professional_info');
        });
        // 导航职业信息
        $('body').on('click','#data-occupational-info',function(){
            sa.track('data_occupational_info');
        });
        // 导航地区批次线
        $('body').on('click','#data-area-scores',function(){
            sa.track('data_area_scores');
        });
        // 智留学链接
        $('body').on('click','#zhiliuxue',function(){
            sa.track('zhiliuxue');
        });
        // 导航志愿讲堂
        $('body').on('click','#nav-class-college,#class-college',function(){
            sa.track('class-college');
        });
        // 导航智学堂
        $('body').on('click','#zhixuetang',function(){
            sa.track('zhixuetang');
        });
        // 导航录取难以预测
        $('body').on('click','#nav-predict-degree,#predict-degree',function(){
            sa.track('nav_predict_degree');
        });
        // 导航院校预测
        $('body').on('click','#predict-school',function(){
            sa.track('predict_school')
        });
        // 导航专业测评
        $('body').on('click','#predict-professional',function(){
            sa.track('predict_professional')
        });
        // 导航智能填报
        $('body').on('click','#volunteer-links',function(){
            sa.track('volunteer_links')
        });
        // 导航购买VIP
        $('body').on('click','#school-video-buy',function(){
            sa.track('school_video_buy')
        });
        // 录取难以预测提交
        $('body').on('click','#predict-degree-btn',function(){
            sa.track('predict_degree_btn');
        });
        // 院校预测提交
        $('body').on('click','#predict-school-btn',function(){
            sa.track('predict_school_btn');
        });
        // 高中文理分科测评提交
        $('body').on('click','.star-evaluate[ctype="1"]',function(){
            sa.track('star_evaluate1');
        });
        // 理科生专业选择测评提交
        $('body').on('click','.star-evaluate[ctype="2"]',function(){
            sa.track('star_evaluate2');
        });
        // 文科生专业选择测评提交
        $('body').on('click','.star-evaluate[ctype="3"]',function(){
            sa.track('star_evaluate3');
        });
        // 霍兰德职业兴趣测试提交
        $('body').on('click','.star-evaluate[ctype="4"]',function(){
            sa.track('star_evaluate4');
        });
        // 金榜登科购买提交
        $('body').on('click','#btn-submit-10000001',function(){
            sa.track('btn_submit_10000001');
        });
        // 状元及第购买提交
        $('body').on('click','#btn-submit-10000002',function(){
            sa.track('btn_submit_10000002');
        });
        // 目标定位提交
        $('body').on('click','#predict-btn',function(){
            sa.track('predict_btn');
        });
    });









    /*
     已开通智能填报模块
     省份:广西,河北,河南,湖南,湖北
     */
    var arr = [
        'gx', 'he', 'ha', 'hn', 'hb', 'sd', 'sn', 'gz', 'js', 'fj', 'gd', 'jx',
        'sc', 'cq', 'ah', 'yn', 'gs'
        , 'xj', 'nx', 'bj', 'hi', 'sx'
        , 'jl', 'hl', 'tj', 'ln', 'zj'
        , 'sh'
    ];
    if ($.inArray(provinceKey, arr) < 0) {
        $('.volunteer-links').remove();
        $('.sidebar').find('a[href="/predict-volunteer.html"]').parent().remove();
    }
    return {
        isLogin: isLogin, //判断是否登录成功
        ajaxFun: ajaxFun,//数据拉取
        getLinkey: getLinkey,//url获取参数
        INTERFACE_URL: INTERFACE_URL,
        cookie: cookie,
        domain: domainStr,
        provinceKey: provinceKey,
        checkLoginTimeout: checkLoginTimeout
    };
});







