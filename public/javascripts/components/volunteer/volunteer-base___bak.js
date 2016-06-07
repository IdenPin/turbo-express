/**
 * 智能填报 Base   所有省份 继承此Base 。
 *
 * 差异化需求只需重写Base 下对应功能函数即可~
 *
 * 2016-04-08  douzy
 */

var util = require('commonjs');
var tips = require('tips');
var dialog = require('dialog');
var handleBars = require('handlebars');
var crossSite = require("cross-site");

var volunteerBanner = require('../../../img/volunteer-banner.jpg');
var volunteerBannerImg = '<img src="' + volunteerBanner + '" />';
$('.volunteer-banner').html(volunteerBannerImg);

var score = util.cookie.getCookieValue('volunteerScore'),
    cate = util.cookie.getCookieValue('volunteerCate'),
    province = util.cookie.getCookieValue('userKey'),
    batch = util.cookie.getCookieValue('volunteerBatch'),
    precedence = util.cookie.getCookieValue('rankingV');

function volunteerBase() {
    this.volunteerNum = 6;
    this.universityArr = [];//院校优先
    this.majorArr = [];//专业优先
    this.checkUniversityArr = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]];    //记录已选院校的 二维数组  依据它来实现置灰
    this.outPutArr = [];
    this.volunteerArr = [["A", "B"], ["C", "D"], ["E", "F"]];//
    this.seqArr = ["冲", "稳", "保", "垫"];
    this.$tempHeader = $("#temp-volunteer-header");
    this.$tempBody = $("#temp-volunteer-body");
    this.$volunteerBox = $("#volunteerBox");
    //this.$maxSchoolBtn=$(".sel-school-btn")//选择院校   大按钮
    this.$tempVolunteerDialog = $("#temp-volunteer-dialog");
    this.$tempVolunteerUniversity = $("#temp-volunteer-university");
    this.$tempVolunteerUniversityBak = $("#temp-volunteer-universityBak");
    this.$tempVolunteerUniversityCheck = $("#temp-volunteer-university-check");
    this.$tempVolunteerUniversitySpecialty = $("#temp-volunteer-university-specialty");
    this.$tempVolunteerUniversitySpecialty2 = $("#temp-volunteer-university-specialty2");
    this.$tempVolunteerSpecialtyDialog = $("#temp-volunteer-specialty-dialog");
    this.$tempVolunteerAjaxSpecialty = $("#temp-volunteer-ajax-specialty");
    this.$tempVolunteerSpecialtyBox = $("#temp-volunteer-specialty-box");
    this.cacheKey = "universityCache";
    this.partTag = "gx" ;//广西--部分服从标示
    this.specialtyNumber = 6; //默认专业个数
    this.year = 2015; //年份   暂写
    this.$volunteerTable = $(".volunteer-table");
    this.Flag = true; //获取专业信息  ajax 标识
    this.FlagResult = true;//保存报告  ajax 标识
    this.reportBox = [];
    this.reportUniversityView = [];
    this.x = 0;
    this.isFirst = 1;
    this.version = 2;  //API版本号
    this.resultRedirectUrl = "";
    this.firstFlagObj = {
        universityFirstFlag: 1, //院校优先
        majorFirstFlag: 0 //专业优先
    };
    this.precedenceObj = {  //屏蔽优先选项的最大值 和最小值
        min: 100,
        max: 8000
    };
}

volunteerBase.prototype.init = function () {
    var self = this;
    self.getInfoData();
    self.loadVolunteerHTML();
    self.saveReport();

};
/**
 * 初始化清单数据
 * 院校优先|专业优先
 *          if(universityList == ''){
                alert('专业优先没有数据');
                $('#volunteerSchoolList').html('专业优先没有数据');
            }
 */
volunteerBase.prototype.getInfoData = function () {
    var self = this;
    self.getUniversityName();
    self.getMajorFirstData();
};

/**
 * 获取院校清单列表
 */

volunteerBase.prototype.getUniversityName = function () {
    var self = this;
    util.ajaxFun(util.INTERFACE_URL.getVolunteerSchool, 'GET', {
        "score": score,
        "batch": batch,
        "province": province,
        "categorie": cate,
        "precedence": precedence,
        "first": self.firstFlagObj.universityFirstFlag,
        "req": "ajax",
        "version": self.version
    }, function (res) {
        if (res) {
            $('.loading-box').html('');
            $('.sel-school-btn').removeAttr('disabled');
        }
        if (res.rtnCode == '1000004') {
            tips('#tips', res.msg);
            window.location.href = '/login.html';
        }
        if (res.rtnCode == '0000000') {
            var universityList = res.bizData;
            for (var i = 0; i < universityList.length; i++) {
                self.universityArr.push(universityList[i]);
            }
            self.outPutArr = self.universityArr;
        }
    });
};
/**
 * 优先项 选择
 */
