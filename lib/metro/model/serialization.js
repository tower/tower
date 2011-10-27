(function() {
  var Serialization;
  Serialization = (function() {
    function Serialization() {}
    Serialization.prototype.toXML = function() {};
    Serialization.prototype.toJSON = function() {
      return JSON.stringify(this.attributes);
    };
    return Serialization;
  })();
  module.exports = Serialization;
}).call(this);
