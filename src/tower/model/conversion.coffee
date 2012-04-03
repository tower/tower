# @module
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
    
    # All of the different names related to this class.
    # 
    # The result is memoized.
    #
    # @return [Object]
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