volunteerBase.prototype.checkFirstBind = function (t) {
    var self = this;
    $(".checkFirst" + t).click(function () {
        var $checkObj = $(this);
        var first = parseInt($checkObj.attr("data-f"));
        if (first === self.firstFlagObj.universityFirstFlag) {
            self.outputArr = self.universityArr.slice();
            self.isFirst = 1;
        } else {
            self.outputArr = self.majorArr.slice();
            self.isFirst = 0;
        }
        $checkObj.siblings("span").removeClass("active");
        $checkObj.addClass("active");
        self.divideUniversity(self.outputArr, t);
        self.fillUniversity();
        self.checkUniversity(self.outputArr, t);
    });
};
/**
 * 专业优先 数据
 */
volunteerBase.prototype.getMajorFirstData = function () {
    var self = this;
    util.ajaxFun(util.INTERFACE_URL.getVolunteerSchool, 'GET', {
        "score": score,
        "batch": batch,
        "province": province,
        "categorie": cate,
        "precedence": precedence,
        "first": self.firstFlagObj.majorFirstFlag,
        "req": "ajax",
        "version": self.version
    }, function (res) {
        if (res.rtnCode == '1000004') {
            tips('#tips', res.msg);
            window.location.href = '/login.html';
        }
        if (res.rtnCode == '0000000') {
            var universityList = res.bizData;
            for (var i = 0; i < universityList.length; i++) {
                self.majorArr.push(universityList[i]);
            }
        }
    });
};
/**
 * 获取通用志愿TABLE HTML
 */
volunteerBase.prototype.getVolunteerTable = function () {
    return "<table class='volunteer-table'>"
        + "<thead>"
        + "{0}"
        + "</thead>"
        + " <tbody>"
        + "{1}"
        + "</tbody>"
        + "</table>";
};
/**
 * 初始化ABCDEF.....志愿HTML
 */
volunteerBase.prototype.loadVolunteerHTML = function () {
    var self = this;
    self.$volunteerBox.html("");
    for (var i = 0; i < self.volunteerArr.length; i++) {
        var tempHeader = handleBars.compile(self.$tempHeader.html());
        var headerHTML = tempHeader(self.volunteerArr[i]);  //HEADER
        var tempBody = handleBars.compile(self.$tempBody.html());
        var bodyHTML = tempBody(self.volunteerArr[i]); //BODY
        self.$volunteerBox.append(self.stringFormat(self.getVolunteerTable(), headerHTML, bodyHTML));
        //loading
        var loadingImg = require('../../../img/loading.gif');
        $('.loading-img').attr('src', loadingImg);

        //loading
        //$(document).ajaxComplete(function () {
        //    $('.loading-box').html('');
        //    $('.sel-school-btn').removeAttr('disabled');
        //});
    }
    self.maxSchoolBtnEvent();
};
/**
 * 选择院校按钮事件
 */
volunteerBase.prototype.maxSchoolBtnEvent = function () {
    var self = this;
    $(".sel-school-btn").click(function () {

        var type = $(this).attr("datatypet");
        self.divideUniversity(self.outPutArr, type);

        var tempDialog = handleBars.compile(self.$tempVolunteerDialog.html());
        var headerHTML = tempDialog({t: type});
        dialog('志愿指导', headerHTML);
        self.checkFirstBind(type);
        self.fillUniversity(); //填充弹层 --- 院校清单

        self.checkUniversity(self.outPutArr, type);// 选择院校
        self.disableFirstBtn();
    })
};

/**
 * 冲稳保垫转换
 */
volunteerBase.prototype.converSeq = function (seq) {
    //var self = this;
    //return self.seqArr[parseInt(seq)];
    var seq = seq + '',
        str = '';
    switch (seq) {
        case '0':
            str = '<div class="volun volun-chong">冲</div>';
            break;
        case '1':
            str = '<div class="volun volun-wen">稳</div>';
            break;
        case '2':
            str = '<div class="volun volun-bao">保</div>';
            break;
        case '3':
            str = '<div class="volun volun-dian">垫</div>';
            break;
    }
    return str;
};
/**
 * 院校梯度划分
 */
