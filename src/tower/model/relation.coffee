class Tower.Model.Relation extends Tower.Class
  # Construct a new relation.
  #
  # @param [Function] owner Tower.Model class this relation is defined on.
  # @param [String] name name of the relation.
  # @param [Object] options options hash.
  #
  # @option options [String] type name of the associated class.
  # @option options [Boolean] readonly (false)
  # @option options [Boolean] validate (false)
  # @option options [Boolean] autosave (false)
  # @option options [Boolean] touch (false)
  # @option options [Boolean] dependent (false) if true, relationship records
  #   will be destroyed if the owner record is destroyed.
  # @option options [String] inverseOf (undefined)
  # @option options [Boolean] polymorphic (false)
  # @option options [String] foreignKey Defaults to "#{as}Id" if polymorphic, else "#{singularName}Id"
  # @option options [String] foreignType Defaults to "#{as}Type" if polymorphic, otherwise it's undefined
  # @option options [Boolean|String] idCache (false)
  # @option options [String] idCacheKey Set to the value of the `idCache` option if it's a string,
  #   otherwise it's `"#{singularTargetName}Ids"`.
  # @option options [Boolean] counterCache (false) if true, will increment `relationshipCount` variable
  #   when relationship is created/destroyed.
  # @option options [String] counterCacheKey Set to the value of the `counterCache` option if it's a string,
  #   otherwise it's `"#{singularTargetName}Count"`.
  #
  # @see Tower.Model.Relations.ClassMethods#hasMany
  init: (owner, name, options = {}) ->
    @_super()

    @[key] = value for key, value of options

    @owner              = owner
    @name               = name

    @initialize(options)

  initialize: (options) ->
    owner               = @owner
    name                = @name
    # @type               = Tower.namespaced(options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name)))
    @type               = Tower.namespaced(options.type || _.camelize(_.singularize(name)))
    @ownerType          = Tower.namespaced(owner.className())
    @dependent        ||= false
    @counterCache     ||= false
    @idCache            = false unless @hasOwnProperty('idCache')
    @readonly           = false unless @hasOwnProperty('readonly')
    @validate           = false unless @hasOwnProperty('validate')
    @autosave           = false unless @hasOwnProperty('autosave')
    @touch              = false unless @hasOwnProperty('touch')
    @inverseOf        ||= undefined
    @polymorphic        = options.hasOwnProperty('as') || !!options.polymorphic
    @default            = false unless @hasOwnProperty('default')
    @singularName       = Tower.Support.String.camelize(owner.className(), true)
    @pluralName         = Tower.Support.String.pluralize(owner.className()) # collectionName?
    @singularTargetName = Tower.Support.String.singularize(name)
    @pluralTargetName   = Tower.Support.String.pluralize(name)
    @targetType         = @type
    # hasMany "posts", foreignKey: "postId", idCacheKey: "postIds"
    unless @foreignKey
      if @as
        @foreignKey = "#{@as}Id"
      else
        if @className() == 'BelongsTo'
          @foreignKey = "#{@singularTargetName}Id"
        else
          @foreignKey = "#{@singularName}Id"

    @foreignType ||= "#{@as}Type" if @polymorphic

    if @idCache
      if typeof @idCache == 'string'
        @idCacheKey = @idCache
        @idCache    = true
      else
        @idCacheKey = "#{@singularTargetName}Ids"

      @owner.field @idCacheKey, type: 'Array', default: []

    if @counterCache
      if typeof @counterCache == 'string'
        @counterCacheKey  = @counterCache
        @counterCache     = true
      else
        @counterCacheKey  = "#{@singularTargetName}Count"

      @owner.field @counterCacheKey, type: 'Integer', default: 0

    @_defineRelation(name)

  _defineRelation: (name) ->
    object = {}

    isHasMany = !@className().match(/HasOne|BelongsTo/)

    if isHasMany
      object[name] = Ember.computed((key, value) ->
        if arguments.length is 2
          data = Ember.get(@, 'data')
          data.set(key, value)
        else
          data = Ember.get(@, 'data')
          value = data.get(key)
          value ||= @constructor.relation(name).scoped(@)
          value
      ).property('data').cacheable()
    else
      object[name + 'Association'] = Ember.computed((key) ->
        @constructor.relation(name).scoped(@)
      ).cacheable()
      if @className() == 'BelongsTo'
        object[name] = Ember.computed((key, value) ->
          if arguments.length is 2
            data = Ember.get(@, 'data')
            if value instanceof Tower.Model
              data.set("#{key}Id", value.get('id'))
            else
              data.set(key, value)
            value
          else
            data = Ember.get(@, 'data')
            value = data.get(key)
        ).property('data').cacheable()

    @owner.reopen(object)

  # @return [Tower.Model.Relation.Scope]
  scoped: (record) ->
    cursor = @constructor.Cursor.create()
    cursor.make(model: @klass(), owner: record, relation: @)
    klass = @targetKlass()
    cursor.where(type: klass.className()) if klass.shouldIncludeTypeInScope()
    new Tower.Model.Scope(cursor)

  # @return [Function]
  targetKlass: ->
    Tower.constant(@targetType)

  # Class for model on the other side of this relationship.
  #
  # @return [Function]
  klass: ->
    Tower.constant(@type)

  # Relation on the associated object that maps back to this relation.
  #
  # @return [Tower.Model.Relation]
  inverse: (type) ->
    return @_inverse if @_inverse

    relations = @targetKlass().relations()

    if @inverseOf
      return relations[@inverseOf]
    else
      for name, relation of relations
        # need a way to check if class extends another class in coffeescript...
        return relation if relation.inverseOf == @name
      for name, relation of relations
        return relation if relation.targetType == @ownerType

    null

  _setForeignKey: ->

  _setForeignType: ->

class Tower.Model.Relation.Cursor extends Tower.Model.Cursor
  isConstructable: ->
    !!!@relation.polymorphic

  init: (options = {}) ->
    @_super arguments...

    @owner        = options.owner
    @relation     = options.relation
    @records      = []

  clone: (cloneContent = true) ->
    clone = @constructor.create()
    if cloneContent
      content = Ember.get(@, 'content') || Ember.A([])
      clone.setProperties(content: content) if content
    unless content
      clone.setProperties(content: Ember.A([]))
    clone.make(model: @model, owner: @owner, relation: @relation, records: @records.concat(), instantiate: @instantiate)
    clone.merge(@)
    clone

  load: (records) ->
    owner     = @owner
    relation  = @relation.inverse()

    for record in records
      record.set(relation.name, owner)

    @_super(records)

  reset: ->
    owner     = @owner
    relation  = @relation.inverse()
    records   = Ember.get(@, 'content')

    for record in records
      record.set(relation.name, undefined)

    @_super()

  setInverseInstance: (record) ->
    if record && @invertibleFor(record)
      inverse = record.relation(@inverseReflectionFor(record).name)
      inverse.target = owner

  invertibleFor: (record) ->
    true

  inverse: (record) ->

  _teardown: ->
    _.teardown(@, 'relation', 'records', 'owner', 'model', 'criteria')

require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasManyThrough'
require './relation/hasOne'

module.exports = Tower.Model.Relation
