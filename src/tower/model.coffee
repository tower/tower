class Tower.Model extends Tower.Class
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
require './model/criteria'
require './model/dirty'
require './model/metadata'
require './model/inheritance'
require './model/relation'
require './model/relations'
require './model/field'
require './model/fields'
require './model/persistence'
require './model/scopes'
require './model/serialization'
require './model/validator'
require './model/validations'
require './model/timestamp'
require './model/locale/en'

Tower.Model.include Tower.Support.Callbacks
Tower.Model.include Tower.Model.Metadata
Tower.Model.include Tower.Model.Dirty
Tower.Model.include Tower.Model.Criteria
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Fields
Tower.Model.include Tower.Model.Timestamp

module.exports = Tower.Model
