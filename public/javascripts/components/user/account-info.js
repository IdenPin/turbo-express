var util = require('commonjs');
require('bootstrapJs');
require('uploadify');
require('uploadifyCss');


$(function () {
     //获取用户信息
    util.ajaxFun(util.INTERFACE_URL.getUserInfo, 'GET', {}, function (res) {
        console.log(res);
        if (res.rtnCode == '0000000') {
            var personListData = res.bizData;
            var avatar = '';
            if (personListData.icon === '' || personListData.icon === null) {
                avatar = 'http://cdn.gaokao360.net/static/global/common/images/icon_default.png';
            } else {
                avatar = personListData.icon;
            };
            $('#avatar-img').attr('src', avatar);
            $('#user-name').val(personListData.name);
            $('#school-name').val(personListData.schoolName);
            $('#user-birthday').val(personListData.birthdayDate ? util.getTime(personListData.birthdayDate,'yyyy-MM-dd') : '1970-01-01');
            $('input[name="sex"][value="'+ personListData.sex +'"]').attr('checked',true);
            $('input[name="subject"][value="'+ personListData.subjectType +'"]').attr('checked',true);
            $('#user-email').val(personListData.mail);
            $('#user-qq').val(personListData.qq);
            Area.init(personListData);
            Area.addEventForArea();
        }
    });

    //省市地区
    var province = '';
    var city = '';
    var county = '';
    var Area = {
        data: [],
        init: function (personListData) {
            var that = this;
            util.ajaxFun(util.INTERFACE_URL.getAllRegion, 'GET', {}, function (ret) {
                if ('0000000' === ret.rtnCode) {
                    that.data = ret.bizData;
                    $('#province').html(that.render(that.data, true));
                    if (personListData.provinceId) {
                        $('#province').val(personListData.provinceId);
                        that.changeProvince(personListData.provinceId);
                        $('#city').val(personListData.cityId);
                        that.changeCity(personListData.cityId);
                        $('#county').val(personListData.countyId);
                    }
                }else{
                    util.tips('#tips',res.msg);
                };
            });
        },
        render: function (data, flag) {
            var html = [];
            if (flag) {
                html.push('<option>请选择...</option>');
            }
            $.each(data, function (i, value) {
                html.push('<option value="' + value.id + '">' + value.name + '</option>');
            });
            return html.join('');
        },
        changeProvince: function (value) {
            if (value) {
                var city = this.getCity(value);
                if (city && city.length > 0) {
                    $('#city').html(this.render(city));
                    this.changeCity(city[0].id);
                } else {
                    $('#city').html('<option>请选择...</option>');
                }
            }
        },
        changeCity: function (value) {
            var provinceId = $('#province').val();
            if (value && provinceId) {
                var countyList = this.getCounty(provinceId, value);
                if (countyList && countyList.length > 0) {
                    $('#county').html(this.render(countyList));
                } else {
                    $('#county').html('<option>请选择...</option>');
                }
            }
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

    function transdate(endTime){
        var date=new Date();
        date.setFullYear(endTime.substring(0,4));
        date.setMonth(endTime.substring(5,7)-1);
        date.setDate(endTime.substring(8,10));
        date.setHours(endTime.substring(11,13));
        date.setMinutes(endTime.substring(14,16));
        date.setSeconds(endTime.substring(17,19));
        return Date.parse(date)/1000;
    }




    // 登录提交
    $('#submit-btn').on('click', function () {
        //修改信息
        var sex = $('input[name="sex"]:checked').val(),
            subject = $('input[name="subject"]:checked').val(),
            school = $.trim($('#school-name').val()),
            str = $.trim($('#user-birthday').val()),
            birthdayDate = transdate(str),
            name = $.trim($('#user-name').val()); // 用户名
        if (name.length === 0) {
            util.tips('#tips','用户名不能为空');
            return false;
        };
        if (name.length > 10) {
            util.tips('#tips','用户名不能大于10个字');
            return false;
        };
        if( school.length===0){
            util.tips('#tips','学校名不能为空');
            return false;
        };
        if( school.length>20){
            util.tips('#tips','学校名不能大于20个字');
            return false;
        };
        var qq = $.trim($('#user-qq').val());
        var mail = $.trim($('#user-email').val());

        if (qq.length !== 0 || mail.length != 0) {
            var mail_reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (!mail_reg.test(mail)) {
                util.tips('#tips','邮箱填写有误');
                return false;
            }
            var qq_reg = /^\s*[.0-9]{5,11}\s*$/;
            if (!qq_reg.test(qq) || qq.length > 20) {
                util.tips('#tips','QQ号码输入有误');
                return false;
            }
        }
        var img_url = $('#avatar-img ').attr('src');

        var provinceId = $('#province').val(),
            cityId = $('#city').val(),
            countyId = $('#county').val();
        util.ajaxFun(util.INTERFACE_URL.postUpdateUserInfo, 'POST', {
            name: name,
            schoolName: school,
            sex: sex,
            birthdayDate: birthdayDate,
            subjectType: subject,
            mail: mail,
            icon: img_url,
            qq: qq
        }, function (res) {
            console.log(res)
            if (res.rtnCode == '0000000') {
                util.tips('#tips','信息更新成功');
                window.location.href="/user/personal-info.jsp";
            }else{
                util.tips('#tips',res.msg);
            }
        });
    });

});



var errorCodes = ["-100", "-110", "-120", "-130"];
var errorMsgs = ["文件数量不能超过(5)", "文件超过大小限制(10MB)", "零字节的文件", "无效的文件类型"];
$("#uploadify").uploadify({
    'debug' : false,
    'swf': '../../../lib/uploadify/uploadify.swf',
    'fileObjName': 'file',
    'uploader': "http://pre.file.xy189.cn/file/upload/savefile.shtml",
    'auto': true,
    'removeTimeout': 0,
    'multi': false,
    'uploadLimit': 0,
    'fileSizeLimit': "10MB",
    'fileTypeDesc': '图片文件(*.jpg;*.png;*.gif;*.jpeg)',
    'buttonText': '点击上传',
    'fileTypeExts': "*.jpg;*.png;*.gif;*.jpeg",
    'progressData': 'percentage',
    'speed': 'percentage',
    'queueSizeLimit': 5,
    'removeCompleted': true,
    'onSelect': function (file) {

        this.queueData.filesErrored = 0;
    },
    'onOpen': function (event, ID, fileObj) {
    },
    'onSelectError': function (file, errorCode, errorMsg) {

        for (var i = 0; i < errorCodes.length; i++) {
            if (errorCodes[i] == errorCode) {
                this.queueData.errorMsg = errorMsgs[i];
            }
        }
    },
    'onCancel': function (file) {
        //alert(file.name);
    },
    'onFallback': function () {
        alert("浏览器不能兼容Flash,请下载最新版!");
    },
    'onClearQueue': function (queueItemCount) {
    },
    'onUploadStart': function (file) {
        console.log(file)
    },
    'onUploadSuccess': function (file, data, response) {
        //获取到data处理
        var obj = JSON.parse(data);
        var data = {'userIcon': obj.data.url};
        $('.avatar-img').attr('src', obj.data.url);
        var id = this.wrapper.selector;
        $(id).uploadify('settings', 'buttonText', '正在加载');
        $("img[data-icon]").each(function () {
            $(this).attr("src", obj.data.url + "!100?t=" + new Date().getTime());
        });
        $(id).uploadify('settings', 'buttonText', '换一个');
    },
    'onUploadError': function (file, errorCode, errorMsg, errorString) {
        switch (errorMsg) {
            case '400':
                $('#' + file.id).find('.data').html(" - 上传失败，文件超过大小限制(2MB)");
                break;
            case '401':
                $('#' + file.id).find('.data').html(" - 上传失败，零字节的文件");
                break;
            case '402':
                $('#' + file.id).find('.data').html(" - 上传失败，无效的文件类型");
                break;
            case '500':
                $('#' + file.id).find('.data').html(" - 上传失败，服务器问题");
                break;
        }
    },
    'onDialogClose': function (queueDat) {
    }
});