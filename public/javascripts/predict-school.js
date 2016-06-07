define(['commonjs', 'tips', 'handlebars', 'cookie'], function (util, tips, handlebars, cookie) {

    require('../css/volunteer/volunteer-prediction-common.css');
    var achievement = util.cookie.getCookieValue('achievement');
    var subjectType = util.cookie.getCookieValue('subjectType');

    var volunteerBanner = require('../img/volunteer-banner.jpg');
    var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
    $('.volunteer-banner').html(volunteerBannerImg);


    function sortByKey(array, key)
    {
        return array.sort(function(a, b){
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }



    $(function () {
        if (achievement == 'undefined') {
            achievement = '';
        }
        $('#score').val(achievement);
        $('.radio-subject[value="' + subjectType + '"]').attr('checked', 'checked');
        $('#predict-school-btn').on('click', function () {
            if (!cookie.getCookieValue('isLogin')) {
                tips('#tips', '请先登录后再操作');
                return false;
            }
            var subjectV = $('.radio-subject[name="subject"]:checked').val(),
                scoreV = $.trim($('#score').val());
            if (subjectV == "" || subjectV == undefined) {
                tips('#tips', '请选择科目');
                return false;
            }

            //非vip
            var vipStatus = cookie.getCookieValue('vipStatus');
            if (vipStatus == 0) {
                tips('#tips', '您还不是vip,请升级vip后使用');
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
            util.ajaxFun(util.INTERFACE_URL.getPredictSchoolList, 'POST', {
                'type': subjectV,
                'score': scoreV
            }, function (res) {
                util.checkLoginTimeout(res);
                if (res.rtnCode === "0000000") {

                    handlebars.registerHelper('propertyList', function (data) {
                        var propertyListTpl = '';
                        switch (data) {
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
                        console.info(data);
                        return propertyListTpl;
                    });

                    //对象判空
                    function isEmptyObject(obj) {
                        for (var name in obj) {
                            return false;
                        }
                        return true;
                    }

                    if (isEmptyObject(res.bizData)) {
                        $('#content-b .no-data-tips').html('(ﾟ∀ﾟ) 真抱歉,暂时没有合适的院校推荐给您').show();
                    } else {
                        $('#content-b .no-data-tips').hide();
                    }

                    $('#content-a').hide();
                    $('#content-b').show();
                    var template = handlebars.compile($("#temp-content").html());
                    handlebars.registerHelper('stars', function (val) {
                        var star = '';
                        for (var i = 0; i < val; i++) {
                            star += '<i class="icon-star-y"></i>';
                        }
                        return star;
                    });
                    $('#content-b').html(template(res.bizData));
                    $('#score-data').text(scoreV);
                    subjectV == '1' ? $('#type-subject').text('文史') : $('#type-subject').text('理工');
                    var num = 0;
                    for (var k in res.bizData) {
                        num += res.bizData[k].count;
                    }

                    $('#total-num').text(num);

                    var content = $("#predictSchoolList");
                    var template = $("#predictSchoolTemplate").clone();

                    content.empty();
                    template = template.clone().attr("id", "school_data").show();

                    var htmllist='';
                    for(var i in res.bizData)
                    {
                        for(var j=0;j<res.bizData[i].list.length;j++)
                        {
                            var item = template.clone();
                            htmllist = res.bizData[i].star +"===" +  res.bizData[i].list[j].universityName  + htmllist;

                            var features = res.bizData[i].list[j].feature.split(",");
                            if(features.length == 1 && features[0].indexOf('，') != -1)
                            {
                                features = res.bizData[i].list[j].feature.split("，");
                            }
                            var universityId = res.bizData[i].list[j].universityId;
                            var universityName = res.bizData[i].list[j].universityName;
                            var rank = res.bizData[i].list[j].rank;
                            var batch = res.bizData[i].list[j].batch;
                            var star = res.bizData[i].star;

                            item.find(".school-info p a").attr("href", "/data-school-detail.html?id=" + universityId);
                            item.find(".school-info p a").html(universityName);
                            if(rank)
                            {
                                item.find("td").eq(1).html(rank);
                            }
                            else
                            {
                                item.find("td").eq(1).html("-");
                            }
                            item.find("td").eq(2).attr("batch-level", batch);
                            item.find("td").eq(3).attr("star-level", star);
                            (function(starLength){
                                var star = '';
                                for (var i = 0; i < starLength; i++) {
                                    star += '<i class="icon-star-y"></i>';
                                }
                                item.find("td").eq(3).html(star);
                            })(star);

                            (function(features){
                                var propertyListTpl = '';
                                for(var k = 0; k < features.length; k++)
                                {
                                    switch (features[k])
                                    {
                                        case '985高校':
                                            propertyListTpl += '<span class="type-985">985</span>';
                                            break;
                                        case '211工程':
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
                                }
                                item.find("#property").append(propertyListTpl);
                            })(features);

                            item.find("td").eq(4).children("button").attr("schoolName", universityName);

                            item.prependTo(content);

                        }
                    }

                    for(var i = 0; i < $(".batch-level").length; i++)
                    {
                        var level = parseInt($(".batch-level").eq(i).attr("batch-level"));
                        switch(level)
                        {
                            case 1:
                                $(".batch-level").eq(i).html("一批本科");
                                break;
                            case 2:
                                $(".batch-level").eq(i).html("二批本科");
                                break;
                            case 4:
                                $(".batch-level").eq(i).html("三批本科");
                                break;
                            case 8:
                                $(".batch-level").eq(i).html("高职（专科）");
                                break;
                        }
                    }

                } else {
                    tips('#tips', res.msg);
                }
            });
        });

        $('#content-b').on('click', '#prev-btn', function () {
            $('#content-a').show();
            $('#content-b').hide();
        })

        // 设为目标
        $('#content-b').on('click', '.objective-btn', function () {
            var schoolname = $(this).attr('schoolname');
            util.cookie.setCookie("subjectType", subjectType, 4, "");
            util.cookie.setCookie("targetScore", achievement, 4, "");
            util.cookie.setCookie("targetSchool", schoolname, 4, "");
            window.location.assign('http://' + window.location.host + '/user-target.html');
        });


    });
})