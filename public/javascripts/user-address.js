define(['commonjs', 'handlebars', 'timeFormat'], function (util, handlebars, getTime) {
    require('../css/user/user-address.css');
    $(function () {
        $('#banner-info').prepend(require('html!../user-banner.html'));

        var cookie = require('cookie');
        var icon = cookie.getCookieValue('icon');
        var imgIco = require('../img/icon_default.png');
        if (icon == 'undefined') {
            icon = imgIco;
        }
        var userName = cookie.getCookieValue('userName');
        var vipStatus = cookie.getCookieValue('vipStatus');
        $('.user-avatar').attr('src', icon);
        $('.user-name').text(userName);
        if (vipStatus == 0) {
            $('#btn-vip,#user-type').show();
            $('#vip-box').hide();
        } else {
            $('#btn-vip,#user-type').hide();
            $('#vip-box').show();
        }

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

        getUserGoodsAddress();

        function getUserGoodsAddress() {
            util.ajaxFun(util.INTERFACE_URL.getUserGoodsAddress, 'GET', {}, function (res) {
                if (res.rtnCode == '0000000') {
                    var bizData = res.bizData;
                    if (bizData && bizData.receivingAddress) {
                        $('.save-or-update').addClass('hidden');
                        var addressObj = {
                            address: bizData.receivingAddress.split('&')[0],
                            detailAddress: bizData.receivingAddress.split('&')[1],
                            postCode: bizData.postCode,
                            contactName: bizData.contactName,
                            contactPhone: bizData.contactPhone
                        };
                        var source = $('#show_address_tmpl').html();
                        var template = handlebars.compile(source);
                        $('.show-address').html(template(addressObj));
                        $('.show-address').removeClass('hidden');
                        //alert(bizData.provinceId + ", " + bizData.cityId + ", " + bizData.countyId);
                        $(".address-item").eq(0).attr("provinceId", bizData.provinceId);
                        $(".address-item").eq(0).attr("cityId", bizData.cityId);
                        $(".address-item").eq(0).attr("countyId", bizData.countyId);
                        //$('#update-address').off('click');
                        $(document).on('click', "#update-address", function() {
                            //alert("客户端页面的数据: " + $(".address-item").eq(2).find("span").html());
                            //alert("服务器返回的数据: " + bizData.postCode);
                            //$('#postalcode').val(bizData.postCode);
                            $('#postalcode').val($(".address-item").eq(2).find("span").html());
                            //alert("详细地址: " + $(".address-item").eq(1).find("span").html());
                            //$('#detail_address').val(bizData.receivingAddress.split('&')[1] || '');
                            $('#detail_address').val($(".address-item").eq(1).find("span").html());
                            //$('#consignee').val(bizData.contactName);
                            $('#consignee').val($(".address-item").eq(3).find("span").html());
                            //$('#phone').val(bizData.contactPhone);
                            $('#phone').val($(".address-item").eq(4).find("span").html());
                            $('.save-or-update').removeClass('hidden');
                            $('.show-address').addClass('hidden');
                            //Area.init(bizData.provinceId, bizData.cityId, bizData.countyId);
                            var provinceId = $(".address-item").eq(0).attr("provinceId");
                            var cityId = $(".address-item").eq(0).attr("cityId");
                            var countyId = $(".address-item").eq(0).attr("countyId");
                            //alert(provinceId + ", " + cityId + ", " + countyId);
                            Area.init(provinceId, cityId, countyId);
                            Area.addEventForArea();
                        });
                    } else {
                        $('.save-or-update').removeClass('hidden');
                        $('.show-address').addClass('hidden');
                        Area.init();
                        Area.addEventForArea();
                    }
                }
            });
        }

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
                    $('.save-or-update').addClass('hidden');
                    var addressObj = {
                        address: provinceName + cityName + countyName,
                        detailAddress: detailAddress,
                        postCode: postalcode,
                        contactName: consignee,
                        contactPhone: phone
                    };
                    var source = $('#show_address_tmpl').html();
                    var template = handlebars.compile(source);
                    $('.show-address').html(template(addressObj));
                    $('.show-address').removeClass('hidden');

                    $(".address-item").eq(0).attr("provinceId", province);
                    $(".address-item").eq(0).attr("cityId", city);
                    $(".address-item").eq(0).attr("countyId", county);
                } else {
                    tips('form-second', ret.msg || '保存收货地址失败');
                }
            });
        }
        $('.btn-danger').click(function() {
            addAddress();
        });
    });
});