//volunteer.prototype.divideUniversity = function () {
//    var self = this;
//    var $volunteerTag = $(".volunteerTag")
//    $.each($volunteerTag, function (i) {
//        var dataTypeT = $(this).attr("datatypet");
//        for (var university in self.universityArr) {
//            var universityObj = self.universityArr[university];
//            if (!!universityObj) {
//                if (parseInt(universityObj.sequence) === parseInt(i + 1)) {
//                    var universityTmp = handleBars.compile(self.$tempVolunteerUniversityBak.html());
//                    handleBars.registerHelper("toPercent", function (value) {
//                        return toPercent(value);
//                    });
//                    var universityrHTML = universityTmp({t: dataTypeT, index: university, university: universityObj});
//                    $("#" + self.cacheKey + dataTypeT).append(universityrHTML);
//                }
//            }
//        }
//    });
//}

volunteerBase.prototype.getMaxIndex = function (str) {
    var index = null;
    switch (str) {
        case "A":
            index = 0;
            break;
        case "B":
            index = 1;
            break;
        case "C":
            index = 2;
            break;
        case "D":
            index = 3;
            break;
        case "E":
            index = 4;
            break;
        case "F":
            index = 5;
            break;
    }
    return index;
}
/**
 *   <100 >8000 不显示院校优先or 专业优先
 */
volunteerBase.prototype.disableFirstBtn = function () {
    var self = this;
    var scorePlusValue = parseInt(util.cookie.getCookieValue("SCORE_PLUS_VALUE"));
    var volunteerScore = parseInt(util.cookie.getCookieValue("volunteerScore"));
    var provinConLine = parseInt(util.cookie.getCookieValue("PROVIN_CONLINE"));

    var $checkFirstBtn = $(".tab-alert-toggle");

    if (!!scorePlusValue && !!volunteerScore && !!provinConLine) {

        if (volunteerScore >= provinConLine &&
            volunteerScore <= (provinConLine + scorePlusValue)) {         //压线生
            $checkFirstBtn.hide();
            return false;
        }

    }
    if (precedence <= self.precedenceObj.min || precedence > self.precedenceObj.max)
        $checkFirstBtn.hide();
    else
        $checkFirstBtn.show();

}
/**
 * 院校清单缓存
 * @param objArr
 * @param type
 */
volunteerBase.prototype.divideUniversity = function (objArr, type) {
    var self = this;
    var outArr = objArr;
    var universityTmp = handleBars.compile(self.$tempVolunteerUniversityBak.html());
    handleBars.registerHelper("toPercent", function (value) {
        return value.toFixed(2);
    });
    handleBars.registerHelper("converSeq", function (seq) {
        return self.converSeq(seq);
    });
    handleBars.registerHelper("converCheck", function (chk) {
        return (!!chk ? "no-choose" : "choose school-result-btn" + type);
    });
    $("#" + self.cacheKey).html("");

    var c = self.isCheck(type);
    for (var i = 0; i < outArr.length; i++) {
        var universityrHTML = universityTmp({
            t: type,
            index: i,
            check: ($.inArray(i, c) < 0 ? false : true),
            university: outArr[i]
        });
        $("#" + self.cacheKey).append(universityrHTML);
    }
}
/**
 * 判断当前院校是否已经被选中
 */
volunteerBase.prototype.isCheck = function (t) {
    var self = this;
    var index = self.getMaxIndex(t);
    var chArr = new Array();
    for (var i = 0; i < self.checkUniversityArr.length; i++) {
        var t = self.checkUniversityArr[i][self.isFirst];
        if (t > -1)
            chArr.push(t);
    }
    return chArr;
}
/**
 * 选择院校， 记录选中值
 * index 记录第几志愿
 */
volunteerBase.prototype.checkUniversityData = function (i, t) {
    var self = this;

    var index = self.getMaxIndex(t);

    self.checkUniversityArr[index][self.isFirst] = parseInt(i);
    if (self.isFirst == 0)
        self.checkUniversityArr[index][self.firstFlagObj.universityFirstFlag] = -1;
    else
        self.checkUniversityArr[index][self.firstFlagObj.majorFirstFlag] = -1;
    return false;
}
/**
 * 选择院校
 */
