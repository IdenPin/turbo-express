var fs = require('fs');

//1.打开文件,2.写入
var bf = new Buffer('123');
fs.open('test.txt','r+',function(err,fd){
    if(err){
        console.info('文件打开失败')
    }else{
        fs.write(fd,'1234',6,'utf-8',function(err,data){
            console.info(data);
        })
        fs.close(fd,function(err,data){
            console.info('关闭')
        })
    }
})