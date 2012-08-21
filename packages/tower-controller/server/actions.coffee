Tower.ControllerActions =  
  # Default implementation for the 'index' action.
  index: ->
    @_index (format) =>
      format.html => @render 'index'
      format.json => @render json: @collection, status: 200

  # Default implementation for the 'new' action.
  new: ->
    @_new (format) =>
      format.html => @render 'new'
      format.json => @render json: @resource, status: 200

  # Default implementation for the 'create' action.
  create: (callback) ->
    @_create (format) =>
      format.html => @redirectTo action: 'show'
      format.json => @render json: @resource, status: 200

  # Default implementation for the 'show' action.
  show: ->
    @_show (format) =>
      format.html => @render 'show'
      format.json => @render json: @resource, status: 200

  # Default implementation for the 'edit' action.
  edit: ->
    @_edit (format) =>
      format.html => @render 'edit'
      format.json => @render json: @resource, status: 200

  # Default implementation for the 'update' action.
  update: ->
    @_update (format) =>
      format.html => @redirectTo action: 'show'
      format.json => @render json: @resource, status: 200

  # Default implementation for the 'destroy' action.
  destroy: ->
    @_destroy (format) =>
      format.html => @redirectTo action: 'index'
      format.json => @render json: @resource, status: 200

  # @private
  _index: (callback) ->
    @findCollection (error, collection) =>
      @respondWith collection, callback

  # @private
  _new: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error) unless resource
      @respondWith(resource, callback)

  # @private
  _create: (callback) ->
    @createResource (error, resource) =>
      return @failure(error, callback) unless resource
      @respondWithStatus Tower._.isBlank(resource.errors), callback

  # @private
  _show: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback

  # @private
  _edit: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback

  # @private
  _update: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.updateAttributes @params[@resourceName], (error) =>
        @respondWithStatus !!!error && Tower._.isBlank(resource.errors), callback

  # @private
  _destroy: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.destroy (error) =>
        @respondWithStatus !!!error, callback

module.exports = Tower.ControllerActions
