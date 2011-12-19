
  Coach.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        this._helpers || (this._helpers = []);
        return this._helpers.push(object);
      }
    },
    urlFor: function() {}
  };

  module.exports = Coach.Controller.Helpers;
