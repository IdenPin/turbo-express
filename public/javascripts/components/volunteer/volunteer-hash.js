
// 录取难易预测
var prediction = require('html!../../../comm_tmpl/volunteer/volunteer-prediction.html');
// 院校预测
var school = require('html!../../../comm_tmpl/volunteer/volunteer-school.html');
// 专业测评
var specialty = require('html!../../../comm_tmpl/volunteer/volunteer-specialty.html');
// 智能填报
var reported = require('html!../../../comm_tmpl/volunteer/volunteer-reported.html');

$('.sidebar li a').click(function () {
    var hash = $(this).attr('hash');
    $('.sidebar li a[href="'+ hash +'"]').parent().addClass('active').siblings().removeClass('active');
    switch (hash) {
        case "#prediction":
            $('#comm-tpl').html(prediction);
            break;
        case "#school":
            $('#comm-tpl').html(school);
            break;
        case "#specialty":
            $('#comm-tpl').html(specialty);
            break;
        case "#reported":
            $('#comm-tpl').html(reported);
            break;
    }
    window.location.hash = hash;
});
if (window.location.hash === "") {
    window.location.hash = '#prediction';
}
$('.sidebar li a[hash="' + window.location.hash + '"]').click();



