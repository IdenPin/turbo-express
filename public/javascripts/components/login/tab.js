require('jquery');
$(function () {
    // tab切换
    $('#login-reg-tab').on('click', '.tab', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $('.login-reg-content').removeClass('active');
        $('.login-reg-content:eq(' + index + ')').addClass('active');
    });
});
