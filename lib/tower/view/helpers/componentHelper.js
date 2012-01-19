var __slice = Array.prototype.slice;

Tower.View.ComponentHelper = {
  formFor: function() {
    var _ref;
    return (_ref = Tower.View.Form).render.apply(_ref, [__ck].concat(__slice.call(arguments)));
  },
  tableFor: function() {
    var _ref;
    return (_ref = Tower.View.Table).render.apply(_ref, [__ck].concat(__slice.call(arguments)));
  },
  widget: function() {}
};

module.exports = Tower.View.ComponentHelper;
