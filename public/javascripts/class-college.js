define(['commonjs', 'handlebars'], function (util, handlebars) {
    require('../css/class/class-college.css');

    $(function () {
//获取推荐学习列表
        util.ajaxFun(util.INTERFACE_URL.getVolunteerForumList, 'get', {
            'isIgnore': '',
            'page': '1',
            'rows': '4',
            'type': '3'
        }, function (res) {
            if (res.rtnCode == '0000000') {
                var template = handlebars.compile($("#list-recommend-list").html());
                var list = res.bizData;
                var html = template(list);
                $('.list-recommend-list').html(html);
            } else {
              util.checkLoginTimeout(res);
            }
        });
//志愿讲堂
        var volunteerPage = 1,
            volunteerRows = 6;
        var volunteerForumParam = {
            'isIgnore': '',
            'page': volunteerPage,
            'rows': volunteerRows,
            'type': '3'
        };
        getVolunteerForumList();
        function getVolunteerForumList() {
            util.ajaxFun(util.INTERFACE_URL.getVolunteerForumList, 'get', volunteerForumParam, function (res) {
                if (res.rtnCode == '0000000') {
                    var template = handlebars.compile($("#volunteer-forum-list").html());
                    var list = res.bizData;
                    var html = template(list);
                    $('.volunteer-forum-list').html(html);
                } else {
                  util.checkLoginTimeout(res);
                }
            });
        }

        $(document).on('click', '#Volunteer-page li', function () {
            volunteerForumParam.page = $(this).text();
            $(this).addClass('active').siblings().removeClass('active');
            getVolunteerForumList();
        });


//心理学堂
//        util.ajaxFun(util.INTERFACE_URL.getMentalityList, 'get', {}, function (res) {
//            if (res.rtnCode == '0000000') {
//                var template = handlebars.compile($("#mentality-list").html());
//                var list = res.bizData;
//                var html = template(list);
//                $('.mentality-list').html(html);
//            }
//        });

//高考学堂
//        util.ajaxFun(util.INTERFACE_URL.getMentalityList, 'get', {}, function (res) {
//            if (res.rtnCode == '0000000') {
//                var template = handlebars.compile($("#teacher-lecture-list").html());
//                var list = res.bizData;
//                var html = template(list);
//                $('.teacher-lecture-list').html(html);
//            }
//        });


//顶级名师团mock
        var frontCover1 = require("../img/avatar-mock-1.jpg");
        var frontCover2 = require("../img/avatar-mock-2.jpg");
        var frontCover3 = require("../img/avatar-mock-3.jpg");
        var frontCover4 = require("../img/avatar-mock-4.jpg");

        var topTeachTeamList = {
            "rows": [
                {
                    "topTeachTeam": {
                        "frontCover": frontCover1,
                        "id": 29,
                        "from": "高级职业指导师",
                        "teacher": "黄李昌",
                        "aboutTitle": "电子科技大学计算机学院工学学士"
                    },
                    "id": 29
                },
                {
                    "topTeachTeam": {
                        "frontCover": frontCover2,
                        "id": 29,
                        "from": "教育部阳光高考网站特聘专家",
                        "teacher": "吕迎春",
                        "aboutTitle": "杂志的专栏作家"
                    },
                    "id": 29
                },
                {
                    "topTeachTeam": {
                        "frontCover": frontCover3,
                        "id": 29,
                        "from": "北京清大师德教育研究院执行院长",
                        "teacher": "王明祥",
                        "aboutTitle": "清华大学工商管理硕士"
                    },
                    "id": 29
                },
                {
                    "topTeachTeam": {
                        "frontCover": frontCover4,
                        "id": 29,
                        "from": "北京智高考·志愿填报研究中心",
                        "teacher": "陈晟",
                        "aboutTitle": "高考志愿咨询师、高级职业规划师"
                    },
                    "id": 29
                }
            ]
        };

        if (util.isLogin() == 'true') {
            $('.login-txt').hide();
        }


        console.info(util.isLogin());


//顶级名师团
        var teachTeamTemplate = handlebars.compile($("#top-teach-team-list").html());
        var list = topTeachTeamList;
        var html = teachTeamTemplate(list);
        $('.top-teach-team-list').html(html);
        console.info(topTeachTeamList);
    });
});
