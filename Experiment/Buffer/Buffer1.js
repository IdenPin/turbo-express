//new Buffer(size);size[number] 创建一个Buffer对象,并为这个对象分配一个大小
//当我们为一个Buffer对象分配空间大小以后,其长度是固定的,不能更改
//var bf = new Buffer(5);
//console.info(bf);
//bf[1] = 2;
//console.info(bf);


var bf = new Buffer('pdeng','utf-8');
console.info( bf);
var str = '';
bf.forEach(function(v,i){
    //console.info(v.toString(16))
    str += String.fromCharCode(v);
})
console.info(str)

