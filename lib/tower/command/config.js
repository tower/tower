var File, exec, fs;

exec = require("child_process").exec;

File = require("pathfinder").File;

fs = require('fs');

Tower.Command.Config = (function() {

  function Config() {}

  Config.prototype.run = function() {};

  return Config;

})();

module.exports = Tower.Command.Config;
