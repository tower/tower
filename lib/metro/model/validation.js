(function() {
  var Validation;
  Validation = (function() {
    function Validation(name, value) {
      this.name = name;
      this.value = value;
      this.attributes = Array.prototype.slice.call(arguments, 2, arguments.length);
      this.validationMethod = (function() {
        switch (name) {
          case "presence":
            return this.validatePresence;
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          case "count":
          case "length":
            return this.validateLength;
          case "format":
            if (typeof this.value === 'string') {
              this.value = new RegExp(this.value);
            }
            return this.validateFormat;
        }
      }).call(this);
    }
    Validation.prototype.validate = function(record) {
      var attribute, success, _i, _len, _ref;
      success = true;
      _ref = this.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (!this.validationMethod(record, attribute)) {
          success = false;
        }
      }
      return success;
    };
    Validation.prototype.validatePresence = function(record, attribute) {
      if (!record[attribute]) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " can't be blank"
        });
        return false;
      }
      return true;
    };
    Validation.prototype.validateMinimum = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value >= this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be a minimum of " + this.value
        });
        return false;
      }
      return true;
    };
    Validation.prototype.validateMaximum = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value <= this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be a maximum of " + this.value
        });
        return false;
      }
      return true;
    };
    Validation.prototype.validateLength = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value === this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be equal to " + this.value
        });
        return false;
      }
      return true;
    };
    Validation.prototype.validateFormat = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!this.value.exec(value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be match the format " + (this.value.toString())
        });
        return false;
      }
      return true;
    };
    return Validation;
  })();
  module.exports = Validation;
}).call(this);
