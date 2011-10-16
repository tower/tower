fs = require("fs")
_ = require("underscore")

class Base
  constructor: (controller) ->
    @controller = controller || {}
    
  render: (path, options) ->
    options  ?= {}
    type      = options.type || Metro.Views.engine
    engine    = Metro.Views.engines()[type]
    engine    = new engine
    template  = Metro.Views.lookup(path)
    engine.compile(template, @context(options))
  
  context: (options) ->
    controller = @controller
    
    locals =
      request:  controller.request
      session:  controller.session
      params:   controller.params
      query:    controller.query
      cookies:  controller.cookies
      headers:  controller.headers
      
    locals  = _.extend(locals, @locals || {}, options.locals)
    
    locals
  
module.exports = Base
