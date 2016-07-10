//new Buffer(size);size[number] 创建一个Buffer对象,并为这个对象分配一个大小
//当我们为一个Buffer对象分配空间大小以后,其长度是固定的,不能更改
//var bf = new Buffer(5);
//console.info(bf);
//bf[1] = 2;
//console.info(bf);


//var bf = new Buffer('pdeng','utf-8');
//console.info( bf);
//var str = '';
//bf.forEach(function(v,i){
//    //console.info(v.toString(16))
//    str += String.fromCharCode(v);
//})
//console.info(str)

//var str = 'pdeng';
//var bf = new Buffer(5);
//bf.write(str,3);
//var a = '';
////bf.forEach(function(v,i){
////    a += String.fromCharCode(v);
////})
//console.info(a);



//var bf = new Buffer('时间');
//console.info(bf.toString('utf-8',0,6));
//console.info(bf.toJSON())

//var bf = new Buffer('pdeng');
//var bf2 = bf.slice(0,1);
//console.info(bf2)



//var bf = new Buffer('pdeng');
//var bf2 = new Buffer(10);
//bf.copy(bf2);
//console.info(bf.toJSON())
//console.info(bf2.toJSON())
//console.info(String.fromCharCode(bf2.toJSON().data[0]))


//var bf = new Buffer('pdeng')
//var bfLength = Buffer.byteLength(bf);
//console.info(bfLength);



//var bf = new Buffer('pdeng')
//console.info(Buffer.isBuffer(bf));

//var str1 = 'pdeng';
//var str2 = 'deng';
//var bfArry = [new Buffer(str1),new Buffer(str2)];
//var bf = Buffer.concat(bfArry);
//var a = '';
//bf.forEach(function(v,i){
//    a += String.fromCharCode(v);
//})
//console.info(a);


//buffer对象和字符串拼接会直接转换为字符串类型
process.stdout.write('请输入内容:')
process.stdin.resume();
process.stdin.on('data',function(chunk){
    console.info(String.fromCharCode(chunk[0]));
    //console.info('您输入的内容是:'+chunk);
})






