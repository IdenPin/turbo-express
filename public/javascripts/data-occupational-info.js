define(['commonjs', 'handlebars','noDataTips', 'autoComplete'], function (common, handlebars,noDataTips) {
    require('../css/data/data-occupational-info.css');

    $(function () {
        var page = "1",
            pageRows = '10',
            queryparam = $.trim($('#query').val());
        var ListParameter = {
            page : page,
            pageRows : pageRows,
            queryparam : queryparam,
            professionTypeId : '',
            professionSubTypeId :''
        };

         //职业信息大类
        function getProfessionCategory(pid){
            common.ajaxFun(common.INTERFACE_URL.getProfessionCategory, 'GET', {
                'pid':pid || ''
            }, function (res) {
                if (res.rtnCode === "0000000") {
                    var template = handlebars.compile($("#temp-professional").html());
                    $('#professional-tabs').html(template(res));
                    $('#professional-tabs .professionalTabs:eq(1)').click();
                }
            });
        }
        getProfessionCategory();
        // 职业信息小类
        $('#professional-tabs').on('click', '.professionalTabs', function () {
            var pid = $(this).attr('pid');
            var type = $(this).text();
            $('.professionalTabs').removeClass('active');
            $(this).addClass('active');
            $('#professional-sub-title').text(type);
            professionalTabs(pid);
            ListParameter.page = page;
            var queryV = $.trim($('#query').val());
            ListParameter.queryparam = queryV;
            $('#professional-list').html('');
        });

        function professionalTabs(pid) {
            common.ajaxFun(common.INTERFACE_URL.getProfessionCategory, 'GET', {
                'pid': pid || ''
            }, function (res) {
                if (res.rtnCode === "0000000") {
                    if(pid){
                        var li = '';
                        for (var i = 0; i < res.bizData.length; i++) {
                            li += '<li class="professional-sub" id="' + res.bizData[i].id + '">' + res.bizData[i].Type + '</li>';
                        }
                        $('#professional-sub').html(li);
                    }else{
                        $('#professional-sub').html('<li class="professional-sub" id="">全部</li>');

                    }
                    $('#professional-sub li:eq(0)').click();
                }
            });
        }
        //
        $('#professional-sub').on('click', '.professional-sub', function () {
            ListParameter.page = page;
            $(this).addClass('active').siblings().removeClass('active');
            var queryV = $.trim($('#query').val());
            ListParameter.queryparam = queryV;
            ListParameter.professionTypeId = $('#professional-tabs').find('span.active').attr('pid');
            ListParameter.professionSubTypeId = $('#professional-sub').find('li.active').attr('id');
            $('#professional-list').html('');
            getList(ListParameter.page,ListParameter.pageRows,ListParameter.queryparam,ListParameter.professionTypeId,ListParameter.professionSubTypeId);

        });

        function getList(page,pageRows,queryparamV,professionTypeIdV,professionSubTypeIdV) {
            common.ajaxFun(common.INTERFACE_URL.getProfessionalList, 'GET', {
                'page': page,
                'rows': pageRows,
                'queryparam': queryparamV,
                'professionTypeId': professionTypeIdV,
                'professionSubTypeId': professionSubTypeIdV
            }, function (res) {
                console.log(res);
                if (res.rtnCode === "0000000") {
                    $('.btn-next').show();
                    if (res.bizData.rows.length < pageRows) {
                        $('.btn-next').hide();
                    }
                    handlebars.registerHelper('starNum',function(val){
                        var starLi = '';
                        for(var j=0;j<val;j++){
                            starLi += '<span class="star"><i class="icon-star-y"></i></span>';
                        }
                        return starLi;
                    });
                    var template = handlebars.compile($("#temp-professional-list").html());
                    $('#professional-list').append(template(res.bizData));
                    if (res.bizData.rows.length == '0') {
                        $('.data-tips').html(noDataTips('真抱歉,没有查到相关职业'));
                    }else{
                        $('.data-tips').html('');

                    }

                }
            });
        }

        // 搜索
        $('#search-btn').on('click',function(){
            $('#professional-list').html('');
            ListParameter.page = page;
            var queryV = $.trim($('#query').val());
            ListParameter.queryparam = queryV;
            getList(ListParameter.page,ListParameter.pageRows,ListParameter.queryparam,ListParameter.professionTypeId,ListParameter.professionSubTypeId);
        });

        // 加载更多
        $('.btn-next').on('click', function () {
            ListParameter.page++;
            getList(ListParameter.page,ListParameter.pageRows,ListParameter.queryparam,ListParameter.professionTypeId,ListParameter.professionSubTypeId);
        });

    });
});
