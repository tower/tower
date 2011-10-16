Middleware =
  Router:   require('./middleware/router')
  Cookies:  require('./middleware/cookies')
  Static:   require('./middleware/static')
  Query:    require('./middleware/query')
  Body:     require('./middleware/body')
  
exports = module.exports = Middleware
