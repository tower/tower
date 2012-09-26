var __slice = [].slice;

Tower.ViewComponentHelper = {
  formFor: function() {
    var _c, _ref;
    _c = typeof __cc === 'undefined' ? __ck : __cc;
    return (_ref = Tower.ViewForm).render.apply(_ref, [_c].concat(__slice.call(arguments)));
  },
  tableFor: function() {
    var _c, _ref;
    _c = typeof __cc === 'undefined' ? __ck : __cc;
    return (_ref = Tower.ViewTable).render.apply(_ref, [_c].concat(__slice.call(arguments)));
  },
  widget: function() {},
  linkTo: function(title, path, options) {
    if (options == null) {
      options = {};
    }
    return a(_.extend(options, {
      href: path,
      title: title
    }), title.toString());
  },
  navItem: function(title, path, options) {
    if (options == null) {
      options = {};
    }
    return li(function() {
      return linkTo(title, path, options);
    });
  },
  term: function(key, value) {
    dt(key);
    return dd(value);
  }
};

module.exports = Tower.ViewComponentHelper;
