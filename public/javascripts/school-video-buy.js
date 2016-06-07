define(['commonjs','cookie','tips' ,'../css/videoBuy/school-video-buy.css'], function (util,cookie,tips,schoolVideoBuy) {
$(function () {

  var login = cookie.getCookieValue('isLogin');

  $('#product-1').hide();
  $('#product-2').hide();


  var pakeageImgA = require('../img/zyjd.png');
  $('#pakeage-logo-a').attr('src',pakeageImgA);
  var pakeageImgB = require('../img/jbdk.png');
  $('#pakeage-logo-b').attr('src',pakeageImgB);

  var productInfo = {};
  util.ajaxFun( util.INTERFACE_URL.findAllProduct, 'GET', { userId:""}, function(res){
    if (res.rtnCode == '0000000') {
      $.each( res.bizData, function(k,v) {
        var tmpObj = {};
        tmpObj.price = v.salePrice;
        tmpObj.quantity = 1;
        productInfo[v.productId] = tmpObj;
        refreshProductBoard();
      });
    } else {
      util.checkLoginTimeout(res);
    }
  });

  function refreshProductBoard() {
    $.each( productInfo, function(k,v){
      if( v.quantity < 2 ) {
        v.quantity = 1;
        $( '#product-' + k +' #btn-dec-'+k).attr( 'class', 'round-btn deactive');
      } else if( v.quantity > 9) {
        v.quantity = 10;
        $( '#product-' + k +' #btn-inc-'+k).attr( 'class', 'round-btn deactive');
      } else {
        $( '#product-' + k +' #btn-dec-'+k).attr( 'class', 'round-btn');
        $( '#product-' + k +' #btn-inc-'+k).attr( 'class', 'round-btn');
      }
      $('#product-' + k +' .right-container .price').html( '￥' + formatPriceString(v.price));
      $('#product-' + k +' .right-container .quantity').html( v.quantity);
      $('#product-' + k +' .right-container .total').html( '￥' + ( v.quantity * v.price ));
      $('#product-' + k +' .left-container .buy-btn').removeAttr('disabled');
      $('#product-' + k).show();
    });
  }

  function quantityChange( e) {
    var id = $(e.target).attr('id');
    var para = id.split('-');
    para[1] === 'inc' && productInfo[para[2]].quantity ++;
    para[1] === 'dec' && productInfo[para[2]].quantity --;
    refreshProductBoard();
  }

  function makeOrder( e){

    if( !login) {
      util.checkLoginTimeout( { 'rtnCode':'1000004'});
    }

    var id = $(e.target).attr('id');
    var para = id.split('-');
    var product = {};
    product.productId = para[2];
    product.productNum = productInfo[ para[2]].quantity;
    product.unitPrice = productInfo[ para[2]].price;
    product.validValue = 1;
    var productData = [product];

    var data = {};
    data.products = JSON.stringify(productData);
    data.returnUrl = window.location.hostname+'/user-order.html';

    util.ajaxFun( util.INTERFACE_URL.createOrders, 'GET', data, function(res){
      if (res.rtnCode == '0000000') {
        var orderNumber = res.bizData.orderNo;
        var url = '/school-video-pay.html?orderid='+orderNumber;
        window.location.href = url;
      } else {
        util.checkLoginTimeout(res);
      }
    });
  }

  function formatPriceString( price) {
    price = String(price);
    var para = price.split('.');
    if(para.length==2)
    {
      return para[0] + '.<span style="font-size:22px;">' + para[1] + '</span>';
    }
    return para[0] + '.<span style="font-size:22px;">00</span>';
  }

  $(document)
    .on('click', '[id|="btn-inc"]', quantityChange)
    .on('click', '[id|="btn-dec"]', quantityChange)
    .on('click', '[id|="btn-submit"]', makeOrder);

});
});
