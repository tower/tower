
  Metro.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        this._respondTo || (this._respondTo = []);
        return this._respondTo = this._respondTo.concat(Metro.Support.Array.args(arguments));
      }
    },
    respondWith: function() {
      var callback, data;
      data = arguments[0];
      if (arguments.length > 1 && typeof arguments[arguments.length - 1] === "function") {
        callback = arguments[arguments.length - 1];
      }
      switch (this.format) {
        case "json":
          return this.render({
            json: data
          });
        case "xml":
          return this.render({
            xml: data
          });
        default:
          return this.render({
            action: this.action
          });
      }
    }
  };

  module.exports = Metro.Controller.Responding;
