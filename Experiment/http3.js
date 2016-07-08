var http = require('http');
var server = http.createServer();
var url = require('url');
server.on('request', function(req, res) {
    console.info('有客户端访问了');
    var urls = url.parse(req.url);
    console.info(urls);
    res.writeHead(200, 'pdeng', {
        "content-type": 'text/html;charset=utf-8'
    });
    switch (req.url) {
        case "/":
            res.write('<h1>index</h1>');
            break;
        case "/news":
            res.write('<h1>news</h1>');
            break;
        default:
            res.write("<h1>i don't known</h1>");
            break;
    }
    res.end();
});
server.listen(8080);
server.on('listening', function() {
    console.info('服务开启中：' + server.address().address + ':' + server.address().port);
});
server.setTimeout(12000);
