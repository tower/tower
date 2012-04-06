var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Validator.Format = (function(_super) {

  __extends(Format, _super);

  function Format(name, value, attributes) {
    Format.__super__.constructor.call(this, name, value, attributes);
    if (this.value.hasOwnProperty('with')) this.value = this.value["with"];
    if (typeof this.value === 'string') {
      this.matcher = "is" + (_.camelCase(value, true));
    }
  }

  Format.prototype.validate = function(record, attribute, errors, callback) {
    var success, value;
    value = record.get(attribute);
    success = this.matcher ? !!_[this.matcher](value) : !!this.value.exec(value);
    if (!success) {
      return this.failure(record, attribute, errors, Tower.t("model.errors.format", {
        attribute: attribute,
        value: this.value.toString()
      }), callback);
    } else {
      return this.success(callback);
    }
  };

  return Format;

})(Tower.Model.Validator);

module.exports = Tower.Model.Validator.Format;
