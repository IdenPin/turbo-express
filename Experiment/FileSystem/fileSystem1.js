var fs = require('fs');

//重命名
fs.rename('test.txt','1.txt',function(){
    console.info(arguments);
})

//读取文件状态信息

fs.stat('1.txt',function(){
    console.info(arguments);
})