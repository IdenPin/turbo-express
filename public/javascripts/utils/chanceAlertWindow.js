define( ['bootstrapJs'], function () {
  var dialogModalArr = [];
  var title = '';
  var body = '请填写真实分数<span class="dh">和位次</span>，提交后不可更改，<br/>确定要进行填报吗？';
  var isFooter = true;
  var windowTop = ( $(window).height() - 330 ) / 2;
  dialogModalArr.push('<div class="modal fade" id="chanceAlertWindow" tabindex="-1" role="dialog" aria-labelledby="" data-keyboard="false">');
  dialogModalArr.push('<div class="modal-dialog" role="document" style="width: 500px; height: 330px; margin-top: '+ windowTop +'px">');
  dialogModalArr.push('<div class="modal-content" style="border-radius: 10px; padding: 60px 60px; height: 330px;">');
  //dialogModalArr.push('<div class="modal-header">');
  //dialogModalArr.push('<button type="button" class="close-btn dialogModal-close-btn  icon-close-btn" data-dismiss="modal" aria-label="Close" data-keyboard="false"><span aria-hidden="true"></span></button>');
  //dialogModalArr.push('<h4 class="modal-title" id="dialogModalLabel" style="color:#d80c18">' + title + '</h4>');
  //dialogModalArr.push('</div>');
  dialogModalArr.push('<div class="modal-body" style="line-height: 36px; font-weight: 700; font-size: 18px; color:#999999; height:180px; padding-top: 40px; text-align: center;">');
  dialogModalArr.push(body);
  dialogModalArr.push('</div>');
  if (isFooter) {
      //dialogModalArr.push('<div class="modal-footer">');
      //dialogModalArr.push('<button type="button" class="btn btn-default" data-dismiss="modal" >关闭</button>');
      dialogModalArr.push('<button id="chanceAlertWindow-submit-btn" type="button" class="btn btn-success btn-start" style="width: 45%; height: 36px; line-height: 36px; padding: 0; border-radius: 30px; border: none; outline: 0; font-weight: 700; font-size: 1pc; marign: 0px 5%;">确定</button>');
      dialogModalArr.push('<button id="chanceAlertWindow-cancel-btn" type="button" class="btn btn-success btn-start" style="width: 45%; height: 36px; line-height: 36px; padding: 0; border-radius: 30px; border: 1px solid #CCCCCC; outline: 0; font-weight: 700; font-size: 1pc; background-color:#FFFFFF; color:#999999; float:right;">取消</button>');
      //dialogModalArr.push('</div>');
  }
  dialogModalArr.push('</div>');
  dialogModalArr.push('</div>');
  dialogModalArr.push('</div>');
  $('body').append(dialogModalArr.join(''));

  /*$("#chanceAlertWindow-submit-btn").click(function(){

  });*/
  $("#chanceAlertWindow-cancel-btn").click(function(){
      $('#chanceAlertWindow').modal('hide');
  });
});
