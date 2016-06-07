


function noDataTips(tips){
    var tipsImg = require('../../img/not-find-img.png');
    var msgTips = '<div class="msg-tips"><img src="' + tipsImg + '" class="no-data-img"/> <span class="tips-txt">(ﾟ∀ﾟ) '+ tips +'</span></div>';
    return msgTips;
}

module.exports = noDataTips;