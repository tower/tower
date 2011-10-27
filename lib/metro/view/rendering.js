(function() {
  var Rendering;
  Rendering = (function() {
    function Rendering() {}
    Rendering.prototype.render = function(options) {
      var body, engine, layout, locals, template, type;
      if (arguments.length === 1) {
        if (typeof arguments[0] === "string") {
          options = {
            template: arguments[0]
          };
        } else {
          options = arguments[0];
        }
      } else {
        template = arguments[0];
        options = arguments[1];
        options.template = template;
      }
      if (options == null) {
        options = {};
      }
      locals = this.context(options);
      type = options.type || Metro.View.engine;
      engine = Metro.engine(type);
      if (options.text) {
        body = options.text;
      } else if (options.json) {
        body = typeof options.json === "string" ? options.json : JSON.stringify(options.json);
      } else {
        if (!options.inline) {
          template = Metro.View.lookup(options.template);
          template = Metro.Support.Path.read(template);
        }
        body = engine.render(template, locals);
      }
      if (options.hasOwnProperty("layout") && options.layout === false) {
        layout = false;
      } else {
        layout = options.layout || this.controller.layout();
      }
      if (layout) {
        layout = Metro.View.lookup("layouts/" + layout);
        layout = Metro.Support.Path.read(layout);
        locals.yield = body;
        body = engine.render(layout, locals);
      }
      return body;
    };
    Rendering.prototype.context = function(options) {
      var controller, key, locals;
      controller = this.controller;
      locals = {};
      for (key in controller) {
        if (key !== "constructor") {
          locals[key] = controller[key];
        }
      }
      locals = require("underscore").extend(locals, this.locals || {}, options.locals);
      if (Metro.View.pretty_print) {
        locals.pretty = true;
      }
      return locals;
    };
    return Rendering;
  })();
  module.exports = Rendering;
}).call(this);
