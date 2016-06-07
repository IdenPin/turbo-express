/**
 * 志愿对象
 *
 * 河南河北模板
 *
 * 2016-04-08 douzy [抽象此对象 .为兼容各省份不同需求~]
 *
 */
//路由判断

var Router = require('volunteerRouter');
Router.router();
var handleBars = require('handlebars');
require('../css/volunteer/predict-selSchool-tpl1.css');
var volunteerBase = require("volunteerBase");
var util = require('commonjs');
var configData = require('volunteerSchoolProfessConf').volunteerSchoolProfessFun();

function getSchoolNumArr(len) {
    var schoolNumArr = [], temp = '';
    for (var i = 1; i <= len; i++) {
        temp = i + '';
        schoolNumArr.push(temp);
    }
    return schoolNumArr;
}
function execUniversityArr(len) {
    var tmp1 = [];
    for (var i = 0; i < len; i++) {
        var tmp0 = []
        tmp0.push(-1);
        tmp0.push(-1);
        tmp1.push(tmp0);
    }
    return tmp1;
}
function volunteer() {
    this.resultRedirectUrl = configData.resultUrl;
    this.volunteerArr = configData.schoolArr;
    this.specialtyNumber = configData.professN;
    this.checkUniversityArr = execUniversityArr(configData.schoolArr.length);
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
        var tempBody = handleBars.compile(self.$tempBody.html());
        var bodyHTML = tempBody(self.volunteerArr[i]); //BODY
        self.$volunteerBox.append(self.stringFormat(self.getVolunteerTable(), self.THHtml(self.volunteerArr[i]), bodyHTML));
        var loadingImg = require('../img/loading.gif');
        $('.loading-img').attr('src', loadingImg);
    }
    self.maxSchoolBtnEvent();
}
volunteerBase.prototype.getMaxIndex = function (str) {
    var self = this;
    return $.inArray(str, self.volunteerArr);
}
volunteer.prototype.THHtml = function (tag) {
    return "<th colspan='3' style='background: #dedede'>" + tag + "志愿</th>";
};

$(function () {
    new volunteer().init();
});

