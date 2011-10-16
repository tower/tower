class Static
  @middleware: (request, result, next) -> 
    @_middleware ?= require("connect").static(Metro.public_path, { maxAge: 0 })
    @_middleware(request, result, next)

exports = module.exports = Static
