define(['commonjs', 'handlebars'], function (common, handlebars) {
    require('../css/data/data-occupational-info.css');

    $(function () {
        var detailId = common.getLinkey('id');
        common.ajaxFun(common.INTERFACE_URL.getProfessionalInfo, 'GET', {
            'id':detailId
        }, function (res) {
            if (res.rtnCode === "0000000") {
                var template = handlebars.compile($("#temp-occupational-detail").html());
                $('#occupational-detail').html(template(res.bizData));
            }else{
                alert(res.msg);
            }
        });

    });
});






