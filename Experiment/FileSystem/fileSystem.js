/*
 * fs 模块
 * fs.open(path,flags,[mode],callback)
 * path:要打开文件路径
 * flags:打开文件的方式 读/写
 * mode:设置文件的模式 读/写/执行/  4/2/1
 * callback:回调
 *      err:打开文件失败,如果成功err为null
 *      fd:被打开的表示,和定时器类似,标示符号
 * */
var fs = require('fs');

fs.open('../http/http.js','r',function(err,fd){
    if(err){
        console.info('失败')
    }else{
        console.info(fd);
    }
})

//var data = fs.openSync('../http/test.html','r');
//console.info(data)


fs.open('../http/http0.js','r',function(err,fd){
    console.info(fd);
})