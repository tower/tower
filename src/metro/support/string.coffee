_ = require("underscore")
_.mixin(require("underscore.string"))
lingo = require("lingo").en

class String
  @include lingo
  
  @camelize: -> 
    _.camelize("_#{arguments[0] || @}")
    
  @constantize: ->
    global[@camelize(arguments...)]
    
  @underscore: ->
    _.underscored(arguments[0] || @)
    
  @titleize: ->
    _.titleize(arguments[0] || @)
    
  #@isPlural: ->
  #  lingo.isPlural(arguments[0] || @)
  #  
  #@isSingular: ->
  #  lingo.isSingular(arguments[0] || @)
  #  
  #@singularize: ->
  #  lingo.singularize(arguments[0] || @)
  #  
  #@pluralize: ->
  #  lingo.pluralize(arguments[0] || @)
    
module.exports = String
