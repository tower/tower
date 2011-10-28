(function() {
  var Attribute;
  Attribute = (function() {
    function Attribute(type) {
      this.type = type;
      this.typecastMethod = (function() {
        switch (type) {
          case Array:
            return _typecastArray;
        }
      })();
    }
    Attribute.prototype.typecast = function(value) {
      return this.typecastMethod.call(this, value);
    };
    return Attribute;
  })();
  module.exports = Attribute;
}).call(this);
