class Metro.Middleware.Static
  @middleware: (request, result, next) -> 
    @_middleware ?= require("connect").static(Metro.publicPath, { maxAge: 0 })
    @_middleware(request, result, next)

module.exports = Metro.Middleware.Static
