Tower.ControllerErrors =
  ClassMethods:
    rescue: (type, method, options) ->
      Tower.Application.instance().errorHandlers.push (error) =>
        errorType = if typeof type == 'string' then global[type] else type
        if error instanceof errorType
          @instance()[method](error)

  # @todo make this more robust, just going to render simple error message for now
  # @see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  handleError: (error) ->
    @unauthorized(error)

  unauthorized: (error) ->
    @render status: 401, json: error: error.toString()

Tower.ControllerErrors.ClassMethods.rescueFrom = Tower.ControllerErrors.ClassMethods.rescue

module.exports = Tower.ControllerErrors
