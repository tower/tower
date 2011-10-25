class Model
  @Association:   require './model/association'
  @Associations:  require './model/associations'
  @Attributes:    require './model/attributes'
  @Callbacks:     require './model/callbacks'
  @Errors:        require './model/errors'
  @Observing:     require './model/observing'
  @Scope:         require './model/scope'
  @Scopes:        require './model/scopes'
  @Validation:    require './model/validation'
  @Validations:   require './model/validations'
  
  @bootstrap: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/models")
  
  @toString: -> 
    "#{@className}(#{@attributes.join(", ")})"
  
  # Add the global store to your model.
  # 
  #     @store: new Metro.Store.Memory
  @store: ->
    @_store ?= new Metro.Store.Memory

module.exports = Model
