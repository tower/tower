class Tower.Model extends Tower.Class
  # @example All configuration options
  #   class App.User extends Tower.Model
  #     @configure 
  # 
  # @example Configure using a function
  #   class App.User extends Tower.Model
  #     @configure ->
  #       defaultStore: Tower.Store.Memory
  @configure: (object) ->
    @config ||= {}
    object = object.call @ if typeof object == "function"
    _.extend @config, object
    @
  
  # @example All default options
  #   class App.User extends Tower.Model
  #     @defaults store: Tower.Store.Memory, scope: @desc("createdAt")
  @defaults: (object) ->
    @default(key, value) for key, value of object
    @_defaults
    
  # @example All default options 
  #   class App.User extends Tower.Model
  #     @default "store", Tower.Store.Memory
  #     @default "scope", @desc("createdAt")
  @default: (key, value) ->
    @_defaults ||= {}
    @_defaults[key] = value
    
  constructor: (attrs, options) ->
    @initialize attrs, options
    
  initialize: (attrs = {}, options = {}) ->  
    definitions = @constructor.fields()
    attributes  = {}
    
    for name, definition of definitions
      attributes[name] = definition.defaultValue(@) unless attrs.hasOwnProperty(name)

    @attributes   = attributes
    @changes      = {}
    @errors       = {}
    @readOnly     = if options.hasOwnProperty("readOnly") then options.readOnly else false
    @persistent   = if options.hasOwnProperty("persistent") then options.persisted else false

    @attributes[key] = value for key, value of attrs
  
require './model/scope'
require './model/criteria'
require './model/dirty'
require './model/conversion'
require './model/inheritance'
require './model/relation'
require './model/relations'
require './model/attribute'
require './model/attributes'
require './model/persistence'
require './model/scopes'
require './model/serialization'
require './model/validator'
require './model/validations'
require './model/timestamp'
require './model/locale/en'

Tower.Model.include Tower.Support.Callbacks
Tower.Model.include Tower.Model.Conversion
Tower.Model.include Tower.Model.Dirty
Tower.Model.include Tower.Model.Criteria
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Attributes
Tower.Model.include Tower.Model.Timestamp

module.exports = Tower.Model
