(function() {
  var Concern;
  Concern = (function() {
    function Concern() {
      Concern.__super__.constructor.apply(this, arguments);
    }
    Concern.included = function() {
      var _ref;
      if ((_ref = this._dependencies) == null) {
        this._dependencies = [];
      }
      if (this.hasOwnProperty("ClassMethods")) {
        this.extend(this.ClassMethods);
      }
      if (this.hasOwnProperty("InstanceMethods")) {
        return this.include(this.InstanceMethods);
      }
    };
    Concern._appendFeatures = function() {};
    return Concern;
  })();
  module.exports = Concern;
}).call(this);
