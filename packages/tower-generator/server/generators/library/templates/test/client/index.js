var http    = require('http');
var fs      = require('fs');
var view    = process.cwd() + '/test/client/index.coffee';
var mint    = require('mint');
var params  = {
  title: "<%= app.name %>"
};

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  mint.coffee(fs.readFileSync(view), params, function(error, result) {
    res.end(result);
  })
}).listen(3000);
