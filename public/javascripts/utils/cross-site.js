/**
 * Created by douzy on 16/4/21.
 */

function fMain(result){
    alert(result);
}
function crossSite(params,pannel,action) {
    this.IFrameName = "cross_iframe"
    this.FormName = "cross_form"
    this.SubmitName = "cross_submit"
    this.InputParam = params
    this.pannel = $("#"+pannel)
    this.FrameAction=action;
}

crossSite.prototype.init=function() {
    var self = this;
    self.fullHtml();
    self.submitBtnEve();
}
/**
 * 填充
 */
crossSite.prototype.fullHtml=function() {
    var self = this;
    self.pannel.html("");
    console.log(0);
    self.pannel.append(self.createIframe());
    console.log(0);
    self.pannel.append(self.createForm());
    console.log(0);
}
/**
 * 创建动态参数
 */
crossSite.prototype.createInput=function() {
    var self = this;
    var inputHtml = "<input type='hidden' name='{0}' value='{1}' />";
    var result = new Array();
    console.log(self.InputParam);
    $.each(self.InputParam, function (i) {
        var paramObj = self.InputParam[i];
        result.push(self.stringFormat(inputHtml, paramObj.name, paramObj.value));
    });
    return result.join("");
}
/**
 * 创建动态提交表单
 */
crossSite.prototype.createForm=function() {
    var self = this;
    var formHtml = '<form id="{0}" name="{0}" style="display: none" method="post">{1}<input type="submit" name="{2}" id="{2}" /></form>';

    return self.stringFormat(formHtml, self.FormName, self.createInput(),self.SubmitName);
}
/**
 * 创建动态IFrame
 */
crossSite.prototype.createIframe=function() {
    var self = this;
    var IFrmHtml='<iframe id="{0}" name="{0}" width="1" height="1" style="display:none"></iframe>';
    return self.stringFormat(IFrmHtml,self.IFrameName);
}
/**
 * 提交事件绑定
 */
crossSite.prototype.submitBtnEve=function() {
    var self = this;
    var $IFrmPan = $("#" + self.IFrameName),
        $FrmObj = $("#" + self.FormName);

    $FrmObj.prop("action", self.FrameAction);
    $FrmObj.prop("target", self.IFrameName);
    $FrmObj.submit();
    console.log($IFrmPan.attachEvent);
    if ($IFrmPan.attachEvent) {
        $IFrmPan.attachEvent("onload", function () {
            var str = $IFrmPan.contentWindow;
            $IFrmPan.src = "about:blank";
            $IFrmPan.detachEvent("onload", arguments.callee);
        });
    } else {
        $IFrmPan.load(function () {
            console.log($IFrmPan.contents().find("body").html());
            $IFrmPan.prop("src","about:blank");
            $IFrmPan.load = null;
        });
    }
}
/**
 * 字符串格式化
 * @returns {*}
 */
crossSite.prototype.stringFormat = function () {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}


module.exports=crossSite;