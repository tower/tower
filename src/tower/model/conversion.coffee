# @mixin
Tower.Model.Conversion =
  ClassMethods:
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
        
    isSubClass: ->
      @baseClass().name != @name
    
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

    # @url "/posts/:postId/comment"
    # @url parent: "post"
    # @url (model) -> return "/something"
    url: (options) ->
      @_url = switch typeof options
        when "object"
          if options.parent
            url = "/#{Tower.Support.String.parameterize(Tower.Support.String.pluralize(options.parent))}/:#{Tower.Support.String.camelize(options.parent, true)}/#{@toParam()}"
        else
          options
    
    _relationship: false

    # for now, just for neo4j
    relationship: (value = true) ->
      @_relationship = value

    # @example All default options
    #   class App.User extends Tower.Model
    #     @defaults store: Tower.Store.Memory, scope: @desc("createdAt")
    defaults: (object) ->
      @default(key, value) for key, value of object if object
      @metadata().defaults

    # @example All default options
    #   class App.User extends Tower.Model
    #     @default "store", Tower.Store.Memory
    #     @default "scope", @desc("createdAt")
    default: (key, value) ->
      method = "_setDefault#{Tower.Support.String.camelize(key)}"
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
      className               = @name
      metadata                = @metadata[className]
      return metadata if metadata
      baseClassName           = @baseClass().name
      
      if baseClassName != className
        superMetadata = @baseClass().metadata()
      else
        superMetadata = {}
        
      namespace               = Tower.namespace()
      name                    = Tower.Support.String.camelize(className, true)
      namePlural              = Tower.Support.String.pluralize(name)
      classNamePlural         = Tower.Support.String.pluralize(className)
      paramName               = Tower.Support.String.parameterize(name)
      paramNamePlural         = Tower.Support.String.parameterize(namePlural)
      modelName               = "#{namespace}.#{className}"
      controllerName          = "#{namespace}.#{classNamePlural}Controller"
      fields                  = if superMetadata.fields then _.clone(superMetadata.fields) else {}
      indexes                 = if superMetadata.indexes then _.clone(superMetadata.indexes) else {}
      validators              = if superMetadata.validators then _.clone(superMetadata.validators) else []
      relations               = if superMetadata.relations then _.clone(superMetadata.relations) else {}
      defaults                = if superMetadata.defaults then _.clone(superMetadata.defaults) else {}
      
      @metadata[className]    =
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
        
    _setDefaultScope: (scope) ->
      @metadata().defaults.scope = if scope instanceof Tower.Model.Scope then scope else @where(scope)
        
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
      return "/" if result == undefined
      param   = @toParam()
      result += "/#{param}" if param
      result

    toParam: ->
      id = @get("id")
      if id? then String(id) else null

    toKey: ->
      @constructor.tokey()
  
    # Key used to persist this model in a cache store.
    toCacheKey: ->

    metadata: ->
      @constructor.metadata()

module.exports = Tower.Model.Conversion
