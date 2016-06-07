define(['commonjs', 'handlebars','tips','noDataTips', 'autoComplete'], function (common, handlebars,tips,noDataTips) {
    require('../css/data/data-professional-info.css');
    $(function () {
        var UI = {
            $toggleNav: $('#toggle-nav'),
            $toggleNavContent: $('.toggle-nav-content')
        };

        window.zgk = {currentMajorType:1, clickMajorTyoe:1};
        // 学科门类 tab
        UI.$toggleNav.on('click', 'span', function () {
            $(this).addClass('active').siblings().removeClass('active');
            var type= $(this).attr('type');
            getMajoredCategoryList(type);
        });
        getMajoredCategoryList(1);
        function getMajoredCategoryList(type){
            window.zgk.clickMajorTyoe = type;
            common.ajaxFun(common.INTERFACE_URL.getMajoredCategory, 'GET', {
                'type':type
            }, function (res) {
                if (res.rtnCode === "0000000") {
                    window.zgk.currentMajorType = window.zgk.clickMajorTyoe;
                    modifyTemplate();
                    $('#query').val('');
                    $('#majored-category-tab').show();
                    $('#majored-sreach').hide();
                    var template = handlebars.compile($("#temp-majored-category").html());
                    $('#majored-category').html(template(res.bizData));
                    $('#majored-category li:eq(6)').click();
                }
            });
        }
        // 点击学科门类
        $('#majored-category').on('click','li',function(){
            $('#majored-sreach').html('');
            $(this).addClass('active').siblings().removeClass('active');
            var pid = $(this).attr('pid');
            getMajoredCategoryTabList(pid);
        });

        function modifyTemplate(){
          var tmpTemplate = $('#temp-majored-category-tab').html();
          tmpTemplate = tmpTemplate.replace( /majorType=\d/g, 'majorType=' + window.zgk.currentMajorType);
          $('#temp-majored-category-tab').html( tmpTemplate);
          console.log( tmpTemplate, window.zgk.currentMajorType);
        }

        function getMajoredCategoryTabList(categoryId){
            common.ajaxFun(common.INTERFACE_URL.getMajoredCategoryById, 'GET', {
                'categoryId':categoryId
            }, function (res) {
                console.log(res);
                if (res.rtnCode === "0000000") {
                    $('#query').val('');
                    $('#majored-category-tab').show();

                    if (res.bizData.length == '0') {
                        $('.data-tips').html(noDataTips('真抱歉,没有查到相关专业'));
                    }else{
                        $('.data-tips').html('');
                        var template = handlebars.compile($("#temp-majored-category-tab").html());
                        $('#majored-category-tab').html(template(res.bizData));
                        $('#majored-category-tab li.majored-category-tab-li:eq(0)').click();
                    }

                }
            });
        }



        // 专业搜索
        $('#go').on('click',function(){
            $('#majored-category li').removeClass('active');
            var queryV = $.trim($('#query').val());
            var curType = $('#toggle-nav span.active').attr('type');
            console.log(curType);
            if(queryV===""){
                tips('#tips','请输入专业名称');
                return false;
            }
            common.ajaxFun(common.INTERFACE_URL.getMajoredByName, 'GET', {
                'majoredName':queryV,
                'type':curType
            }, function (res) {
                console.log(res);
                if (res.rtnCode === "0000000") {
                    $('#majored-category-tab').hide();
                    $('#majored-sreach').show();
                    if (res.bizData.length == '0') {
                        $('#majored-sreach').html('');
                        $('.data-tips').html(noDataTips('真抱歉,没有查到相关专业'));
                    }else{
                        $('.data-tips').html('');
                        var template = handlebars.compile($("#temp-majored-sreach").html());
                        $('#majored-sreach').html(template(res.bizData));
                    }
                }
            });
        });
    });
});
