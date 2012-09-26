
Tower.ControllerCaching = {
  freshWhen: function() {},
  stale: function() {},
  expiresIn: function() {},
  store: function() {
    return this._store || (this._store = {});
  }
};

module.exports = Tower.ControllerCaching;
