
Tower.Model.Validator.Format = (function() {

  function Format(value, attributes) {
    Format.__super__.constructor.call(this, value, attributes);
    this.value = typeof value === 'string' ? new RegExp(value) : value;
  }

  Format.prototype.validate = function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!this.value.exec(value)) {
      return this.failure(record, attribute, errors, Tower.t("model.errors.format", {
        attribute: attribute,
        value: this.value.toString()
      }), callback);
    } else {
      return this.success(callback);
    }
  };

  return Format;

})();

module.exports = Tower.Model.Validator.Format;
