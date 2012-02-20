
Tower.View.ComponentHelper = {
  formFor: function() {
    var _ref;
    return (_ref = Tower.View.Form).render.apply(_ref, arguments);
  },
  tableFor: function() {
    var _ref;
    return (_ref = Tower.View.Table).render.apply(_ref, arguments);
  }
};

module.exports = Tower.View.ComponentHelper;
