var http = require('http');
var fs = require('fs');
// fs.readFile('./readFile.js', 'utf-8', function(err, data) {
//     if (err) {
//         console.info(err);
//     } else {
//         http.createServer(function(req, res) {
//             res.writeHeader(200, {
//                 "content-type": "text/plain"
//             });
//             res.end(data);
//         }).listen(4000, "127.0.0.1");
//     }
// });
var fileListArray = [];
var data = fs.readdirSync('../.sass-cache/');
data.forEach(function(v,i){
  fileListArray.push(v);
});
console.info(fileListArray);

// http.createServer(function(req, res) {
//     res.writeHeader(200, {
//         "content-type": "text/plain"
//     });
//     var data = fs.readdirSync('../bin/');
//     console.info(data);
//     res.end(data);
// }).listen(4000, "127.0.0.1");
