

$(function(){
    // cepingBanner
    var cepingBanner = require('../../../img/cpbg.png');
    var $cepingBanner = $('<img />').attr('src', cepingBanner);
    $('.ceping-banner').html($cepingBanner);




    var imgResponsive1 = require('../../../img/ass01.jpg');
    var $imgResponsive1 = $('<img class="img-responsive" />').attr('src', imgResponsive1);
    $('#img-responsive1').html($imgResponsive1);

    var imgResponsive2 = require('../../../img/ass02.jpg');
    var $imgResponsive2 = $('<img class="img-responsive" />').attr('src', imgResponsive2);
    $('#img-responsive2').html($imgResponsive2);

    var imgResponsive3 = require('../../../img/ass03.jpg');
    var $imgResponsive3 = $('<img class="img-responsive" />').attr('src', imgResponsive3);
    $('#img-responsive3').html($imgResponsive3);

    var imgResponsive4 = require('../../../img/ass04.jpg');
    var $imgResponsive4 = $('<img class="img-responsive" />').attr('src', imgResponsive4);
    $('#img-responsive4').html($imgResponsive4);


    function getUrLinKey(name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(window.location.href)) return unescape(RegExp.$2.replace(/\+/g, " "));
        return "";
    }
    $(function(){
        var acId = getUrLinKey('Type');
        $.ajax({
            url: '/apesk/queryApeskUrl.do',
            type: 'post',
            dataType: 'json',
            data: {
                acId: acId//测试类型
            },
            success: function (res) {
                console.log(res);
                if(res.rtnCode=="0000000"){
                    $("#apeskIframe").attr("src",res.bizData.data);
                }else{
                    alert(res.msg);
                }

            }
        });
    });


});