var __slice = Array.prototype.slice;

Tower.View.Form.Fieldset = (function() {

  function Fieldset(options) {
    var attributes, key, value;
    if (options == null) options = {};
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.attributes = attributes = {};
    delete attributes.index;
    delete attributes.parentIndex;
    delete attributes.label;
    this.builder = new Tower.View.Form.Builder({
      template: this.template,
      model: this.model,
      attribute: this.attribute,
      index: this.index,
      parentIndex: this.parentIndex
    });
  }

  Fieldset.prototype.tag = function() {
    var args, key;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.template.tag(key, args);
  };

  Fieldset.prototype.render = function(block) {
    var _this = this;
    return this.tag("fieldset", this.attributes, function() {
      if (_this.label) {
        _this.tag("legend", {
          "class": "legend"
        }, function() {
          return _this.tag("span", _this.label);
        });
      }
      return _this.tag("ol", {
        "class": "fields"
      }, function() {
        return _this.builder.render(block);
      });
    });
  };

  return Fieldset;

})();

module.exports = Tower.View.Form.Fieldset;
