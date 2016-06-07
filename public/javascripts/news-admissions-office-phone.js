define(['commonjs', '../css/news/news-admissions-office-phone.css', 'handlebars', 'timeFormat', 'cookie', 'noDataTips', 'autoComplete'], function (util, dataSchoolInfoCss, handlebars, getTime, cookie, noDataTips) {

    // 获取省份
    util.ajaxFun(util.INTERFACE_URL.getProvinceList, 'get', {}, function (res) {
        if (res.rtnCode === "0000000") {
            var template = handlebars.compile($("#temp-province-list").html());
            $('#province-list').html(template(res));
            var urlpara = window.location.host.split(".");
            urlpara[0] = urlpara[0] == 'www' ? 'bj' : urlpara[0];
            $('#province-'+urlpara[0]).attr( 'class', 'active');
            loadPhoneInfo( urlpara[0]);
        }
    });


    $(document).on( 'click', '#province-ul li', provinceClicked);
    function provinceClicked( e) {
      var id = $( e.target).attr('id');
      var locationCode = id.replace('province-', '');
      $('#province-ul li').attr( 'class', '');
      $( e.target).attr( 'class', 'active');
      loadPhoneInfo( locationCode);
    }


    function loadPhoneInfo(locationCode) {
      util.ajaxFun(util.INTERFACE_URL.getGkTelList, 'get', { userKey:locationCode, page:1, rows:100}, function (res) {

          if (res.rtnCode === "0000000") {
              var template = handlebars.compile('{{#each rows}}<div class="item"><div class="icon"></div><div class="text-content"><span>{{address}}</span><span>{{telphone}}</span></div></div>{{/each}}');
              $('#phone-number-block').html(template(res.bizData));
          }
      });
    }

});
