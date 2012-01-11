
Tower.Controller.Urls = {
  ClassMethods: {
    helper: function(object) {
      this._helpers || (this._helpers = []);
      return this._helpers.push(object);
    }
  }
};

module.exports = Tower.Controller.Urls;
