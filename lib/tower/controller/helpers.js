
Tower.Controller.Helpers = {
  ClassMethods: {
    helper: function(object) {
      return this.helpers().push(object);
    },
    helpers: function() {
      return this.metadata().helpers;
    },
    layout: function(layout) {
      return this._layout = layout;
    }
  },
  InstanceMethods: {
    layout: function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.call(this);
      } else {
        return layout;
      }
    }
  }
};

module.exports = Tower.Controller.Helpers;
