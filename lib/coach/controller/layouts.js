
  Coach.Controller.Layouts = {
    ClassMethods: {
      layout: function(layout) {
        return this._layout = layout;
      },
      theme: function(theme) {
        return this._theme = theme;
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

  module.exports = Coach.Controller.Layouts;
