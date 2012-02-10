
Tower.Controller.Helpers = {
  ClassMethods: {
    helper: function(object) {
      this._helpers || (this._helpers = []);
      return this._helpers.push(object);
    },
    layout: function(layout) {
      return this._layout = layout;
    }
  },
  layout: function() {
    var layout;
    layout = this.constructor._layout;
    if (typeof layout === "function") {
      return layout.apply(this);
    } else {
      return layout;
    }
  }
};

module.exports = Tower.Controller.Helpers;
