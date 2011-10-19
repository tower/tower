(function() {
  var System, exec, sys;
  sys = require('sys');
  exec = require('child_process').exec;
  System = (function() {
    function System() {}
    System.command = function(command, callback) {
      var self;
      self = this;
      return exec(command, function(error, stdout, stderr) {
        self.puts(error, stdout, stderr);
        if (callback) {
          return callback.apply(this, error, stdout, stderr);
        }
      });
    };
    System.puts = function(error, stdout, stderr) {
      return sys.puts(stdout);
    };
    return System;
  })();
  module.exports = System;
}).call(this);
