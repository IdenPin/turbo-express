define([], function () {
//提示信息
    var tips = function tips(obj, txt) {
        $(obj).text(txt).fadeIn('1500');
        setTimeout(function () {
            $(obj).fadeOut('1500');
        }, 1000);
    };

    return tips;

});
