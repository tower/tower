class Coach.Model extends Coach.Class
  # @extend   Coach.Support.EventEmitter
  # @include  Coach.Support.EventEmitter
  
  constructor: (attrs = {}) ->
    definitions = @constructor.fields()
    attributes  = {}
    
    for key, value of attrs
      attributes[key] = value
    
    for name, definition of definitions
      attributes[name] ||= definition.defaultValue(@) unless attrs.hasOwnProperty(name)
    
    @attributes   = attributes
    @changes      = {}
    @errors       = {}
    #@relations    = {}
    @readonly     = false
  
require './model/scope'
require './model/callbacks'
require './model/criteria'
require './model/dirty'
require './model/metadata'
require './model/inheritance'
require './model/relation'
require './model/relations'
require './model/field'
require './model/versioning'
require './model/fields'
require './model/persistence'
require './model/atomic'
require './model/scopes'
require './model/nestedAttributes'
require './model/serialization'
require './model/states'
require './model/validator'
require './model/validations'
require './model/timestamp'

Coach.Model.include Coach.Model.Persistence
Coach.Model.include Coach.Model.Atomic
Coach.Model.include Coach.Model.Versioning
Coach.Model.include Coach.Model.Metadata
Coach.Model.include Coach.Model.Dirty
Coach.Model.include Coach.Model.Criteria
Coach.Model.include Coach.Model.Scopes
Coach.Model.include Coach.Model.States
Coach.Model.include Coach.Model.Inheritance
Coach.Model.include Coach.Model.Serialization
Coach.Model.include Coach.Model.NestedAttributes
Coach.Model.include Coach.Model.Relations
Coach.Model.include Coach.Model.Validations
Coach.Model.include Coach.Model.Callbacks
Coach.Model.include Coach.Model.Fields

module.exports = Coach.Model
