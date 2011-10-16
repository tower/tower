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
    locals  = _.extend(@controller, @locals || {}, options.locals)
    
    locals
  
module.exports = Base
