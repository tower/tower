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

  #if Tower.isServer
  #  @extended: ->
  #    for path in require('pathfinder').File.files("#{Tower.root}/app/concerns/#{@metadata().name}")
  #      require(path) if path.match(/\.(coffee|js|iced)$/)

  errors: null
  readOnly: false

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

    # @todo tmp, getting rid of Data class
    @savedData = {}

    @set('errors', {})

    attributes.type ||= @constructor.className() if @constructor.isSubClass()

    # @set('readOnly', if options.hasOwnProperty('readOnly') then options.readOnly else false)
    @readOnly = if options.hasOwnProperty('readOnly') then options.readOnly else false

    @setProperties(attrs)

require './model/scope'
require './model/massAssignment'
require './model/authentication'
require './model/cursor'
require './model/data'
require './model/dirty'
require './model/indexing'
require './model/inheritance'
require './model/metadata'
require './model/relation'
require './model/relations'
require './model/attachment'
require './model/attribute'
require './model/attributes'
require './model/nestedAttributes'
require './model/autosaveAssociation'
require './model/persistence'
require './model/scopes'
require './model/serialization'
require './model/states'
require './model/validator'
require './model/validations'
require './model/timestamp'
require './model/transactions'
require './model/operations'
require './model/hierarchical'
require './model/ability'
require './model/locale/en'

Tower.Model.include Tower.Support.Callbacks
Tower.Model.include Tower.Model.Metadata
Tower.Model.include Tower.Model.Dirty
Tower.Model.include Tower.Model.Indexing
Tower.Model.include Tower.Model.Authentication
Tower.Model.include Tower.Model.MassAssignment
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.States
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Attachment
Tower.Model.include Tower.Model.Attributes
Tower.Model.include Tower.Model.NestedAttributes
Tower.Model.include Tower.Model.AutosaveAssociation
Tower.Model.include Tower.Model.Timestamp
Tower.Model.include Tower.Model.Hierarchical
#Tower.Model.include Tower.Model.Operations
Tower.Model.include Tower.Model.Transactions

Tower.Model.field('id', type: 'Id')
Tower.Model.protected('id') # attrProtectedByDefault tmp

module.exports = Tower.Model
