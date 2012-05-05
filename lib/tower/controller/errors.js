
Tower.Controller.Errors = {
  ClassMethods: {
    rescue: function(type, method, options) {
      var app, handlers,
        _this = this;
      app = Tower.Application.instance();
      handlers = app.currentErrorHandlers || (app.currentErrorHandlers = []);
      return handlers.push(function(error) {
        var errorType;
        errorType = typeof type === 'string' ? global[type] : type;
        if (error instanceof errorType) {
          return _this.instance()[method](error);
        }
      });
    }
  }
};

Tower.Controller.Errors.ClassMethods.rescueFrom = Tower.Controller.Errors.ClassMethods.rescue;

module.exports = Tower.Controller.Errors;
