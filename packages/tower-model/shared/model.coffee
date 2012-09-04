_ = Tower._

# @concern Tower.ModelAttributes
# @concern Tower.ModelPersistence
# @concern Tower.ModelRelations
# @concern Tower.ModelScopes
# @concern Tower.ModelValidations
#
# @method .where(conditions)
#   Query conditions
class Tower.Model extends Tower.Class
  @reopen Ember.Evented

Tower.Model.reopen
  errors: null
  readOnly: false
  previousChanges: undefined

  # Construct a new Tower.Model
  #
  # @param [Object] attributes a hash of attributes
  # @param [Object] options a hash of options
  # @option options [Boolean] persistent whether or not this object is from the database
  initialize: (attributes = {}, options = {}) ->
    unless options.isNew == false
      @_initialize(attributes, options)
    else
      @_initializeFromStore(attributes, options)

  _initialize: (attributes, options) ->
    _.extend(@get('attributes'), @constructor._defaultAttributes(@))

    @assignAttributes(attributes)

    @_initializeData(options)

  _initializeFromStore: (attributes, options) ->
    _.extend @get('attributes'), @constructor.initializeAttributes(@, attributes)

    @set('isNew', false)

    @_initializeData(options)

  _initializeData: (options) ->
    @setProperties
      errors:   {}
      readOnly: if options.hasOwnProperty('readOnly') then options.readOnly else false

    @runCallbacks 'find'
    @runCallbacks 'initialize'

    @

module.exports = Tower.Model
