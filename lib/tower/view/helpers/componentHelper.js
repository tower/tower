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
  widget: function() {},
  linkTo: function(title, path, options) {
    if (options == null) options = {};
    return a(_.extend(options, {
      href: path,
      title: title
    }), title.toString());
  },
  navItem: function(title, path, options) {
    if (options == null) options = {};
    return li(function() {
      return linkTo(title, path, options);
    });
  }
};

module.exports = Tower.View.ComponentHelper;
