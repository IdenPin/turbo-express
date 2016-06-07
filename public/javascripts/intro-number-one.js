/*
 * Created by pdeng on 16/5/12.
 * 金榜登科会员卡介绍页面
 * */
define(['commonjs', '../css/videoBuy/intro-gold-placard.css'], function (util) {
    // banner
    var banner_img = require('img/video-buy-banner.jpg');
    $('#banner').css('background', 'url(' + banner_img + ')');
    for (var i = 1; i <= 7; i++) {
        $('.intro-gold-placard'+i).attr('src', require('img/intro-gold-pic/intro-gold-placard'+i+'.png'));
    }
});

