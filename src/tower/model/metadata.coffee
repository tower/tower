Tower.Model.Metadata =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Model
        @__super__.constructor.baseClass()
      else
        @
      
    toParam: ->
      return undefined if @ == Tower.Model
      Tower.Support.String.pluralize Tower.Support.String.parameterize(@name)
    
    toKey: ->
      Tower.Support.String.parameterize(@name)
    
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

module.exports = Tower.Model.Metadata
