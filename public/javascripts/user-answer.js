define(['commonjs'], function (util) {
    require('../css/user/user-account-info.css');
    $(function () {
        $('#banner-info').prepend(require('html!../user-banner.html'));

    });


});



