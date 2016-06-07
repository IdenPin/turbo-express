/**
 * 广东模板
 */
//路由判断
require('../css/volunteer/predict-selSchool-tpl1.css');
var Router = require('volunteerRouter');
Router.router();
var handleBars = require('handlebars');
var volunteerBase = require("volunteerBase");
var util = require('commonjs');
var province = util.cookie.getCookieValue('userKey'),
    batch = util.cookie.getCookieValue('volunteerBatch'),
    configData = require('volunteerSchoolProfessConf').volunteerSchoolProfessFun();
var btch = batch.split("-");
function execUniversityArr(len) {
    var tmp1 = [];
    for (var i = 0; i < len; i++) {
        var tmp0 = [];
        tmp0.push(-1);
        tmp0.push(-1);
        tmp1.push(tmp0);
    }
    return tmp1;
}
function volunteer() {
    this.resultRedirectUrl = configData.resultUrl;
    /*
     *
     * 对广东和吉林特殊处理
     * */
    if (province == 'gd') {
        if (parseInt(batch[0]) == 1 || parseInt(batch[0]) == 2) {
            this.volunteerArr = [["A", "B", "C", "D", "E", 'F', 'G'], ["A", "B", "C", "D"]];
        }
    }
    if (province == 'jl') {
        if (parseInt(btch[0]) == 2) {
            this.volunteerArr = [["A"], ["A", "B", "C", "D", "E", "F", "G", "H"]]
        }
        if (parseInt(btch[0]) == 4) {
            this.volunteerArr = [["A"], ["A", "B", "C", "D", "E", "F", "G"]]
        }
        if (parseInt(btch[0]) == 3) {
            this.volunteerArr = [["A"], ["A", "B", "C", "D", "E", "F"]]
        }
    }
    //this.specialtyNumber = province == 'jl' ? 6 : configData.professN;
    this.checkUniversityArr = execUniversityArr(11);
    this.precedenceObj = {
        min: configData.thresholdArr[0],
        max: configData.thresholdArr[1]
    }
}
//继承Base
volunteer.prototype = new volunteerBase();
//修正原型实例对象
volunteer.prototype.constructor = volunteer;

/**
 * 初始化ABCDEF.....志愿HTML
 */
volunteer.prototype.loadVolunteerHTML = function () {
    var self = this;
    self.$volunteerBox.html("");
    for (var i = 0; i < self.volunteerArr.length; i++) {
        for (var j = 0; j < self.volunteerArr[i].length; j++) {
            var tempBody = handleBars.compile(self.$tempBody.html());
            var bodyHTML = tempBody({tag: self.volunteerArr[i][j], index: i}); //BODY
            self.$volunteerBox.append(self.stringFormat(self.getVolunteerTable(), self.THHtml(self.volunteerArr[i][j], i), bodyHTML));
            var loadingImg = require('../img/loading.gif');
            $('.loading-img').attr('src', loadingImg);
        }
    }
    self.maxSchoolBtnEvent();
}
volunteer.prototype.THHtml = function (tag, index) {
    var num = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    return '<th colspan="3" style="background: #dedede" data-index=' + index + '>第' + num[index] + "志愿-" + tag + "志愿</th>";
};

volunteerBase.prototype.getMaxIndex = function (str) {
    var self = this;
    var tag = str.split("_");
    return $.inArray(tag[0], self.volunteerArr[tag[1]]);
}
$(function () {
    new volunteer().init();
});

