
  Metro.Support.Concern = (function() {

    function Concern() {
      Concern.__super__.constructor.apply(this, arguments);
    }

    Concern.included = function() {
      this._dependencies || (this._dependencies = []);
      if (this.hasOwnProperty("ClassMethods")) this.extend(this.ClassMethods);
      if (this.hasOwnProperty("InstanceMethods")) {
        return this.include(this.InstanceMethods);
      }
    };

    Concern._appendFeatures = function() {};

    return Concern;

  })();

  module.exports = Metro.Support.Concern;
