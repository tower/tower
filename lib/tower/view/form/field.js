var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
  __slice = Array.prototype.slice;

Tower.View.Form.Field = (function(_super) {

  __extends(Field, _super);

  Field.prototype.addClass = function(string, args) {
    var arg, result, _i, _len;
    result = string ? string.split(/\s+/g) : [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      if (!arg) continue;
      if (!(result.indexOf(arg) > -1)) result.push(arg);
    }
    return result.join(" ");
  };

  Field.prototype.toId = function(options) {
    var result;
    if (options == null) options = {};
    result = Tower.Support.String.parameterize(this.model.constructor.name);
    if (options.parentIndex) result += "-" + options.parentIndex;
    result += "-" + this.attribute;
    result += "-" + (options.type || "field");
    if (this.index != null) result += "-" + this.index;
    return result;
  };

  Field.prototype.toParam = function(options) {
    var result;
    if (options == null) options = {};
    result = Tower.Support.String.parameterize(this.model.constructor.name);
    if (options.parentIndex) result += "[" + options.parentIndex + "]";
    result += "[" + this.attribute + "]";
    if (this.index != null) result += "[" + this.index + "]";
    return result;
  };

  function Field(args, options) {
    var classes, field, inputType, pattern, _base, _base2, _base3, _base4, _base5, _base6;
    this.labelValue = options.label;
    delete options.label;
    Field.__super__.constructor.call(this, args, options);
    this.required || (this.required = false);
    field = this.model.constructor.fields()[this.attribute];
    options.as || (options.as = field ? Tower.Support.String.camelize(field.type, true) : "string");
    this.inputType = inputType = options.as;
    this.required = field.required === true;
    classes = [Tower.View.fieldClass, inputType];
    if (!(["submit", "fieldset"].indexOf(inputType) > -1)) {
      classes.push(field.required ? Tower.View.requiredClass : Tower.View.optionalClass);
      classes.push(field.errors ? Tower.View.errorClass : Tower.View.validClass);
      if (options.validate !== false && field.validations) {
        classes.push(Tower.View.validateClass);
      }
    }
    this.fieldHTML["class"] = this.addClass(this.fieldHTML["class"], classes);
    if (!this.fieldHTML.id && Tower.View.idEnabledOn.indexOf("field") > -1) {
      this.fieldHTML.id = this.toId({
        type: "field",
        index: this.index,
        parentIndex: this.parentIndex
      });
    }
    this.inputHTML.id = this.toId({
      type: "input",
      index: this.index,
      parentIndex: this.parentIndex
    });
    (_base = this.labelHTML)["for"] || (_base["for"] = this.inputHTML.id);
    this.labelHTML["class"] = this.addClass(this.labelHTML["class"], [Tower.View.labelClass]);
    if (this.labelValue !== false) {
      this.labelValue || (this.labelValue = Tower.Support.String.camelize(this.attribute.toString()));
    }
    this.attributes = this.fieldHTML;
    if (options.hint !== false) {
      this.errorHTML["class"] = this.addClass(this.errorHTML["class"], [Tower.View.errorClass]);
      if (Tower.View.includeAria && Tower.View.hintIsPopup) {
        (_base2 = this.errorHTML).role || (_base2.role = "tooltip");
      }
    }
    (_base3 = this.inputHTML).name || (_base3.name = this.toParam());
    this.value = options.value;
    this.dynamic = options.dynamic === true;
    this.richInput = options.hasOwnProperty("rich_input") ? !!options.rich_input : Tower.View.richInput;
    this.validate = options.validate !== false;
    classes = [inputType, Tower.Support.String.parameterize(this.attribute), this.inputHTML["class"]];
    if (!(["submit", "fieldset"].indexOf(inputType) > -1)) {
      classes.push(field.required ? Tower.View.requiredClass : Tower.View.optionalClass);
      classes.push(field.errors ? Tower.View.errorClass : Tower.View.validClass);
      classes.push("input");
      if (options.validate !== false && field.validations) {
        classes.push(Tower.View.validateClass);
      }
    }
    this.inputHTML["class"] = this.addClass(this.inputHTML["class"], classes);
    if (options.placeholder) this.inputHTML.placeholder = options.placeholder;
    if (options.hasOwnProperty("value")) {
      (_base4 = this.inputHTML).value || (_base4.value = options.value);
    }
    if (options.hasOwnProperty("max")) {
      (_base5 = this.inputHTML).maxlength || (_base5.maxlength = options.max);
    }
    pattern = options.match;
    if (_.isRegExp(pattern)) pattern = pattern.toString();
    if (pattern != null) this.inputHTML["data-match"] = pattern;
    this.inputHTML["aria-required"] = this.required.toString();
    if (this.required === true) this.inputHTML.required = "true";
    if (this.disabled) this.inputHTML.disabled = "true";
    if (this.autofocus === true) this.inputHTML.autofocus = "true";
    if (this.dynamic) this.inputHTML["data-dynamic"] = "true";
    if (this.inputHTML.placeholder) {
      (_base6 = this.inputHTML).title || (_base6.title = this.inputHTML.placeholder);
    }
    this.autocomplete = this.inputHTML.autocomplete === true;
    if (this.autocomplete && Tower.View.includeAria) {
      this.inputHTML["aria-autocomplete"] = (function() {
        switch (this.autocomplete) {
          case "inline":
          case "list":
          case "both":
            return this.autocomplete;
          default:
            return "both";
        }
      }).call(this);
    }
  }

  Field.prototype.input = function() {
    var args, key, options;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    options = _.extend(this.inputHTML, Tower.Support.Array.extractOptions(args));
    key = args.shift() || this.attribute;
    return this["" + this.inputType + "Input"](key, options);
  };

  Field.prototype.checkboxInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "checkbox"
    }, options));
  };

  Field.prototype.stringInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "text"
    }, options));
  };

  Field.prototype.fileInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "file"
    }, options));
  };

  Field.prototype.textInput = function(key, options) {
    return this.tag("textarea", options);
  };

  Field.prototype.password_input = function(key, options) {
    return this.tag("input", _.extend({
      type: "password"
    }, options));
  };

  Field.prototype.emailInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "email"
    }, options));
  };

  Field.prototype.urlInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "url"
    }, options));
  };

  Field.prototype.numberInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "string",
      "data-type": "numeric"
    }, options));
  };

  Field.prototype.searchInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "search",
      "data-type": "search"
    }, options));
  };

  Field.prototype.phoneInput = function(key, options) {
    return this.tag("input", _.extend({
      type: "tel",
      "data-type": "phone"
    }, options));
  };

  Field.prototype.label = function() {
    var _this = this;
    if (!this.labelValue) return;
    return this.tag("label", this.labelHTML, function() {
      _this.tag("span", _this.labelValue);
      if (_this.required) {
        return _this.tag("abbr", {
          title: Tower.View.requiredTitle,
          "class": Tower.View.requiredClass
        }, function() {
          return Tower.View.requiredAbbr;
        });
      } else {
        return _this.tag("abbr", {
          title: Tower.View.optionalTitle,
          "class": Tower.View.optionalClass
        }, function() {
          return Tower.View.optionalAbbr;
        });
      }
    });
  };

  Field.prototype.render = function(block) {
    var _this = this;
    return this.tag(Tower.View.fieldTag, this.attributes, function() {
      if (block) {
        return block.call(_this);
      } else {
        _this.label();
        return _this.input();
      }
    });
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

})(Tower.View.Component);
