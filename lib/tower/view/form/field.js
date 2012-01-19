var __slice = Array.prototype.slice;

Tower.View.Form.Field = (function() {

  function Field(options) {
    var key, value;
    if (options == null) options = {};
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.inputType = options.as;
    this.inputs = [];
    this.attributes = {};
  }

  Field.prototype.input = function() {
    var args, key, options;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    options = args.extractOptions;
    key = args.shift || attribute.name;
    return this.inputs.push(inputFor(inputType, key, options));
  };

  Field.prototype.tag = function() {
    var args, key;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.template.tag(key, args);
  };

  Field.prototype.render = function(block) {
    var _this = this;
    return this.tag("li", this.attributes, function() {
      return _this.tag("input", {
        type: "email"
      });
    });
  };

  Field.prototype.inputFor = function(key, attribute, options) {
    if (options == null) options = {};
    return {
      Storefront: {
        "Components": {
          "Form": "Input".find(key.toSym)["new"](this.inputAttributes.merge(options))
        }
      }
    };
  };

  Field.prototype.extractElements = function(options) {
    var elements, _base;
    if (options == null) options = {};
    elements = [];
    if (typeof (_base = ["hidden", "submit"]).include === "function" ? _base.include(inputType) : void 0) {
      elements.push("inputs");
    } else {
      if ((this.label.present != null) && (this.label.value != null)) {
        elements.push("label");
      }
      elements = elements.concat(["inputs", "hints", "errors"]);
    }
    return elements;
  };

  return Field;

})();
