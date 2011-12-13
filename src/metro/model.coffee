class Metro.Model extends Metro.Object
  constructor: (attrs = {}) ->
    definitions = @constructor.attributes()
    attributes  = {}
    
    for key, value of attrs
      attributes[key] = @typecast(key, value)
    
    for name, definition of definitions
      attributes[name] ||= @typecast(name, definition.defaultValue(@)) unless attrs.hasOwnProperty(name)
    
    @attributes   = attributes
    @changes      = {}
    @associations = {}
    @errors       = []
    @readonly     = false
  
require './model/scope'
require './model/callbacks'
require './model/dirty'
require './model/metadata'
require './model/inheritance'
require './model/relation'
require './model/relations'
require './model/field'
require './model/fields'
require './model/finders'
require './model/persistence'
require './model/atomic'
require './model/scopes'
require './model/serialization'
require './model/states'
require './model/validator'
require './model/validations'

Metro.Model.include Metro.Model.Persistence
Metro.Model.include Metro.Model.Atomic
Metro.Model.include Metro.Model.Metadata
Metro.Model.include Metro.Model.Dirty
Metro.Model.include Metro.Model.Scopes
Metro.Model.include Metro.Model.States
Metro.Model.include Metro.Model.Finders
Metro.Model.include Metro.Model.Inheritance
Metro.Model.include Metro.Model.Serialization
Metro.Model.include Metro.Model.Relations
Metro.Model.include Metro.Model.Validations
Metro.Model.include Metro.Model.Callbacks
Metro.Model.include Metro.Model.Fields

module.exports = Metro.Model
