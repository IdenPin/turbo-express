var http = require('http');
var server = http.createServer(function(req, res) {
    console.info('有客户端正在请求...');
    res.setHeader('pdeng','24');
    res.writeHead(200,'pdeng',{
      'content-type':'text/html;charset=utf-8'
      // 'content-type':'text/plain'
    });
    res.write("<h1>hello nodejs</h1>/n");
    res.end();
});

//console.info(http.STATUS_CODES);//http Code
server.listen(8080);
server.on('error', function(err) {
    console.info(err);
});
server.setTimeout(12000); //设置timeout时间
server.on('listening', function() {
    console.info('listening at ' + server.address().address + ':' + server.address().port);
});
