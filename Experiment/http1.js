var http = require('http');
var server = http.createServer(function(req, res) {
    console.info('有客户端正在请求...');
    console.info(res);
});
server.listen(8080);
server.on('error', function(err) {
    console.info(err);
});
server.setTimeout(12000);
server.on('listening', function() {
    console.info('listening at ' + server.address().address + ':' + server.address().port);
});
