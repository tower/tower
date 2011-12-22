class Tower.Model extends Tower.Class
  # @extend   Tower.Support.EventEmitter
  # @include  Tower.Support.EventEmitter
  
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
require './model/locale/en'

Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Atomic
Tower.Model.include Tower.Model.Metadata
Tower.Model.include Tower.Model.Dirty
Tower.Model.include Tower.Model.Criteria
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.States
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.NestedAttributes
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Callbacks
Tower.Model.include Tower.Model.Fields

module.exports = Tower.Model
