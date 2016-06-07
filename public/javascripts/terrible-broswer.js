/*
 * 采用webpack插件html-loader实现html页面继承
 * 使用require导入commonCss公用样式
 * require引入依赖库
 * */
define(['commonjs'], function (util) {
    var firefox = require('img/firefox-icon.png');
    var chrome = require('img/chrome-icon.png');
    var ie = require('img/ie-icon.png');
    var safari = require('img/safari-icon.png');
    $('.firefox').css('background', 'url(' + firefox + ')');
    $('.chrome').css('background', 'url(' + chrome + ')');
    $('.microsoft').css('background', 'url(' + ie + ')');
    $('.apple').css('background', 'url(' + safari + ')');
    $('footer,header').hide();
});
