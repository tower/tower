Metro.Middleware = {}

require './middleware/dependencies'
require './middleware/router'
require './middleware/cookies'
require './middleware/static'
require './middleware/query'
require './middleware/assets'
  
module.exports = Metro.Middleware
