///*
// * 采用webpack插件html-loader实现html页面继承
// * 使用require导入commonCss公用样式
// * require引入依赖库
// * */
//
require('commonCss');



require('../css/user/login.css');

// 切换
require('./components/login/tab.js');

// 登录
require('./components/login/login.js');

// 注册
require('./components/login/register.js');


