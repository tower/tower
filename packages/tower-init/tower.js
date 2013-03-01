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

 module.exports = Tower;