Tower.Controller.Errors =
  ClassMethods:
    rescue: (type, method, options) ->
      app = Tower.Application.instance()
      handlers = app.currentErrorHandlers ||= []
      
      handlers.push (error) =>
        errorType = if typeof type == 'string' then global[type] else type
        if error instanceof errorType
          @instance()[method](error)
      
Tower.Controller.Errors.ClassMethods.rescueFrom = Tower.Controller.Errors.ClassMethods.rescue

module.exports = Tower.Controller.Errors
