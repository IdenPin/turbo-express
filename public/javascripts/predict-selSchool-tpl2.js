/*
 * pdeng
 * 路由判断:Router
 * getSchoolNumArr
 * 福建40,北京20(数字) volunteerArr
 * */
var Router = require('volunteerRouter');
Router.router();
require('../css/volunteer/predict-selSchool-tpl2.css');
var handleBars = require('handlebars');
var volunteerBase = require("volunteerBase");
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
    this.volunteerArr = getSchoolNumArr(configData.schoolNumber); //高职院校个数
    this.specialtyNumber = configData.professN;
    this.checkUniversityArr = execUniversityArr(configData.schoolNumber);
    this.precedenceObj = {
        min: configData.thresholdArr[0],
        max: configData.thresholdArr[1]
    }
}
//继承Base
volunteer.prototype = new volunteerBase();
//修正原型实例对象
volunteer.prototype.constructor = volunteer;
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
};
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
};
/**
 * 选择院校， 记录选中值
 * index 记录第几志愿
 */
volunteerBase.prototype.checkUniversityData = function (i, t) {
    var self = this;

    var index = self.getMaxIndex(t);
    //console.info(index)

    self.checkUniversityArr[index][self.isFirst] = parseInt(i);
    if (self.isFirst == 0)
        self.checkUniversityArr[index][self.firstFlagObj.universityFirstFlag] = -1;
    else
        self.checkUniversityArr[index][self.firstFlagObj.majorFirstFlag] = -1;
    return false;
};
volunteerBase.prototype.getMaxIndex = function (str) {
    var self = this;
    return parseInt(str) - 1;
};
handleBars.registerHelper("isOne", function (data, options) {
    return (data == 1 ? options.fn(this) : options.inverse(this));
});
volunteer.prototype.THHtml = function (tag) {
    return "<th colspan='4' style='background: #dedede' class='dh'>" + tag + "志愿</th>";
};
$(function () {
    new volunteer().init();
});
