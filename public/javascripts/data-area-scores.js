define(['commonjs', 'handlebars'], function (util, handlebars) {
    require('../css/data/data-area-scores.css');


    $(function(){
        $('#province-tab').on('click','span.item',function(){
            $(this).addClass('active').siblings().removeClass('active');
            var index = $(this).index();
            $('.area-scores-content').hide();
            $('.area-scores-content:eq('+ index +')').show();
        });
        $('#province-tab span.item:eq(0)').click();
    });
});


