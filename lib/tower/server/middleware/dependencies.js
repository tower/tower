var File;

File = require('pathfinder').File;

Tower.Middleware.Dependencies = function(request, response, next) {
  if (next) return next();
};

module.exports = Tower.Middleware.Dependencies;
