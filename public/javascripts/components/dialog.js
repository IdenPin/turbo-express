require('bootstrapJs');
var dialog = function (title, body, isFooter) {
    var dialogModalArr = [];
    dialogModalArr.push('<div class="modal fade" id="dialogModal" tabindex="-1" role="dialog" aria-labelledby="dialogModalLabel" data-keyboard="false">');
    dialogModalArr.push('<div class="modal-dialog" role="document">');
    dialogModalArr.push('<div class="modal-content">');
    dialogModalArr.push('<div class="modal-header">');
    dialogModalArr.push('<button type="button" class="close-btn dialogModal-close-btn  icon-close-btn" data-dismiss="modal" aria-label="Close" data-keyboard="false"><span aria-hidden="true"></span></button>');
    dialogModalArr.push('<h4 class="modal-title" id="dialogModalLabel" style="color:#d80c18">' + title + '</h4>');
    dialogModalArr.push('</div>');
    dialogModalArr.push('<div class="modal-body">');
    dialogModalArr.push(body);
    dialogModalArr.push('</div>');
    if (isFooter) {
        dialogModalArr.push('<div class="modal-footer">');
        dialogModalArr.push('<button type="button" class="btn btn-default" data-dismiss="modal" >关闭</button>');
        dialogModalArr.push('<button type="button" class="btn btn-primary">确定</button>');
        dialogModalArr.push('</div>');
    }
    dialogModalArr.push('</div>');
    dialogModalArr.push('</div>');
    dialogModalArr.push('</div>');
    $('body').append(dialogModalArr.join(''));

    $(".dialogModal-close-btn").click(function(){
    //$('body').on('click', '.dialogModal-close-btn', function () {
        $('#dialogModal,.modal-backdrop').remove();
        $('body').removeClass('modal-open');
    });


};
module.exports = dialog;