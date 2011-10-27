(function() {
  var Validation;
  Validation = (function() {
    function Validation(name) {
      this.name = name;
      this.attributes = Array.prototype.slice.call(arguments, 1, arguments.length);
    }
    Validation.prototype.validate = function(record) {
      var attribute, success, value, _i, _len, _ref;
      success = true;
      _ref = this.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        value = record[attribute];
        success = !!(value != null);
        if (!success) {
          record.errors().push({
            attribute: attribute,
            message: "" + attribute + " can't be blank"
          });
          return false;
        }
      }
      return true;
    };
    return Validation;
  })();
  module.exports = Validation;
}).call(this);
