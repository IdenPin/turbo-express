var fs = require('fs');

//1.打开文件,2.读取文件

var bf1 = new Buffer('123456');
console.info(bf1);
fs.open('test.txt','r',function(err,fd){
    if(err){
        console.info(err)
    }else{
        fs.read(fd,bf1,1,5,null,function(err,fs){
            console.info(bf1.toString());
        })
    }
})
