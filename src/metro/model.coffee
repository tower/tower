class Metro.Model
  @initialize: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/models")
    
  @teardown: ->
    delete @_store
  
  # Add the global store to your model.
  # 
  #     @store: new Metro.Store.Memory
  @store: ->
    @_store ?= new Metro.Store.Memory
  
  constructor: (attrs = {}) ->
    attributes  = {}
    definitions = @constructor.keys()
    
    for key, value of attrs
      attributes[key] = value
      
    for name, definition of definitions
      attributes[name] ||= definition.defaultValue(@) unless attrs.hasOwnProperty(name)
    
    @attributes = @typeCastAttributes(attributes)
    @changes    = {}

require './model/scope'
require './model/association'
require './model/associations'
require './model/attribute'
require './model/attributes'
require './model/dirty'
require './model/observing'
require './model/persistence'
require './model/reflection'
require './model/scopes'
require './model/serialization'
require './model/validation'
require './model/validations'

Metro.Model.include Metro.Model.Persistence
Metro.Model.include Metro.Model.Scopes
Metro.Model.include Metro.Model.Serialization
Metro.Model.include Metro.Model.Associations
Metro.Model.include Metro.Model.Validations
Metro.Model.include Metro.Model.Dirty
Metro.Model.include Metro.Model.Attributes

module.exports = Model