volunteerBase.prototype.checkUniversity = function (univerObj, type) {
    var self = this;
    $(".school-result-btn" + type).click(function (event) {

        var $obj = $(this);
        var t = $obj.attr("data-type"),
            index = $obj.attr("data-index");
        var $university = univerObj[index];

        if (!!$university) {
            var checkUniversityTmp = handleBars.compile(self.$tempVolunteerUniversityCheck.html());
            handleBars.registerHelper("valid", function (value) {
                return !!value ? value : "无";
            });
            handleBars.registerHelper("toPercent", function (value) {
                return value.toFixed(2);
            });
            var checkUniverHTML = checkUniversityTmp($university);


            checkOperation(t);

            //$(this).removeClass("choose").addClass("no-choose");

            var $schoolInfo = $("#schoolInfo" + t);
            $schoolInfo.html(checkUniverHTML).show();

            var $part = $('#part' + t + 'CheckedLabel');
            if ($university.code == self.partTag) {
                $part.show();
                $('.txtRadio[data-type="' + t + '"]').find('input[name="isFun' + t + '"]').on('click', function () {
                    if ($(this).hasClass('partChecked')) {
                        $('#specialtyPart' + t).removeClass('hide').show();
                        $('#area-tips' + t).hide();
                    } else {
                        $('#specialtyPart' + t).hide();
                        $('#area-tips' + t).show();
                    }
                })
            } else {
                $part.hide();
            }
            self.showSpecialtyItem($university, t);//输出专业项
            self.getSpecialty($university.universityId, t);//获取专业信息
            self.specialtyClick(t);
            self.checkUniversityData(index, t);
            //self.specialtyCheckResult(t);
        }
        event.stopPropagation();
    });

    var checkOperation = function (t) {
        $('#dialogModal,.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        $('#sel-specialty-list-tips' + t).hide();
        $('#sel-school-btn' + t).show();
    }
};
/**
 * 隐藏弹窗
 */

$(document).on('click', '.sel-school-btn', function () {
    $('body').css('padding', 0);
});
volunteerBase.prototype.hideDiaLogModal = function () {
    $('#dialogModal,.modal-backdrop').remove();
    $('body').removeClass('modal-open');
};
/**
 * 输出专业项
 */
volunteerBase.prototype.showSpecialtyItem = function (university, type) {
    var self = this;
    var handleArr = new Array();
    for (var i = 0; i < self.specialtyNumber; i++) {
        handleArr.push({
            x: parseInt(i + 1),
            t: type,
            sequence: university.sequence,
            majorType: cate,
            universityId: university.universityId
        })
    }

    var loadSpecialtyTmp = handleBars.compile(self.$tempVolunteerUniversitySpecialty.html());
    var loadSprcialtyHTML = loadSpecialtyTmp(handleArr);
    $("#specialty" + type).html(loadSprcialtyHTML).removeClass("hide").show();


    var handleArr2 = new Array();
    for (var j = 0; j < 10; j++) {
        handleArr2.push({
            x: parseInt(j + 1),
            t: type,
            sequence: university.sequence,
            majorType: cate,
            universityId: university.universityId
        })
    }

    var loadSpecialtyTmp2 = handleBars.compile(self.$tempVolunteerUniversitySpecialty2.html());
    var loadSprcialtyHTML2 = loadSpecialtyTmp2(handleArr2);
    $("#specialtyPart" + type).html(loadSprcialtyHTML2);

};
/**
 * 获取专业信息 -by universityId &majorType
 */
volunteerBase.prototype.getSpecialty = function (universityId, t) {
    var self = this;
    if (self.Flag) {
        var url = util.INTERFACE_URL.getSpecialty;
        var method = "GET";
        var data = {
            "uId": universityId,
            "cate": cate,
            "req": "ajax",
            "code": province,
            "token": util.cookie.getCookieValue('token')
        };
        var callback = function (res) {
            if (res.rtnCode == '1000004') {
                tips('#tips', res.msg);
                window.location.href = '/login.html';
            }
            if (res.rtnCode == '0000000') {
                //var specialtys = res.bizData.specialtys;
                //if (!!specialtys && specialtys.length > 0) {
                //    var ajaxSpecialtyTmp = handleBars.compile(self.$tempVolunteerAjaxSpecialty.html());
                //    handleBars.registerHelper("converMajorType", function (value) {
                //        return (value == 1 ? "文史" : "理工");
                //    });
                //    var html = ajaxSpecialtyTmp({batch: batch, year: self.year, specialtys: specialtys, ty: t});
                //    var ajaxSpecialtyBoxTmp = handleBars.compile(self.$tempVolunteerSpecialtyBox.html());
                //    var htmlBox = ajaxSpecialtyBoxTmp(t);
                //    $("body").append(htmlBox);
                //    $("#ajaxSpecialty" + t).html(html);
                //} else {
                //
                //}
                $("#ajaxSpecialty" + t).html("");
                var specialtys = res.bizData.specialtys;
                var ajaxSpecialtyTmp = handleBars.compile(self.$tempVolunteerAjaxSpecialty.html());
                handleBars.registerHelper("converMajorType", function (value) {
                    return (value == 1 ? "文史" : "理工");
                });
                handleBars.registerHelper("specialtyInfoLink", function (value) {
                    return parseInt(value) > -1 ? "/data-professional-detail.html?id=" + value : "javascript:void(0)";
                });

                var html = '';
                if (!!specialtys && specialtys.length > 0) {
                    html = ajaxSpecialtyTmp({batch: batch, year: self.year, specialtys: specialtys, ty: t});
                } else {
                    html = "<div class='no-data'>(ﾟ∀ﾟ) 真抱歉,没有匹配到相关专业</div>";
                }
                var ajaxSpecialtyBoxTmp = handleBars.compile(self.$tempVolunteerSpecialtyBox.html());
                var htmlBox = ajaxSpecialtyBoxTmp(t);
                $("body").append(htmlBox);
                $("#ajaxSpecialty" + t).append(html);
            }
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
                beforeSend: function () {
                    self.Flag = false;
                },
                complete: function () {
                    self.Flag = true;
                },
                success: callback,
                error: callback
            });
        } else {
            $.ajax({
                url: url,
                type: method,
                data: data || {},
                beforeSend: function () {
                    self.Flag = false;
                },
                complete: function () {
                    self.Flag = true;
                },
                success: function (res) {
                    callback(res);
                },
                error: function (res) {
                    if (callbackError && typeof(callbackError) === "function") {
                        callbackError(res);
                    }
                }
            });
        }
    }
}
/**
 * 选择 专业 ---事件绑定
 */
