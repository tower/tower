
Tower.Controller.Subscriptions = {
  ClassMethods: {
    subscriptions: function() {
      var args, key, options, subscriptions, _i, _len;
      subscriptions = this.metadata().subscriptions;
      if (!arguments.length) {
        return subscriptions;
      }
      args = _.flatten(_.args(arguments));
      options = _.extractOptions(args);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        key = args[_i];
        subscriptions.push(key);
      }
      return this;
    }
  }
};

Tower.Controller.Subscriptions.ClassMethods.publish = Tower.Controller.Subscriptions.ClassMethods.subscriptions;

module.exports = Tower.Controller.Subscriptions;
