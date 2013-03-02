 var fs = require('fs');
 /**
  * Tower Constructor
  */

 function Tower(incomingOptions) {
     this.App = {
         files: []
     };

     this.container = {};
     this._namespaces = {};
     this.path = incomingOptions.dirname;
     this.env = incomingOptions.env;
     this.port = incomingOptions.inner_port;
     this.outer_port = incomingOptions.outer_port;
     this.version = JSON.parse(fs.readFileSync('./package.json')).version;
     this.cwd = process.cwd();
     this.isServer = true;
     this.isClient = false;
     this.autoload = ['app.js', 'server.js', 'index.js'];

     this.command = {
         argv: incomingOptions.commandArgs,
         get: function() {
             return incomingOptions.command;
         }
     };
 }

 Tower.create = function(options) {
     return new Tower(options);
 };

 Tower.prototype.getLineNumber = function(n) {
     if (!n) n = 1;
     if (isNaN(n) || n < 0) n = 1;
     n += 1;
     var s = (new Error()).stack,
         a = s.indexOf('\n', 5);
     while (n--) {
         a = s.indexOf('\n', a + 1);
         if (a < 0) {
             a = s.lastIndexOf('\n', s.length);
             break;
         }
     }
     b = s.indexOf('\n', a + 1);
     if (b < 0) b = s.length;
     a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
     b = s.lastIndexOf(':', b);
     s = s.substring(a + 1, b);
     return s.split(":")[1];
 };

 module.exports = Tower;