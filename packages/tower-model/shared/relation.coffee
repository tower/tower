class Tower.ModelRelation extends Tower.Class
  isCollection: false

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
  # @option options [Boolean] autobuild (false)
  #
  # @see Tower.ModelRelations.#hasMany
  init: (owner, name, options = {}) ->
    @_super()

    @[key] = value for key, value of options

    @owner              = owner
    @name               = name

    @initialize(options)

  initialize: (options) ->
    owner               = @owner
    name                = @name
    className           = owner.className()
    # @type               = Tower.namespaced(options.type || Tower.SupportString.camelize(Tower.SupportString.singularize(name)))
    @type               = Tower.namespaced(options.type || _.camelize(_.singularize(name)))
    @ownerType          = Tower.namespaced(className)
    @dependent        ||= false
    @counterCache     ||= false
    @idCache            = false unless @hasOwnProperty('idCache')
    @readonly           = false unless @hasOwnProperty('readonly')
    # from rails' autosave_association and reflection.rb validate?
    @validate           = @autosave == true unless @hasOwnProperty('validate')
    # @autosave is undefined has a different meaning that true/false
    # @autosave           = false unless @hasOwnProperty('autosave')
    @touch              = false unless @hasOwnProperty('touch')
    @inverseOf        ||= undefined
    @polymorphic        = options.hasOwnProperty('as') || !!options.polymorphic
    @default            = false unless @hasOwnProperty('default')
    @singularName       = _.camelize(className, true)
    @pluralName         = _.pluralize(className) # collectionName?
    @singularTargetName = _.singularize(name)
    @pluralTargetName   = _.pluralize(name)
    @targetType         = @type
    @primaryKey         = 'id'
    # @todo
    @autobuild          = false unless @hasOwnProperty('autobuild')
    
    # hasMany "posts", foreignKey: "postId", idCacheKey: "postIds"
    unless @foreignKey
      if @as
        @foreignKey = "#{@as}Id"
      else
        if @className().match 'BelongsTo'
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

    #if @autosave
    @owner._addAutosaveAssociationCallbacks(@)

  # @todo refactor!
  # http://stackoverflow.com/questions/4255379/dirty-tracking-of-embedded-document-on-the-parent-doc-in-mongoid
  _defineRelation: (name) ->
    object = {}

    isHasMany = !@className().match(/HasOne|BelongsTo/)
    @relationType = if isHasMany then 'collection' else 'singular'

    object[name + 'AssociationScope'] = Ember.computed((key) ->
      @constructor.relation(name).scoped(@)
    ).cacheable()

    association = @

    if isHasMany
      # you can "set" collections directly, but whenever you "get" them
      # you're going to get a Tower.ModelScope. To get the actual records call `.all`
      object[name] = Ember.computed((key, value) ->
        if arguments.length == 2
          @_setHasManyAssociation(key, value, association)
        else
          @_getHasManyAssociation(name)
      ).property('data').cacheable()
    else
      if @className().match 'BelongsTo'
        object[name] = Ember.computed((key, value) ->
          if arguments.length is 2
            @_setBelongsToAssociation(key, value, association)
          else
            @_getBelongsToAssociation(key)
        ).property('data', "#{name}Id").cacheable()
      else # HasOne
        object[name] = Ember.computed((key, value) ->
          if arguments.length is 2
            @_setHasOneAssociation(key, value, association)
          else
            @_getHasOneAssociation(key)
        ).property('data').cacheable()

    @owner.reopen(object)

  # @return [Tower.ModelRelationScope]
  scoped: (record) ->
    cursor = Tower[@constructor.className() + 'Cursor'].make()
    #cursor.make(model: @klass(), owner: record, relation: @)
    attributes = owner: record, relation: @
    polymorphicBelongsTo = @polymorphic && @className().match(/BelongsTo/)
    unless polymorphicBelongsTo
      attributes.model = @klass()# unless @polymorphic
    cursor.make(attributes)
    klass = try @targetKlass()
    if polymorphicBelongsTo
      #id    = record.get(@foreignKey)
      type  = record.get(@foreignType)
      if type?
        cursor.model = Tower.constant(type)
        cursor.store = cursor.model.store()
    else
      cursor.where(type: klass.className()) if klass && klass.shouldIncludeTypeInScope()
    new Tower.ModelScope(cursor)

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
  # @return [Tower.ModelRelation]
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

Tower.ModelRelationCursorMixin = Ember.Mixin.create
  isConstructable: ->
    !!!@relation.polymorphic

  isLoaded: false

  clone: (cloneContent = true) ->
    #if Ember.EXTEND_PROTOTYPES
    #  clone = @clonePrototype()
    #else
    clone = @constructor.make()
    if cloneContent
      content = Ember.get(@, 'content') || Ember.A([])
      clone.setProperties(content: content) if content
    unless content
      clone.setProperties(content: Ember.A([]))
    clone.make(model: @model, owner: @owner, relation: @relation, instantiate: @instantiate)
    clone.merge(@)
    clone

  clonePrototype: ->
    clone = @concat()
    clone.isCursor = true
    Tower.ModelRelationCursorMixin.apply(clone)

  load: (records) ->
    owner     = @owner
    relation  = @relation.inverse()

    if !relation
      throw new Error("Inverse relation has not been defined for `#{@relation.owner.className()}.#{_.camelize(@relation.className(), true)}('#{@relation.name}')`")

    for record in records
      record.set(relation.name, owner)

    @_super(records)

  reset: ->
    owner     = @owner
    relation  = @relation.inverse()
    records   = Ember.get(@, 'content')#if Ember.EXTEND_PROTOTYPES then @ else Ember.get(@, 'content')

    # this + ember computed cacheable() is causing issues with run loop, not sure this needs to be here.
    #for record in records
    #  record.set(relation.name, undefined)

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

  addToTarget: (record) ->

  # Adds record to array of items to remove later in the persistence lifecycle.
  removeFromTarget: (record) ->
    @removed().push(record)

  removed: ->
    @_removed ||= []

class Tower.ModelRelationCursor extends Tower.ModelCursor
  @makeOld: ->
    array = []
    array.isCursor = true
    Tower.ModelRelationCursorMixin.apply(array)

  @include Tower.ModelRelationCursorMixin

require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasManyThrough'
require './relation/hasOne'

module.exports = Tower.ModelRelation
