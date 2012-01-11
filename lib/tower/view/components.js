
Tower.View.Components = {
  formFor: function() {
    var _ref;
    return (_ref = Tower.View.Components.Form).render.apply(_ref, arguments);
  }
};

Tower.View.Components.Form = (function() {

  Form.render = function() {
    return ((function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(this, arguments, function() {})).render();
  };

  function Form() {
    var args, attributes, callback, method, model, options;
    args = Tower.Support.Array.args(arguments);
    callback = args.pop();
    if (args[0] instanceof Tower.Model) model = args.shift();
    options = args.pop() || {};
    model || (model = options.model);
    this.model = model;
    this.options = options;
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
      attributes["data-validate"] = options.validate.toS;
    }
    method = attributes.method || options.method;
    if (!method || method === "") {
      if (this.model.isNew()) {
        method = "post";
      } else {
        method = "put";
      }
    }
    attributes["data-method"] = method;
    attributes.method = method === "get" ? "get" : "post";
    this.attributes = attributes;
    this.render();
  }

  Form.prototype.render = function() {
    console.log(form);
    return form(this.attributes, function() {
      return input({
        type: "hidden",
        name: "_method",
        value: this.attributes["data-method"]
      });
    });
  };

  return Form;

})();

module.exports = Tower.View.Components;
