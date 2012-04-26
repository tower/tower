(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Model.Validator.Length = (function(_super) {

    __extends(Length, _super);

    function Length(name, value, attributes, options) {
      Length.__super__.constructor.apply(this, arguments);
      this.validate = (function() {
        switch (name) {
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          case "gte":
            return this.validateGreaterThanOrEqual;
          case "gt":
            return this.validateGreaterThan;
          case "lte":
            return this.validateLessThanOrEqual;
          case "lt":
            return this.validateLessThan;
          default:
            return this.validateLength;
        }
      }).call(this);
    }

    Length.prototype.validateGreaterThanOrEqual = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value >= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateGreaterThan = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value > this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateLessThanOrEqual = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value <= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateLessThan = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value < this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateMinimum = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value >= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateMaximum = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value <= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.maximum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateLength = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value === this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.length", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    return Length;

  })(Tower.Model.Validator);

  module.exports = Tower.Model.Validator.Length;

}).call(this);
