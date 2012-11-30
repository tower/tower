var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.ViewForm = (function(_super) {
  var ViewForm;

  ViewForm = __extends(ViewForm, _super);

  function ViewForm(args, options) {
    var klass;
    ViewForm.__super__.constructor.apply(this, arguments);
    this.model = args.shift() || new Tower.Model;
    if (typeof this.model === "string") {
      klass = (function() {
        try {
          return Tower.constant(_.camelize(this.model));
        } catch (_error) {}
      }).call(this);
      if (klass) {
        this.model = new klass;
      }
    }
    this.attributes = this._extractAttributes(options);
  }

  __defineProperty(ViewForm,  "render", function(callback) {
    var _this = this;
    return this.tag("form", this.attributes, function() {
      var builder;
      _this.tag("input", {
        type: "hidden",
        name: "_method",
        value: _this.attributes["data-method"]
      });
      if (callback) {
        builder = new Tower.ViewFormBuilder([], {
          template: _this.template,
          tabindex: 1,
          accessKeys: {},
          model: _this.model,
          live: _this.live
        });
        return builder.render(callback);
      }
    });
  });

  __defineProperty(ViewForm,  "_extractAttributes", function(options) {
    var attributes, method;
    if (options == null) {
      options = {};
    }
    attributes = options.html || {};
    attributes.action = options.url || Tower.urlFor(this.model);
    if (options.hasOwnProperty("class")) {
      attributes["class"] = options["class"];
    }
    if (options.hasOwnProperty("id")) {
      attributes.id = options.id;
    }
    attributes.id || (attributes.id = _.parameterize("" + (this.model.constructor.className()) + "-form"));
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
      if (this.model && this.model.get("id")) {
        method = "put";
      } else {
        method = "post";
      }
    }
    attributes["data-method"] = method;
    attributes.method = method === "get" ? "get" : "post";
    return attributes;
  });

  return ViewForm;

})(Tower.ViewComponent);

require('./form/builder');

require('./form/field');

require('./form/fieldset');

module.exports = Tower.ViewForm;
