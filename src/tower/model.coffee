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
  
  errors: null
  
  hashWasUpdated: ->
    Ember.run.once(@, @notifyHashWasUpdated)
  
  # This is going to be run once per frame, if properties were set in the previous frame.
  # 
  # It tells the data store associated with this record to update.
  # If you have defined cursors (query scopes, collections, whatever name you want to give it),
  # the store will pass this record through them to see if, with it's new attribute values,
  # it still is part of that scope.
  notifyHashWasUpdated: ->
    store = Ember.get @, 'store'
    if store
      store.hashWasUpdated(@constructor, Ember.get(@, 'clientId'), @)
  
  store: Ember.computed ->
    @constructor.store()
  
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
    
    @set 'errors', {}
    
    @readOnly       = if options.hasOwnProperty('readOnly') then options.readOnly else false
    @persistent     = if options.hasOwnProperty('persistent') then options.persisted else false
    
    for key, value of attrs
      @set key, value
      
    stateMachine = Tower.Model.StateMachine.create(record: @)

    @set 'pendingQueue', {}

    @set 'stateMachine', stateMachine
    
    stateMachine.goToState('empty')

require './model/scope'
require './model/cursor'
require './model/data'
require './model/dirty'
require './model/indexing'
require './model/inheritance'
require './model/metadata'
require './model/relation'
require './model/relations'
require './model/attribute'
require './model/attributes'
require './model/persistence'
require './model/scopes'
require './model/serialization'
require './model/states'
require './model/state'
require './model/stateMachine'
require './model/validator'
require './model/validations'
require './model/timestamp'
require './model/locale/en'

Tower.Model.include Tower.Support.Callbacks
Tower.Model.include Tower.Model.Metadata
Tower.Model.include Tower.Model.Dirty
Tower.Model.include Tower.Model.Indexing
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.States
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Attributes
Tower.Model.include Tower.Model.Timestamp

module.exports = Tower.Model