volunteerBase.prototype.specialtyClick = function (t) {
    var self = this;
    $(".specialty-click" + t + " .specialty-click").click(function (event) {
        var item = $(this).attr("itemNum");

        var tempDialog = handleBars.compile(self.$tempVolunteerSpecialtyDialog.html());
        var headerHTML = tempDialog({item: item, t: t});
        dialog('专业选择', headerHTML);

        $('#volunteerSpecialtyList' + t).html($('#ajaxSpecialty' + t).html());
        self.specialtyCheckResult(t);
    });
};
/**
 * 最终选择 专业--事件绑定
 */
volunteerBase.prototype.specialtyCheckResult = function (t) {
    var self = this;

    $(".specialtys-result-btn").click(function (event) {
        event.stopPropagation();
        var $specialtysA = $(this);
        var obj = {
            specialtyId: 0,
            specialtyName: $specialtysA.attr("specialtyname")
        };
        var $specialtyTable = $specialtysA.parents(".table");
        var x = $specialtyTable.attr("item");

        $("#item" + t + x).val($specialtysA.attr("specialtyname"));
        $("#item" + t + x).attr("data-planEnroll",$specialtysA.attr("data-planEnroll"));
        self.hideDiaLogModal();
    });
}
/**
 * 院校信息填充
 * @constructor
 */
volunteerBase.prototype.fillUniversity = function () {
    var self = this;
    $("#volunteerSchoolList").html($("#" + self.cacheKey).html());
}

/**
 * 完成志愿报告按钮   --结果导出 json
 */
