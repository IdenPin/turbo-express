define(['commonjs', 'handlebars'], function (util, handlebars) {
    require('../css/class/class-college-detail.css');




    var videoId = util.getLinkey('id');
    util.ajaxFun(util.INTERFACE_URL.getVideoDetail, 'get', {id: videoId}, function (res) {
        if (res.rtnCode == '0000000') {
            handlebars.registerHelper("addOne", function (index, options) {
                return parseInt(index) + 1;
            });
            var template = handlebars.compile($('#video-detail-info').html());
            var html = template(res.bizData);
            $('.main-container').html(html);
            $('#videoList').on('click','a.video-item',function(){
                var url = $(this).attr('url'),
                    poster = $(this).attr('poster');


                //var urls = 'http://gk360b.ks3-cn-center-1.ksyun.com/20160128143343.SzAvjyXhTq.mp4'
                //var urls = 'http://vjs.zencdn.net/v/oceans.mp4';
                var html = ''+
                    '<video class="video" id="videoPlay" poster="'+ poster +'" width="1000" height="472" controls autoplay>'+
                    '<source src="'+ url +'" media="only screen and (min-device-width: 568px)"></source>'+
                    '</video>';
                $('#videoPlay-box').html(html);
            });
            $('#videoList a.video-item:eq(0)').click();
        } else {
          util.checkLoginTimeout(res);
        }
    });
//观看量统计

    util.ajaxFun(util.INTERFACE_URL.postHitInCount, 'get', {id: videoId}, function () {
        console.info("+1");
    });

    require('../lib/html5media/html5media.min.js');





});
