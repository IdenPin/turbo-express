var http = require('http');
var server = http.createServer();
server.listen(8080);
server.on('error', function(err) {
    console.info(err);
});
server.on('listening', function() {
    console.info('listening at ' + server.address().address + ':' + server.address().port);
});
server.on('request',function(){
    console.info('有客户端正在请求...');
});
