define(['commonjs', 'handlebars'], function (common, handlebars) {
    require('../css/data/data-professional-info.css');
    $(function () {
        var majoredId = common.getLinkey('id');
        var majorType = common.getLinkey('majorType');
        var offset = 0;
        var row = 10;
        var loginFlag = common.cookie.getCookieValue('isLogin');
        //专业详情
        $('#majored-category-detail').html('');
        $('#majored-direction-detail').html('');
        common.ajaxFun(common.INTERFACE_URL.getMajoredInfoById, 'GET', {
            'majoredId':majoredId,
            'majorType':majorType
        }, function (res) {
            if (res.rtnCode === "0000000") {
                var template = handlebars.compile($("#temp-majored-detail").html());
                $('#majored-category-detail').html(template(res.bizData));
                loadOpenUniversity();
                majoredDirectionDetail();
            }
        });



        function loadOpenUniversity() {
          common.ajaxFun(common.INTERFACE_URL.getMajorOpenUniversityList, 'GET', {
            'majoredId':majoredId,
            'majorType':majorType,
            'offset': offset,
            'row': row
            }, function (res) {
              if (res.rtnCode === "0000000") {
                  var loadBtn = $('<button id="load-more" class="btn btn-next" style="display: inline-block;">加载更多</button>');
                  var template = handlebars.compile($("#temp-universities-list").html());

                  $.each( res.bizData.universityList, function ( k, v) {
                      var tmpTagHtml = '';
                      if( !v.photo_url.match('http')) {
                        v.photo_url = 'http://123.59.12.77:8080/' + v.photo_url;
                      }
                      $.each( v.propertys, function ( k1, v1) {
                        switch( k1) {
                          case '1':
                            tmpTagHtml += '<span class="lv-1">985</span>';
                          break;
                          case '2':
                            tmpTagHtml += '<span class="lv-2">211</span>';
                          break;
                          case '8':
                            tmpTagHtml += '<span class="lv-8">研</span>';
                          break;
                          case '16':
                            tmpTagHtml += '<span class="lv-16">国</span>';
                          break;
                          case '32':
                            tmpTagHtml += '<span class="lv-32">卓</span>';
                          break;
                          case '64':
                            tmpTagHtml += '<span class="lv-64">自</span>';
                          break;
                        }
                      });
                      v.tmpTagHtml = tmpTagHtml;

                      var tmpLikeHtml = '';
                      if( loginFlag) {
                        tmpLikeHtml = v.isCollect == 1 ? '<a id="like-'+v.id+'" href="javascript:void(0);"><i class="icon-heart"/>&nbsp;已收藏</a>': '<a id="like-'+v.id+'" href="javascript:void(0);"><i class="icon-heart-no"/>&nbsp;未收藏</a>';
                      }
                      v.tmpLikeHtml = tmpLikeHtml;
                  });

                  var appendHtml = template(res.bizData);
                  var oldHtml = $('#open-universities-detail').html();
                  $('#open-universities-detail').html( oldHtml + appendHtml);
                  $("#load-more").remove();
                  if( ( offset + row ) < res.bizData.count ) {
                    offset += row;
                    $('#open-universities-detail').append(loadBtn);
                  }
              }
          });
        }





        function majoredDirectionDetail() {
            common.ajaxFun(common.INTERFACE_URL.getJobOrientation, 'GET', {
                'majoredId':majoredId
            }, function (res) {
                if (res.rtnCode === "0000000") {
                    $('#majored-direction-content').html(res.bizData.introduce);
                    if(res.bizData.employmentRate){
                        //alert(Math.round(parseFloat(res.bizData.employmentRate) * 100) / 100);
                        $('#employmentRate').html((parseFloat(res.bizData.employmentRate) * 100).toFixed(2) + '%');
                    }else{
                        $('#employmentRate').html('暂无');
                    }

                }
            });
        }
        function likeAction( e) {
          var id = $(e.currentTarget).attr('id').replace('like-', '');
          var className = $($(e.target).children().get(0)).attr('class');
          if( className.match('no')) {
            $(e.target).html('<i class="icon-heart"/>&nbsp;已收藏');
            common.ajaxFun(common.INTERFACE_URL.saveUserCollect, 'GET', {type:1,projectId:id}, function(){});
          } else {
            $(e.target).html('<i class="icon-heart-no"/>&nbsp;未收藏');
            common.ajaxFun(common.INTERFACE_URL.deleteUserCollect, 'GET', {type:1,projectId:id}, function(){});
          }
        }

        $('#majored-category-detail').on('click','b.detail-tab',function(){
            $(this).addClass('active').siblings().removeClass('active');
            var index = $(this).index();
            $('.sub-content').hide();
            $('.sub-content:eq('+ index +')').show();
        });

        $(document)
          .on( 'click', '#load-more', loadOpenUniversity)
          .on( 'click', '[id|="like"]', likeAction);

    });
});
