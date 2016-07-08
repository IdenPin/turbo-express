var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

var server = http.createServer();
server.listen(8080);
var htmlDir = __dirname + '/html/';
server.on('request', function(req, res) {
    res.writeHead(200, {
        'content-type': 'text/html'
    });
    var urls = url.parse(req.url);
    switch (urls.pathname) {
        case "/":
            sendData(htmlDir + 'index.html', req, res);
            break;
        case "/news":
            sendData(htmlDir + 'news.html', req, res);
            break;
        case "/login":
            sendData(htmlDir + 'login.html', req, res);
            break;
        case "/login/check":
            if (req.method.toUpperCase() == "POST") {
                var str = '';
                req.on('data', function(chunk) {
                    str += chunk;
                });
                req.on('end', function() {
                    console.info(str);
                    console.info(querystring.parse(str));
                });
            }
            break;
        default:
            sendData(htmlDir + '404.html', req, res);
            break;
    }
    console.info('有客户端请求');
});
server.on('listening', function() {
    console.info('服务已启动：' + server.address().address + ':' + server.address().port);
});

function sendData(file, req, res) {
    // var data = fs.readFileSync(file);
    fs.readFile(file, function(err, data) {
        if (err) {
            console.info('文件读取失败');
        } else {
            res.end(data);
        }
    });
}
