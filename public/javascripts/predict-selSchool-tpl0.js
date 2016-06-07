/**
 * 志愿对象
 *
 * 广西模板
 *
 * 2016-04-08 douzy [抽象此对象 .为兼容各省份不同需求~]
 *
 */
//路由判断
var Router = require('volunteerRouter');
Router.router()
require('../css/volunteer/predict-selSchool-tpl0.css');
var volunteerBase = require("volunteerBase");
var configData = require('volunteerSchoolProfessConf').volunteerSchoolProfessFun();
function volunteer() {
    this.resultRedirectUrl = configData.resultUrl;
}
//继承Base
volunteer.prototype = new volunteerBase();
//修正原型实例对象
volunteer.prototype.constructor = volunteer;

$(function () {
    new volunteer().init();
});