class Model
  constructor: -> super
  
  @Association:   require './model/association'
  @Associations:  require './model/associations'
  @Attributes:    require './model/attributes'
  @Observing:     require './model/observing'
  @Persistence:   require './model/persistence'
  @Scope:         require './model/scope'
  @Scopes:        require './model/scopes'
  @Validation:    require './model/validation'
  @Validations:   require './model/validations'
  
  @include @Persistence
  @include @Scopes
  @include @Associations
  @include @Validations
  @include @Attributes
  
  @initialize: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/models")
    
  @teardown: ->
    delete @_store
  
  #@toString: -> 
  #  "#{@className}(#{@attributes.join(", ")})"
  
  # Add the global store to your model.
  # 
  #     @store: new Metro.Store.Memory
  @store: ->
    @_store ?= new Metro.Store.Memory

module.exports = Model
