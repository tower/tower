var __slice = Array.prototype.slice;

Tower.View.Form = (function() {

  Form.render = function() {
    return ((function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(this, arguments, function() {})).render();
  };

  function Form() {
    var args, klass;
    args = Tower.Support.Array.args(arguments);
    this.template = args.shift();
    this.model = args.shift();
    if (typeof this.model === "string") {
      klass = Tower.constant(Tower.Support.String.camelize(this.model));
      this.model = klass ? new klass : null;
    }
    this.callback = args.pop();
    this.attributes = this._extractAttributes(args.pop());
  }

  Form.prototype.tag = function() {
    var args, key;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.template.tag(key, args);
  };

  Form.prototype.render = function(callback) {
    var _this = this;
    return this.tag("form", this.attributes, function() {
      var builder;
      _this.tag("input", {
        type: "hidden",
        name: "_method",
        value: _this.attributes["data-method"]
      });
      if (_this.callback) {
        builder = new Tower.View.Form.Builder({
          template: _this.template,
          tabindex: 1,
          accessKeys: {},
          model: _this.model
        });
        return builder.render(_this.callback);
      }
    });
  };

  Form.prototype._extractAttributes = function(options) {
    var attributes, method;
    if (options == null) options = {};
    attributes = options.html || {};
    attributes.action = options.url;
    if (options.hasOwnProperty("class")) attributes["class"] = options["class"];
    if (options.hasOwnProperty("id")) attributes.id = options.id;
    if (options.multipart || attributes.multipart === true) {
      attributes.enctype = "multipart/form-data";
    }
    attributes.role = "form";
    attributes.novalidate = "true";
    if (options.hasOwnProperty("validate")) {
      attributes["data-validate"] = options.validate.toString();
    }
    method = attributes.method || options.method;
    if (!method || method === "") {
      if (this.model && this.model.isNew()) {
        method = "post";
      } else {
        method = "post";
      }
    }
    attributes["data-method"] = method;
    return attributes.method = method === "get" ? "get" : "post";
  };

  return Form;

})();

require('./form/builder');

require('./form/fieldset');

require('./form/field');

module.exports = Tower.View.Form;
