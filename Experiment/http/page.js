/**
 * Created by pdeng on 16/7/7.
 * 分页:1——>200
 * 当前页1时 1234...200
 * 当前页3时 1234...200
 * 当前页6时 1...3456789...200
 * 当前页100时 1...96,97,98,99,100,101,102,103...200
 */



//定义一个函数
//function showPages(page, total) {
//    var str = page + '';
//    for (var i = 1; i <= 3; i++) {
//        if (page - i > 1) {
//            str = page - i + '' + str;
//        }
//        if (page + i < total) {
//            str = str + '' + (page + i);
//        }
//    }
//    if (page - 4 > 1) {
//        str = '... ' + str;
//    }
//    if (page > 1) {
//        str = '上一页 ' + 1 + ' ' + str;
//    }
//    if (page + 4 < total) {
//        str = str + ' ...';
//    }
//    if (page < total) {
//        str = str + ' ' + total + ' 下一页';
//    }
//    return str;
//}
//var pageDom = showPages(200, 200);
//console.info(pageDom);


function showPageCommon(config) {
    return function (page, total) {
        var str = '<a>' + page + '</a>';

        for (var i = 1; i <= 3; i++) {
            if (page - i > 1) {
                str = '<a class="' + config.color + '">' + (page - i) + '</a> ' + str;
            }
            if (page + i < total) {
                str = str + ' ' + (page + i);
            }
        }

        if (page - 4 > 1) {
            str = '... ' + str;
        }

        if (page > 1) {
            str = '上一页 ' + 1 + ' ' + str;
        }

        if (page + 4 < total) {

            str = str + ' ...';
        }

        if (page < total) {
            str = str + ' ' + total + ' 下一页';
        }

        return str;
    }
}

var showPages = showPageCommon({
    color: 'red'
});

var total = 200;
for (var i = 1; i <= total; i++) {
    var ret = showPages(i, total);
}
console.log(ret);
document.body.innerHTML=ret;

