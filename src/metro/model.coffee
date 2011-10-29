class Model
  constructor: -> super
  
  @Association:   require './model/association'
  @Associations:  require './model/associations'
  @Attribute:     require './model/attribute'
  @Attributes:    require './model/attributes'
  @Dirty:         require './model/dirty'
  @Observing:     require './model/observing'
  @Persistence:   require './model/persistence'
  @Scope:         require './model/scope'
  @Scopes:        require './model/scopes'
  @Serialization: require './model/serialization'
  @Validation:    require './model/validation'
  @Validations:   require './model/validations'
  
  @include @Persistence
  @include @Scopes
  @include @Serialization
  @include @Associations
  @include @Validations
  @include @Dirty
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
    
  valueOf: ->
    @attributes

module.exports = Model
