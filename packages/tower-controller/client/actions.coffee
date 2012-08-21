Tower.ControllerActions =
  # Default implementation for the 'index' action.
  index: (params) ->
    @findCollection (error, collection) =>
      @render 'index'

  # Default implementation for the 'new' action.
  new: ->
    @buildResource (error, resource) =>
      @render 'new'

  # Default implementation for the 'create' action.
  create: (callback) ->
    @createResource (error, resource) =>
      return @failure(error) unless resource

  # Default implementation for the 'show' action.
  show: ->
    @findResource (error, resource) =>
      return @failure(error) if error
      @render 'show'

  # Default implementation for the 'edit' action.
  edit: ->
    @findResource (error, resource) =>
      return @failure(error) if error
      @render 'edit'

  # Default implementation for the 'update' action.
  update: ->
    @updateResource (error, resource) =>
      return @failure(error) if error
      @redirectTo 'show'

  # @todo
  save: ->
    # if isNew create else update...

  # Default implementation for the 'destroy' action.
  destroy: ->
    @destroyResource (error, resource) =>
      return @failure(error) if error
      @redirectTo 'index'
