define(['commonjs', '../css/user/user-account-info.css', 'handlebars','noDataTips'], function (util, collectionCss, handlebars,noDataTips) {
    // tab切换
    $('#tab-title').on('click', 'span', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $('.content-list').removeClass('active');
        $('.content-list:eq(' + index + ')').addClass('active');
    });

    /*
     * banner部分数据,表单数据自动录入
     * */
    var cookie = require('cookie');
    $('#banner-info').prepend(require('html!../user-banner.html'));
    var forecastSchool = util.getLinkey(encodeURIComponent('forecastSchool'));
    $('.user-name').text(cookie.getCookieValue('userName'));
    if (cookie.getCookieValue('vipStatus') == 0) {
        $('#btn-vip,#user-type').show();
        $('#vip-box').hide();
    } else {
        $('#btn-vip,#user-type').hide();
        $('#vip-box').show();
    }
    var targetScoreV = util.cookie.getCookieValue('achievement');
    var targetSchoolV = util.cookie.getCookieValue('universityName');
    var subjectType = util.cookie.getCookieValue('subjectType');
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
    var icon = cookie.getCookieValue('icon');
    var imgIco = require('../img/icon_default.png');
    if (icon == 'undefined') {
        icon = imgIco;
    }
    var userName = cookie.getCookieValue('userName');
    var vipStatus = cookie.getCookieValue('vipStatus');
    var vipActiveDate = cookie.getCookieValue('vipActiveDate');
    var vipEndDate = cookie.getCookieValue('vipEndDate');
    if (vipStatus != 0) {
        //是vip
        $('#btn-vip,#user-type,.vip-end').hide();
        $('#vip-box,.vip-end-text').show();
        if(vipActiveDate && vipActiveDate){
            $('#vip-date').text("VIP时效:从"+vipActiveDate.substr(0,10)+"到"+vipEndDate.substr(0,10));
        }
    } else {
        //不是vip
        $('#btn-vip,#user-type,.vip-end').show();
        $('#vip-box,.vip-end-text').hide();
    }

    /*
     * 收藏(院校收藏|课程收藏)
     * type:1（院校）或2（课程）
     * offset:起始条数（选填）
     * rows:查询条数（选填）
     * */
    var rows = 10,
        offset = 0;
    var schoolCollectionData = {
        type: 1,
        rows: rows,
        offset: offset
    };
    getCollectList();
    function getCollectList() {
        util.ajaxFun(util.INTERFACE_URL.getUserCollectList, 'GET', schoolCollectionData, function (res) {
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
                if(res.bizData.sum == 0){
                    $('.data-tips').html(noDataTips('您还未收藏任何院校，快点查看院校信息，确立目标吧!'));
                    return
                }
                var template = handlebars.compile($('#school-collection-tpl').html());
                $('#school-collection').append(template(res.bizData));
                if (res.bizData.sum>rows) {
                    $('#more-school').show();
                }else{
                    $('#more-school').hide();
                }
                if (schoolCollectionData.offset<rows) {
                    $('#more-school').removeClass('hide');
                }else{
                    $('#more-school').addClass('hide');
                }
            } else {
              util.checkLoginTimeout(res);
            }
        });
    }

    $(document).on('click', '#more-school', function () {
        schoolCollectionData.offset += schoolCollectionData.rows;
        getCollectList();
    });


    //取院校收藏
    $(document).on('click', '.cancel-collection', function () {
        var _this = $(this);
        var projectIdClassId = _this.attr('cancel-id');
        util.ajaxFun(util.INTERFACE_URL.deleteUserCollect, 'GET', {
            type: '1',
            projectId: projectIdClassId
        }, function (res) {
            if (res.rtnCode == '0000000') {
                //删除动画
                _this.parent().css({
                    left: '1000px'
                });
                setTimeout(function () {
                    _this.parent().remove();
                }, 2000);
            } else {
              util.checkLoginTimeout(res);
            }
        });
    });

});
