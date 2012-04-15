var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Validator.Set = (function(_super) {

  __extends(Set, _super);

  Set.name = 'Set';

  function Set(name, value, attributes, options) {
    Set.__super__.constructor.call(this, name, _.castArray(value), attributes, options);
  }

  Set.prototype.validate = function(record, attribute, errors, callback) {
    var success, testValue, value;
    value = record.get(attribute);
    testValue = this.getValue(record);
    success = (function() {
      switch (this.name) {
        case 'in':
          return testValue.indexOf(value) > -1;
        case 'notIn':
          return testValue.indexOf(value) === -1;
        default:
          return false;
      }
    }).call(this);
    if (!success) {
      return this.failure(record, attribute, errors, Tower.t("model.errors.format", {
        attribute: attribute,
        value: testValue.toString()
      }), callback);
    } else {
      return this.success(callback);
    }
  };

  return Set;

})(Tower.Model.Validator);

module.exports = Tower.Model.Validator.Format;
