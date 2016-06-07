define(['commonjs'], function (util) {
    require('../css/volunteer/volunteer-prediction-common.css');
    $(function () {
        var acId = util.getLinkey('Type');
        util.ajaxFun(util.INTERFACE_URL.postQueryApeskUrl, 'POST', {
            acId: acId//测试类型
        }, function (res) {
            if (res.rtnCode == '0000000') {
                console.log(res);
                if (res.rtnCode == "0000000") {
                    $("#apeskIframe").attr("src", res.bizData.data);
                } else {
                    alert(res.msg);
                }
            }
        });
    });
});
