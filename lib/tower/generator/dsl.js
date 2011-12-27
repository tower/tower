
Tower.Generator.DSL = (function() {

  function DSL() {}

  DSL.prototype.injectIntoFile = function(file, options, callback) {};

  DSL.prototype.readFile = function(file) {};

  DSL.prototype.createFile = function(file, data) {};

  DSL.prototype.removeFile = function(file) {};

  DSL.prototype.createDirectory = function(name) {};

  DSL.prototype.removeDirectory = function(name) {};

  return DSL;

})();

module.exports = Tower.Generator.DSL;
