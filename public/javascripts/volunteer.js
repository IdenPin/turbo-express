/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */

var util = require('commonjs');
require('../css/volunteer/volunteer-prediction-common.css');





// 切换
//require('./components/volunteer/volunteer-hash.js');


// 专家测评
require('./components/volunteer/volunteer-evaluation.js');



// 用户信息设置

