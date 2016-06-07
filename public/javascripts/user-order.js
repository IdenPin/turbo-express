define(['commonjs', 'handlebars', 'timeFormat'], function (util, handlebars, getTime) {
    require('../css/user/user-order.css');
    var dialog = require('dialog');
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

        $('.order-nav-list li').on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            showOrderListByType();
        });

        var orderListData = {};
        var orderListAllData = [];

        function showOrderListByType() {
            var data = [];
            var type = $('.order-nav-list li.active').attr('data-type');
            if (type == '-99') {
                data = orderListAllData;
            } else {
                data = orderListData[type] || [];
            }
            if(data.length>0){
                handlebars.registerHelper('formatDate', function (date) {
                    return getTime(date);
                });
                handlebars.registerHelper('status', function (status) {
                    var statusClass = '';
                    status = parseInt(status);
                    switch (status) {
                        case 0:
                            statusClass = '';
                            break;
                        case 1:
                            statusClass = 'order-already';
                            break;
                        case 2:
                            statusClass = 'order-overdue';
                            break;
                        case 3:
                            statusClass = 'already-shipped';
                            break;
                        default:
                            break;
                    }
                    return statusClass;
                });
                handlebars.registerHelper('compare', function(left, operator, right, options) {
                    if (arguments.length < 3) {
                        throw new Error('Handlerbars Helper "compare" needs 2 parameters');
                    }
                    var operators = {
                        '==':     function(l, r) {return l == r; },
                        '===':    function(l, r) {return l === r; },
                        '!=':     function(l, r) {return l != r; },
                        '!==':    function(l, r) {return l !== r; },
                        '<':      function(l, r) {return l < r; },
                        '>':      function(l, r) {return l > r; },
                        '<=':     function(l, r) {return l <= r; },
                        '>=':     function(l, r) {return l >= r; },
                        'typeof': function(l, r) {return typeof l == r; }
                    };

                    if (!operators[operator]) {
                        throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
                    }

                    var result = operators[operator](left, right);

                    if (result) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                });
                var template = handlebars.compile($('#temp-order-list').html());
                var res = {};
                res.bizData = [];
                res.bizData = data;
                $('#order-list-content').html(template(res));
            }else{
                $('.my-order .info').hide();
                $('#order-list-content').html('<p class="no-order">暂无订单</p>');
            }

        }

       function getOrderListByType() {
            // 拉取订单
            util.ajaxFun(util.INTERFACE_URL.getOrderList, 'get', {}, function (res) {
                console.log(res);
                if (res.rtnCode == '0000000') {
                    orderListAllData = res.bizData;
                    for (var i = 0, len = res.bizData.length; i < len; i++) {
                        if (!orderListData[res.bizData[i].payStatus]) {
                            orderListData[res.bizData[i].payStatus] = [];
                        }
                        orderListData[res.bizData[i].payStatus].push(res.bizData[i]);
                    }
                    showOrderListByType();
                }
            });
        }
        getOrderListByType();
        // 获取代理商地址
        util.ajaxFun(util.INTERFACE_URL.getAgentInfo, 'get', {}, function (res) {
            if (res.rtnCode == '0000000') {
                $('#departmentPhone').text(res.bizData.departmentPhone);
                $('#goodsAddress').text(res.bizData.goodsAddress);
            }
        });
        // 删除订单
        $('#order-list-content').on('click', 'span.cancel', function () {
            var thisOrderNo = $(this).attr('orderno');
            var cancelOrderHtml = ''
                + '    <form class="form-horizontal modify-pwd-form">'
                    +'<div class="cancel-order-txt">' +
                '<p>确定删除该笔订单吗？</p>' +
                '</div>'
                + '<div class="form-group modify-pwd-btn-box">'
                + '<div class="col-sm-12">'
                + '        <button class="btn btn-primary cancel-btn" thisOrderNo="'+ thisOrderNo +'" type="button" id="cancel-btn">确定</button>'
                + '    </div>'
                + '    </div>'
                + '    </form>';
            dialog('删除订单', cancelOrderHtml);
            $('body').on('click', '#cancel-btn', function () {
                var thisOrder = $(this).attr('thisOrderNo');
                var _this = $(this);
                util.ajaxFun(util.INTERFACE_URL.getRemoveOrder, 'get', {
                    orderNo : thisOrder
                }, function (res) {
                    if (res.rtnCode == '0000000') {
                        _this.parent('.order-list').remove();
                        window.location.href = 'http://' + window.location.host + '/user-order.html';
                    }
                });
            });
        });


    });


});



