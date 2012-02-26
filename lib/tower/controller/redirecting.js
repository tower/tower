
Tower.Controller.Redirecting = {
  redirectTo: function() {
    return this.redirect.apply(this, arguments);
  },
  redirect: function() {
    var _ref;
    (_ref = this.response).redirect.apply(_ref, arguments);
    if (this.callback) return this.callback();
  }
};

module.exports = Tower.Controller.Redirecting;
