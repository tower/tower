var _;

_ = Tower._;

Tower.ControllerHelpers = {
  ClassMethods: {
    helper: function(object) {
      return this.helpers().push(object);
    },
    helpers: function() {
      return this.metadata().helpers;
    },
    layout: function(layout) {
      return this.metadata().layout = layout;
    }
  },
  layout: function() {
    var layout;
    layout = this.constructor.metadata().layout;
    if (typeof layout === 'function') {
      return layout.call(this);
    } else {
      return layout;
    }
  }
};
