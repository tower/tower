# @concern Tower.Model.Attributes
# @concern Tower.Model.Persistence
# @concern Tower.Model.Relations
# @concern Tower.Model.Scopes
# @concern Tower.Model.Validations
#
# @method .where(conditions)
#   Query conditions
class Tower.Model extends Tower.Class
  @reopen Ember.Evented
  
  data: Ember.computed(->
    new Tower.Model.Data(@)
  ).cacheable()
  
  # Construct a new Tower.Model
  #
  # @param [Object] attributes a hash of attributes
  # @param [Object] options a hash of options
  # @option options [Boolean] persistent whether or not this object is from the database
  init: (attrs = {}, options = {}) ->
    @_super arguments...
    
    definitions = @constructor.fields()
    attributes  = {}

    for name, definition of definitions
      attributes[name] = definition.defaultValue(@)

    attributes.type ||= @constructor.className() if @constructor.isSubClass()

    @attributes     = attributes
    @relations      = {}
    @changes        =
      before:       {}
      after:        {}
    @errors         = {}
    @operations     = []
    @operationIndex = -1
    @readOnly       = if options.hasOwnProperty("readOnly") then options.readOnly else false
    @persistent     = if options.hasOwnProperty("persistent") then options.persisted else false

    for key, value of attrs
      @set key, value

require './model/scope'
require './model/criteria'
require './model/dirty'
require './model/conversion'
require './model/indexing'
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
Tower.Model.include Tower.Model.Indexing
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Attributes
Tower.Model.include Tower.Model.Timestamp

module.exports = Tower.Model
