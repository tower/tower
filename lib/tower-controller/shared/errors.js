
Tower.ControllerErrors = {
  ClassMethods: {
    rescue: function(type, method, options) {
      var _this = this;
      return Tower.Application.instance().errorHandlers.push(function(error) {
        var errorType;
        errorType = typeof type === 'string' ? global[type] : type;
        if (error instanceof errorType) {
          return _this.instance()[method](error);
        }
      });
    }
  },
  handleError: function(error) {
    return this.unauthorized(error);
  },
  unauthorized: function(error) {
    return this.render({
      status: 401,
      json: {
        error: error.toString()
      }
    });
  }
};

Tower.ControllerErrors.ClassMethods.rescueFrom = Tower.ControllerErrors.ClassMethods.rescue;

module.exports = Tower.ControllerErrors;
