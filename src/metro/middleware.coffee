Middleware =
  Dependencies: require('./middleware/dependencies')
  Router:       require('./middleware/router')
  Cookies:      require('./middleware/cookies')
  Static:       require('./middleware/static')
  Query:        require('./middleware/query')
  Body:         require('./middleware/body')
  
module.exports = Middleware
