
  Coach.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        this._respondTo || (this._respondTo = []);
        return this._respondTo = this._respondTo.concat(Coach.Support.Array.args(arguments));
      }
    },
    respondWith: function() {
      var args, callback, options;
      args = Coach.Support.Array.args(arguments);
      callback = null;
      if (typeof args[args.length - 1] === "function") callback = args.pop();
      if (typeof args[args.length - 1] === "object" && !(args[args.length - 1] instanceof Coach.Model)) {
        options = args.pop();
      } else {
        options = {};
      }
      return this.respond(callback);
    },
    respond: function(callback) {
      var data;
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
              action: this.action
            });
        }
      }
    }
  };

  module.exports = Coach.Controller.Responding;
