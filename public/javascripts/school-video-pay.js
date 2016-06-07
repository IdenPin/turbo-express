
define(['commonjs', '../css/videoBuy/school-video-buy.css', 'handlebars', 'timeFormat', 'noDataTips'], function (util, schoolVideoBuy, handlebars, getTime, noDataTips) {
    $(function () {
        require('../js/utils/pingpp-pc.js');
        var dialog = require('dialog');
        // banner
        var banner_img = require('img/video-buy-banner.jpg');
        $('#banner').css('background', 'url(' + banner_img + ')');

        var paymethodBtnAlipay = require('../img/alipayLOGO.png');
        var paymethodBtnAlipayActive = require('../img/icon_ok.png');
        var paymethodBtnWechart = require('../img/wechartPay.png');
        var paymethodBtnWechartActive = require('../img/icon_ok.png');
        $('#paymethod-btn-wechart').css("background", 'url(' + paymethodBtnAlipay + ') center 44px no-repeat');


        $('#btn-pay-cancel').on('click',function(){
            window.location.href='/school-video-buy.html';
        });

        var orderID = util.getLinkey('orderid');
        var orderInfo = {};
        var wechartCounter = false;
        var wechartQRCount = 300;
        var payStatusListener = false;

        orderInfo.payMethod = false;

        util.ajaxFun( util.INTERFACE_URL.getOrderInfo, 'GET', { orderNo: orderID}, function(res){
          if (res.rtnCode == '0000000') {
            orderInfo = res.bizData;
            refreshOrderBoard();
          } else {
            util.checkLoginTimeout(res);
            if( res.rtnCode != '1000004') {
              window.location.href='/user-order.html';
            }
          }
        });

        util.ajaxFun(util.INTERFACE_URL.getUserGoodsAddress, 'GET', {}, function (res) {
            if (res.rtnCode == '0000000') {
                var bizData = res.bizData;
                if (bizData && bizData.receivingAddress) {
                    $('.add-or-update-address').removeClass('hidden');
                    var html = [];
                    html.push('<div class="detail-address">寄送至：</div>');
                    html.push('<div class="detail-address">' + bizData.receivingAddress.replace('&','') + '&nbsp;&nbsp;(' + bizData.contactName + '&nbsp;收)&nbsp;&nbsp;' + bizData.contactPhone + '</div>');
                    $('#address').html(html.join(''));
                } else {
                    $('#address').html('<div class="show-address"><a data-toggle="modal" data-target="#dialogModal" class="add-or-update-address">添加收货地址</a></div>');
                    $('.add-or-update-address').off('click');
                    $('.add-or-update-address').on('click', function() {
                        addOrUpdateAddress();
                    });
                }
            }
        });

        //省市地区
        var province = '';
        var city = '';
        var county = '';
        var Area = {
            data: [],
            init: function (provinceId, cityId, countyId) {
                var that = this;
                util.ajaxFun(util.INTERFACE_URL.getAllRegion, 'GET', {}, function (ret) {
                    if ('0000000' === ret.rtnCode) {

                        that.data = ret.bizData;
                        $('#province').html(that.render(that.data, true));
                        if (provinceId) {
                            $('#province').val(provinceId);
                        }
                        var currentProvinceId = $('#province option:checked').val();
                        that.changeProvince(currentProvinceId)

                        if (cityId) {
                            $('#city').val(cityId);
                        }
                        var currentCityId = $('#city option:checked').val();
                        that.changeCity(currentCityId);

                        if (countyId) {
                            $('#county').val(countyId);
                        }

                    }
                });
            },
            render: function (data, flag) {
                var html = [];
                if (flag) {
                    html.push('<option value="00">省份</option>');
                }
                $.each(data, function (i, value) {
                    if (
                        value.id != "150000" &&
                        value.id != "540000" &&
                        value.id != "630000" &&
                        value.id != "710000" &&
                        value.id != "810000" &&
                        value.id != "820000"
                    ) {
                        html.push('<option value="' + value.id + '">' + value.name + '</option>');
                    }
                });
                return html.join('');
            },
            changeProvince: function (value) {
                var provinceId = $('#province').val();
                if (value) {
                    var city = this.getCity(value);
                    if (city && city.length > 0) {
                        $('#city').html(this.render(city));
                        this.changeCity(city[0].id);
                        //$('#areaSel-result').show().html($('#province option:checked').text() + $('#city option:checked').text() + $('#county option:checked').text());
                    } else {
                        $('#city').html('<option value="00">市</option>');
                    }

                    if (provinceId != "00" && !city) {
                        $('#city').parent().hide();
                        $('#county').parent().hide();
                        //$('#areaSel-result').show().html($('#province option:checked').text());
                    } else {
                        $('#city').parent().show();
                        $('#county').parent().show();
                    }
                    if (value == "00") {
                        //$('#areaSel-result').hide();
                        $('#county').html('<option value="00">区(县)</option>');
                    }
                }
            },
            changeCity: function (value) {

                var provinceId = $('#province').val();

                if (value && provinceId) {
                    var countyList = this.getCounty(provinceId, value);
                    if (countyList && countyList.length > 0) {
                        $('#county').html(this.render(countyList));
                        // $('#areaSel-result').html($('#province option:checked').text() + $('#city option:checked').text() + $('#county option:checked').text());
                    } else {
                        $('#county').html('<option value="00">区(县)</option>');
                    }
                    if (provinceId != "00" && !countyList) {
                        $('#county').parent().hide();
                        //$('#areaSel-result').html($('#province option:checked').text() + $('#city option:checked').text());
                    } else {
                        $('#county').parent().show();
                    }

                }
                ;
            },
            changeCounty: function (value) {
                //$('#areaSel-result').html($('#province option:checked').text() + $('#city option:checked').text() + $('#county option:checked').text());
            },
            addEventForArea: function () {
                var that = this;
                $('#province').change(function (e) {
                    var value = this.value;
                    that.changeProvince(value);
                });
                $('#city').change(function (e) {
                    var value = this.value;
                    that.changeCity(value);
                });
                $('#county').change(function (e) {
                    var value = this.value;
                    that.changeCounty(value);
                });

            },
            getCity: function (id) {
                for (var i = 0, len = this.data.length; i < len; i++) {
                    if (this.data[i].id == id) {
                        return this.data[i].cityList;
                    }
                }
            },
            getCounty: function (provinceId, cityId) {
                for (var i = 0, len = this.data.length; i < len; i++) {
                    if (this.data[i].id == provinceId) {
                        var cityList = this.data[i].cityList;
                        if (cityList.length <= 0) {
                            return null;
                        }
                        var j = 0, jlen = cityList.length;
                        for (; j < jlen; j++) {
                            if (cityList[j].id == cityId) {
                                return cityList[j].countyList;
                            }
                        }

                    }
                }
            }
        };

        function tips(classId, msg) {
            $('.' + classId).html(msg);
            $('.' + classId).animate({
                height: '30px'
            });
            setTimeout(function() {
                $('.' + classId).animate({
                    height: '0px'
                });
            }, 2000);
        }

        function addAddress() {
            var province = $('#province').val(),
                city = $('#city').val(),
                county = $('#county').val(),
                provinceName =  $('#province option:selected').text(),
                cityName = $('#city option:selected').text(),
                countyName = $('#county option:selected').text();
            if (!province || province == '00') {
                tips('form-first', '请选择省份');
                return;
            }
            if (!city || city == '00') {
                tips('form-first', '请选择市');
                return;
            }
            if (!county || county == '00') {
                tips('form-first', '请选择区(县)');
                return;
            }
            var detailAddress = $('#detail_address').val();
            if (!detailAddress) {
                tips('form-five', '详细地址不能为空');
                return;
            }
            var regPost = /^[0-9][0-9]{5}$/;
            var postalcode = $('#postalcode').val();
            if (postalcode && !regPost.test(postalcode)) {
                tips('form-four', '邮政编码格式错误');
                return;
            }
            var consignee = $('#consignee').val();
            if (consignee.length > 20 || consignee.length <= 0) {
                tips('form-two', '收货人长度不超过20个字符,且不为空');
                return;
            }

            var phone = $('#phone').val();
            var regMobile = /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/;
            var mobileResult = regMobile.test(phone);
            if (mobileResult == false) {
                tips('form-second', '手机号有误,请重新输入');
                return;
            }

            var address = provinceName + cityName + countyName + '&' + detailAddress;
            util.ajaxFun(util.INTERFACE_URL.addUserGoodsAddress, 'post', {
                receivingAddress: address,
                contactPhone: phone,
                contactName: consignee,
                provinceId:province,
                cityId:city,
                countyId:county,
                postCode:postalcode
            }, function (ret) {
                if ('0000000' === ret.rtnCode) {
                    $('.add-or-update-address').removeClass('hidden');
                    var html = [];
                    html.push('<div class="detail-address">寄送至：</div>');
                    html.push('<div class="detail-address">' + address.replace('&','') + '&nbsp;&nbsp;(' + consignee + '&nbsp;收)&nbsp;&nbsp;' + phone + '</div>');
                    $('#address').html(html.join(''));
                    $('#dialogModal,.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                } else {
                    tips('form-second', ret.msg || '保存收货地址失败');
                }
            });
        }

        function addOrUpdateAddress() {
            dialog('添加收货地址', $('#add_update_address').html());
            util.ajaxFun(util.INTERFACE_URL.getUserGoodsAddress, 'GET', {}, function (res) {
                if (res.rtnCode == '0000000') {
                    var bizData = res.bizData;
                    if (bizData && bizData.receivingAddress) {
                        $('#postalcode').val(bizData.postCode);
                        $('#detail_address').val(bizData.receivingAddress.split('&')[1] || '');
                        $('#consignee').val(bizData.contactName);
                        $('#phone').val(bizData.contactPhone);
                        Area.init(bizData.provinceId, bizData.cityId, bizData.countyId);
                        Area.addEventForArea();
                    } else {
                        Area.init();
                        Area.addEventForArea();
                    }
                }
            });
            $('.btn-danger').off('click');
            $('.btn-danger').on('click', function() {
                addAddress();
            });
        }



        function refreshOrderBoard() {

          if (orderInfo.payStatus == 1) {
            window.location.href='/user-order.html';
          } else {
            var $containers = $('#order-content span');
            $containers.eq(0).html( orderInfo.productName);
            $containers.eq(1).html( '订单编号：' + orderInfo.orderNo);
            $containers.eq(2).html( '创建时间：' + formateTimestamp (orderInfo.createDate));
            $containers.eq(3).html( '价格：' + orderInfo.unitPrice + '元/套');
            $containers.eq(4).html( '购买数量：' + orderInfo.productNum + '套');
            //$containers.eq(5).html( '取货地址：' + orderInfo.receivingAddress.replace('&', '') /*+ '(' + orderInfo.contactPhoneNumber + ')'*/ );
            $('#order-content div').html( '应付总价：' + orderInfo.amount + '元');





            if (orderInfo.payMethod === 'alipay')
            {
              $('#paymethod-btn-alipay').attr('class', 'pay-alipay-btn-active');
                $('#paymethod-btn-alipay').css("background", 'url(' + paymethodBtnAlipay + ') center 50px no-repeat, url(' + paymethodBtnAlipayActive + ') center 115px no-repeat')
                    .css('border', '1px solid #d80c18');
            }
            else
            {
              $('#paymethod-btn-alipay').attr('class', 'pay-alipay-btn');
                $('#paymethod-btn-alipay').css("background", 'url(' + paymethodBtnAlipay + ') center 50px no-repeat')
                    .css('border', '0');
            }
            if (orderInfo.payMethod === 'wechart')
            {
              $('#paymethod-btn-wechart').attr('class', 'pay-wechart-btn-active');
                $('#paymethod-btn-wechart').css("background", 'url(' + paymethodBtnWechart + ') center 50px no-repeat, url(' + paymethodBtnWechartActive + ') center 115px no-repeat')
                    .css('border', '1px solid #d80c18');
            }
            else
            {
              $('#paymethod-btn-wechart').attr('class', 'pay-wechart-btn');
                $('#paymethod-btn-wechart').css("background", 'url(' + paymethodBtnWechart + ') center 50px no-repeat')
                    .css('border', '0');
            }

            $('#wechart-price-title').html( '支付' + orderInfo.amount + '元');

            if( orderInfo.payMethod) {
              $('#btn-pay-submit').removeAttr('disabled');
            }
          }
        }

        function payMethodChange( e) {
          //orderInfo.payMethod = 'alipay';
          var id = $(e.target).attr("id");
          var para = id.split('-');
          if( orderInfo.payMethod != para[2]) {
            orderInfo.payMethod = para[2];
            refreshOrderBoard();
          }
        }

        function conductPayment() {
          if( orderInfo.payMethod === 'wechart') {
            conductWechartPayment();
            listeningPayStatus();
            $('#btn-pay-submit').attr('disabled', 'disabled');
          } else if ( orderInfo.payMethod === 'alipay') {
            conductAlipayPayment();
            listeningPayStatus();
            $('#btn-pay-submit').attr('disabled', 'disabled');
          }
        }

        function conductAlipayPayment() {
          util.ajaxFun( util.INTERFACE_URL.aliOrderPay, 'GET', { orderNo: orderID}, function(res){
            console.log( res);
            if (res.rtnCode == '0000000') {
              var charge = res.bizData;
              charge.credential = $.parseJSON( charge.credential);
              pingppPc.createPayment(charge, function(result, err){
                console.log( result, err, charge);
              });
            } else {
              util.checkLoginTimeout(res);
              if( res.rtnCode != '1000004') {
                window.location.href='/user-order.html';
              }
            }
          });
        }

        function conductWechartPayment() {
          wechartQRCount = 300;
          $('#QRCountdown').parent().html( '<span id="QRCountdown">300秒</span>后此二维码过期');
          var token = util.cookie.getCookieValue('token');
          var QRurl = util.INTERFACE_URL.wxOrderPay + '?token=' + token + '&orderNo=' + orderID + '&misc' + new Date().getTime();
          $('#wechartPayWindow').modal('hide');
          $('#wechart-qr-image').attr('src', QRurl);
          $('#wechart-qr-image').next().attr('class', '');
          $('#wechartPayWindow').modal('show');
          startWechartCounter();
        }

        function startWechartCounter() {
          var status = $('#wechartPayWindow').attr('class');
          if( status.match('in')) {
            if( wechartQRCount > 0) {
              wechartCounter = window.setTimeout( startWechartCounter, 1000);
              wechartQRCount--;
              $('#QRCountdown').html( wechartQRCount + '秒');
            } else {
              $('#QRCountdown').parent().html( '<span id="QRCountdown">二维码已过期，请重新获取二维码</span>');
              $('#wechart-qr-image').next().attr('class', 'show');
            }
          } else {
            $('#btn-pay-submit').removeAttr('disabled');
          }
        }

        function listeningPayStatus() {
          util.ajaxFun( util.INTERFACE_URL.getOrderInfo, 'GET', { orderNo: orderID}, function(res){
            if (res.rtnCode == '0000000') {
              if( res.bizData.payStatus == 1 ) {
                window.clearTimeout(payStatusListener);
                window.location.href='/user-order.html';
              } else {
                window.clearTimeout(payStatusListener);
                payStatusListener = window.setTimeout( listeningPayStatus, 5000);
              }
            }
          });
          window.clearTimeout(payStatusListener);
          payStatusListener = window.setTimeout( listeningPayStatus, 5000);
        }

        function formateTimestamp ( timestamp) {
          var date =  new Date(parseInt(timestamp));
          return date.getFullYear() + '-' + addZero( date.getMonth()+ 1 ) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero( date.getMinutes()) + ':' + addZero(date.getSeconds());
        }

        function addZero( int) {
          return ( int > 9 ) ? int : '0'+int;
        }

        //orderInfo.payMethod = 'alipay';
        $(document)
            .on( 'click', '[id|="paymethod-btn"]', payMethodChange)
            .on( 'click', '#btn-reload-qr', conductWechartPayment)
            .on( 'click', '#btn-pay-submit', conductPayment);
        $('.add-or-update-address').on('click', function() {
            addOrUpdateAddress();
        });




    });

});