volunteerBase.prototype.saveReport = function () {
    var self = this;
    $("#volunteer-btn").click(function () {
        var sub_tag = ['一', '二', '三', '四', '五', '六'];
        var flag = true;

        /**************************暂处理 兼容广西【多维数组 转一维】**************************/

        var validArr = self.volunteerArr;
        if (province == 'gx') {
            validArr = validArr.join(",").split(",");
        }
        for (var i = 0; i < validArr.length; i++) {//[["A","B"],["A"]]
            if (!flag)
                return false;
            var tag = validArr[i];
            if (Array.isArray(tag)) {
                $.each(tag, function (j) {
                    var schoolTag = tag[j] + "_" + i;
                    if ($('#schoolInfo' + schoolTag + ' .school-t').text() == "") {
                        tips('#tips', "请在第" + sub_tag[i] + "志愿-" + tag[j] + "志愿中选择学校");
                        flag = false;
                        return false;
                    }
                });
            } else {
                if ($('#schoolInfo' + tag + ' .school-t').text() == "") {
                    tips('#tips', "请在" + tag + "志愿中选择学校");
                    flag = false;
                    return false;
                }
            }

        }
        /**************************暂处理 兼容广西**************************/
        self.reportUniversityView = new Array();
        // 院校信息
        self.$volunteerBox.find('.school-item').each(function (i) {

            var $university = $(this);

            var universityObj = {
                enrollingNumber: $university.find(".planEnrolling").text(),
                averageScore: $university.find(".averageScore").text(),
                enrollRate: $university.find(".enrollRate").text(),
                id: $university.find(".school-t").attr("data-id"),
                name: $university.find(".school-t").text(),
                isComplied: 0,
                selfReportMajorViewList: [],
                property: $university.find(".property").text(),
                subjection: $university.find(".subjection").text(),
                type: $university.find(".type2").text(),
                typeName: $university.find(".type").text(),
                sequence: $university.find(".sequence").text()
            };

            self.reportUniversityView.push(universityObj);


        });
        // 6个专业
        self.$volunteerBox.find('.item3').each(function (i) {
            var majorBoxArr = [];
            var $major = $(this);

            $.each($major.find(".majorRep"), function () {

                var majorObj = {
                    "id": 0,
                    "name": $(this).val(),
                    "planEnrolling":parseInt($(this).attr("data-planEnroll"))
                }

                majorBoxArr.push(majorObj);
                self.reportUniversityView[i].selfReportMajorViewList = majorBoxArr;

            });

        });
        // 0,1,2,
        self.$volunteerBox.find('.txtRadio').each(function (i) {
            var dataType = $(this).attr("data-type");
            self.reportUniversityView[i].isComplied = $(this).find("input[type='radio']:checked").val();
            var s = parseInt(self.reportUniversityView[i].isComplied);

            if (s === 2) {// 广西省内10个专业
                self.$volunteerBox.find(".item4").each(function (j) {
                    var $major = $(this);

                    $.each($major.find(".majorRep" + dataType), function () {

                        var majorObj = {
                            "id": 0,
                            "name": $(this).val()
                        }
                        self.reportUniversityView[i].selfReportMajorViewList.push(majorObj);

                    });

                })
            }
        });

        for (var i = 0; i < self.reportUniversityView.length; i++) {
            var resultObj = {
                selfReportUniversityViewList: self.reportUniversityView[i],
                sequence: (i + 1)
            }
            self.reportBox.push(resultObj);

        }
        //console.log(self.reportBox);
        self.saveReportResult();

    });
};
volunteerBase.prototype.saveReportResult = function () {
    var self = this;
    if (self.FlagResult) {
        var url = util.INTERFACE_URL.volunteerSave;
        var method = "POST";
        var data = {
            "batch": batch,
            "score": score,  // 分数
            "precedence": precedence, // 位次
            "majorType": cate, // 科类
            "provinceCode": province, // 科类
            "reportResultJson": JSON.stringify(self.reportBox),
            "req": "ajax",
            "token": util.cookie.getCookieValue('token')
        };
        //console.log(JSON.stringify(self.reportBox));
        //return false;
        //new crossSite(params,"crossPannel",url).init();
        var callback = function (res) {
            if (res.rtnCode == '1000004') {
                tips('#tips', res.msg);
                window.location.href = '/login.html';
            }
            if (res.rtnCode == '0000000') {
                var result = res.bizData.result;
                if (!!result && result > 0) {
                    window.location.href = self.resultRedirectUrl;
                } else {
                    alert("失败");
                }
            }
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
                beforeSend: function () {
                    self.FlagResult = false;
                },
                complete: function () {
                    self.FlagResult = true;
                },
                success: callback,
                error: callback
            });
        } else {
            $.ajax({
                url: url,
                type: method,
                data: data || {},
                beforeSend: function () {
                    self.FlagResult = false;
                },
                complete: function () {
                    self.FlagResult = true;
                },
                success: function (res) {
                    callback(res);
                },
                error: function (res) {
                    if (callbackError && typeof(callbackError) === "function") {
                        callbackError(res);
                    }
                }
            });
        }
    }
}
/**
 * 字符串格式化
 * @returns {*}
 */
volunteerBase.prototype.stringFormat = function () {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

module.exports = volunteerBase;