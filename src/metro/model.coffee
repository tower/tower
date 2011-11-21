class Metro.Model extends Metro.Object
  constructor: (attrs = {}) ->
    definitions = @constructor.keys()
    attributes  = {}
    
    for key, value of attrs
      attributes[key] = @typecast(value)
    
    for name, definition of definitions
      attributes[name] ||= @typecast(definition.defaultValue(@)) unless attrs.hasOwnProperty(name)
    
    @attributes   = attributes
    @changes      = {}
    @associations = {}
    @errors       = []
  
  toLabel: ->
    @className()
    
  toPath: ->
    @constructor.toParam() + "/" + @toParam()
    
  toParam: ->
    @get("id").toString()
    
  @toParam: ->
    Metro.Support.String.parameterize(@className())

require './model/scope'
require './model/association'
require './model/associations'
require './model/attribute'
require './model/attributes'
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
Metro.Model.include Metro.Model.Attributes

module.exports = Metro.Model
