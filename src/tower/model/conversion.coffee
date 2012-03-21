Tower.Model.Conversion =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Model
        @__super__.constructor.baseClass()
      else
        @

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

    collectionName: ->
      Tower.Support.String.camelize(Tower.Support.String.pluralize(@name), true)

    resourceName: ->
      Tower.Support.String.camelize(@name, true)

    # inheritance_column
    metadata: ->
      className               = @name
      metadata                = @metadata[className]
      return metadata if metadata
      namespace               = Tower.namespace()
      name                    = Tower.Support.String.camelize(className, true)
      namePlural              = Tower.Support.String.pluralize(name)
      classNamePlural         = Tower.Support.String.pluralize(className)
      paramName               = Tower.Support.String.parameterize(name)
      paramNamePlural         = Tower.Support.String.parameterize(namePlural)
      modelName               = "#{namespace}.#{className}"
      controllerName          = "#{namespace}.#{classNamePlural}Controller"

      @metadata[className]    =
        name:                 name
        namePlural:           namePlural
        className:            className
        classNamePlural:      classNamePlural
        paramName:            paramName
        paramNamePlural:      paramNamePlural
        modelName:            modelName
        controllerName:       controllerName

  toLabel: ->
    @className()

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

  toCacheKey: ->

  toModel: ->
    @

  metadata: ->
    @constructor.metadata()

module.exports = Tower.Model.Conversion
