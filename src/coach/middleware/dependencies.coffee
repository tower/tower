File = require('pathfinder').File

Coach.Middleware.Dependencies = (request, response, next) ->
  #Coach.Support.Dependencies.reloadModified()
  
  next() if next

module.exports = Coach.Middleware.Dependencies
