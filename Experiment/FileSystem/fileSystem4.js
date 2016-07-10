var fs = require('fs');

//创建文件夹
//fs.mkdir('./dir',function(){
//    console.info(arguments);
//})

//删除文件夹
//fs.rmdir('./dir',function(){
//    console.info(arguments)
//})

//读取文件夹内容
fs.readdir('../FileSystem', function (err, fileList) {
    fileList.forEach(function (v, i) {
        fs.stat(v, function (err, info) {
            switch (info.mode) {
                case 16877:
                    console.info('[文件夹]' + v)
                    break;
                case 33188:
                    console.info('[文件]' + v)
                    break;
                default:
                    console.info('[其他文件]' + v)
                    break;
            }
        })
    })
})