(function() {
  var File;

  File = require('pathfinder').File;

  Coach.Middleware.Dependencies = function(request, response, next) {
    if (next) return next();
  };

  module.exports = Coach.Middleware.Dependencies;

}).call(this);
