(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Validator.Length = (function() {

    __extends(Length, Metro.Model.Validator);

    function Length(name, value, attributes) {
      Length.__super__.constructor.apply(this, arguments);
      this.validate = (function() {
        switch (name) {
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          default:
            return this.validateLength;
        }
      }).call(this);
    }

    Length.prototype.validateMinimum = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value >= this.value)) {
        errors.push({
          attribute: attribute,
          message: Metro.t("model.errors.minimum", {
            attribute: attribute,
            value: this.value
          })
        });
        return false;
      }
      return true;
    };

    Length.prototype.validateMaximum = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value <= this.value)) {
        errors.push({
          attribute: attribute,
          message: Metro.t("model.errors.maximum", {
            attribute: attribute,
            value: this.value
          })
        });
        return false;
      }
      return true;
    };

    Length.prototype.validateLength = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value === this.value)) {
        errors.push({
          attribute: attribute,
          message: Metro.t("model.errors.length", {
            attribute: attribute,
            value: this.value
          })
        });
        return false;
      }
      return true;
    };

    return Length;

  })();

  module.exports = Metro.Model.Validator.Length;

}).call(this);
