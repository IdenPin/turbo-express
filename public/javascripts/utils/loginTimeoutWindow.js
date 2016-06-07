define( ['bootstrapJs'], function () {
  var dialogModalArr = [];
  var body = '';
  var isFooter = true;
  var windowTop = ( $(window).height() - 330 ) / 2;
  dialogModalArr.push('<div class="modal fade" id="loginTimeoutWindow" tabindex="-1" role="dialog" aria-labelledby="" data-keyboard="false">');
  dialogModalArr.push('<div class="modal-dialog" role="document" style="width: 500px; height: 330px; margin-top: '+ windowTop +'px">');
  dialogModalArr.push('<div class="modal-content" style="border-radius: 10px; padding: 60px 120px; height: 330px;">');
  //dialogModalArr.push('<div class="modal-header">');
  //dialogModalArr.push('<button type="button" class="close-btn dialogModal-close-btn  icon-close-btn" data-dismiss="modal" aria-label="Close" data-keyboard="false"><span aria-hidden="true"></span></button>');
  //dialogModalArr.push('<h4 class="modal-title" id="dialogModalLabel" style="color:#d80c18">' + title + '</h4>');
  //dialogModalArr.push('</div>');
  dialogModalArr.push('<div class="modal-body loginTimeoutWindow-body">');
  dialogModalArr.push(body);
  dialogModalArr.push('</div>');
  if (isFooter) {
      //dialogModalArr.push('<div class="modal-footer">');
      //dialogModalArr.push('<button type="button" class="btn btn-default" data-dismiss="modal" >关闭</button>');
      dialogModalArr.push('<button id="loginTimeoutWindow-jump-btn" type="button" class="btn btn-success btn-start" style="width: 100%; height: 36px; line-height: 36px; padding: 0; border-radius: 30px; border: none; outline: 0; font-weight: 700; font-size: 1pc;">重新登录</button>');
      //dialogModalArr.push('</div>');
  }
  dialogModalArr.push('</div>');
  dialogModalArr.push('</div>');
  dialogModalArr.push('</div>');
  $('body').append(dialogModalArr.join(''));

  $("#loginTimeoutWindow-jump-btn").click(function(){
    window.location.href = '/login.html';
  //$('body').on('click', '.dialogModal-close-btn', function () {
  //$('#dialogModal,.modal-backdrop').remove();
  //$('body').removeClass('modal-open');
  });
});
