fs = require("fs")
_ = require("underscore")

class Base
  constructor: (controller) ->
    @controller = controller || (new Metro.Controllers.Base)
    
  render: (path, options) ->
    options  ?= {}
    type      = options.type || Metro.Views.engine
    engine    = Metro.Views.engines()[type]
    engine    = new engine
    template  = Metro.Views.lookup(path)
    engine.compile(template, @context(options))
  
  context: (options) ->
    controller = @controller
    locals = {}
    _.each _.keys(controller.constructor.prototype), (key) ->
      locals[key] = controller[key] unless key == "constructor"
    locals  = _.extend(locals, @locals || {}, options.locals)
    locals
  
module.exports = Base
