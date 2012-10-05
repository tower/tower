_ = Tower._

# @mixin
Tower.ModelMetadata =
  ClassMethods:
    isModel: true
    # The class in the superclass hierarchy that directly subclasses Tower.Model
    #
    # @example
    #   class App.Attachment extends Tower.Model
    #   class App.Video extends App.Attachment
    #
    #   App.Attachment.baseClass()  #=> App.Attachment
    #   App.Video.baseClass()       #=> App.Attachment
    #
    # @return [Function]
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Model
        @__super__.constructor.baseClass()
      else
        @

    parentClass: ->
      if @__super__ && @__super__.constructor.parentClass
        @__super__.constructor
      else
        @

    isSubClass: ->
      @baseClass().className() != @className()

    # The name of this class, parameterized and pluralized.
    #
    # This is used for generating urls from this model.
    #
    # @return [String]
    toParam: ->
      return undefined if @ == Tower.Model
      @metadata().paramNamePlural

    toKey: ->
      @metadata().paramName

    # @url '/posts/:postId/comment'
    # @url parent: 'post'
    # @url (model) -> return '/something'
    url: (options) ->
      @_url = switch typeof options
        when 'object'
          if options.parent
            url = "/#{_.parameterize(_.pluralize(options.parent))}/:#{_.camelize(options.parent, true)}/#{@toParam()}"
        else
          options

    # @example All default options
    #   class App.User extends Tower.Model
    #     @defaults store: Tower.StoreMemory, scope: @desc('createdAt')
    defaults: (object) ->
      @default(key, value) for key, value of object if object
      @metadata().defaults

    # @example All default options
    #   class App.User extends Tower.Model
    #     @default 'store', Tower.StoreMemory
    #     @default 'scope', @desc('createdAt')
    default: (key, value) ->
      if arguments.length == 1 # we're getting a value
        @metadata().defaults[key]
      else
        method = "_setDefault#{_.camelize(key)}"
        if @[method]
          @[method](value)
        else
          @metadata().defaults[key] = value

    # All of the different names related to this class.
    #
    # The result is memoized.
    #
    # @return [Object]
    metadata: ->
      @_metadata ||= {}
      className               = @className()
      metadata                = @_metadata[className]
      return metadata if metadata
      baseClassName           = @parentClass().className()

      if baseClassName != className
        superMetadata = @parentClass().metadata()
      else
        superMetadata = {}

      name                    = _.camelize(className, true)
      namePlural              = _.pluralize(name)
      classNamePlural         = _.pluralize(className)
      paramName               = _.parameterize(name)
      paramNamePlural         = _.parameterize(namePlural)

      if baseClassName != className
        namespace               = Tower.namespace()
        modelName               = "#{namespace}.#{className}"
        controllerName          = "#{namespace}.#{classNamePlural}Controller"

      fields                  = if superMetadata.fields then _.clone(superMetadata.fields) else {}
      indexes                 = if superMetadata.indexes then _.clone(superMetadata.indexes) else {}
      validators              = if superMetadata.validators then _.clone(superMetadata.validators) else []
      relations               = if superMetadata.relations then _.clone(superMetadata.relations) else {}
      defaults                = if superMetadata.defaults then _.clone(superMetadata.defaults) else {}
      callbacks               = if superMetadata.callbacks then _.clone(superMetadata.callbacks) else {}

      @_metadata[className]    =
        name:                 name
        namePlural:           namePlural
        className:            className
        classNamePlural:      classNamePlural
        paramName:            paramName
        paramNamePlural:      paramNamePlural
        modelName:            modelName
        controllerName:       controllerName
        indexes:              indexes
        validators:           validators
        fields:               fields
        relations:            relations
        defaults:             defaults
        callbacks:            callbacks

    _setDefaultScope: (scope) ->
      defaults = @metadata().defaults
      if scope instanceof Tower.ModelScope
        defaults.scope = scope
      else if scope
        defaults.scope = @where(scope)
      else
        delete defaults.scope

    callbacks: ->
      @metadata().callbacks

  InstanceMethods:
    # A label for this model when rendered to a string.
    #
    # Defaults to the class name.
    #
    # @return [String]
    toLabel: ->
      @metadata().className

    # Url for this model.
    toPath: ->
      result  = @constructor.toParam()
      return '/' if result == undefined
      param   = @toParam()
      result += "/#{param}" if param
      result

    toParam: ->
      id = @get('id')
      if id? then String(id) else null

    toKey: ->
      @constructor.tokey()

    # Key used to persist this model in a cache store.
    toCacheKey: ->

    metadata: ->
      @constructor.metadata()

    toString: ->
      attributes  = @get('attributes')
      array       = []
      if attributes.hasOwnProperty('id')
        array.push("id=#{JSON.stringify(attributes.id)}")
        delete attributes.id
      result      = []
      for key, value of attributes
        result.push("#{key}=#{JSON.stringify(value)}")
      result  = array.concat(result.sort()).join(', ')
      "#<#{@constructor.toString()}:#{Ember.guidFor(@)} #{result}>"

module.exports = Tower.ModelMetadata
