File = require('pathfinder').File

# nothing yet
Tower.Middleware.Dependencies = (request, response, next) ->
  #Tower.Support.Dependencies.reloadModified()
  
  next() if next

module.exports = Tower.Middleware.Dependencies
