var util = require('commonjs');
$(function () {

        // tab切换
    $('#tab-title').on('click','span',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $('.content-list').removeClass('active');
        $('.content-list:eq('+ index +')').addClass('active');
    });
});