
Tower.Controller.Redirecting = {
  redirectTo: function() {
    return this.redirect.apply(this, arguments);
  },
  redirect: function() {
    var _ref;
    return (_ref = this.response).redirect.apply(_ref, arguments);
  }
};

module.exports = Tower.Controller.Redirecting;
