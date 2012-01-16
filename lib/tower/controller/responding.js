
Tower.Controller.Responding = {
  ClassMethods: {
    respondTo: function() {
      this._respondTo || (this._respondTo = []);
      return this._respondTo = this._respondTo.concat(Tower.Support.Array.args(arguments));
    }
  },
  respondTo: function() {},
  respondWith: function() {
    var args, callback, data, options;
    args = Tower.Support.Array.args(arguments);
    callback = null;
    if (typeof args[args.length - 1] === "function") callback = args.pop();
    if (typeof args[args.length - 1] === "object" && !(args[args.length - 1] instanceof Tower.Model)) {
      options = args.pop();
    } else {
      options = {};
    }
    if (callback) {
      return callback.call(this);
    } else {
      data = args;
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
            action: this.params.action
          });
      }
    }
  }
};

module.exports = Tower.Controller.Responding;
