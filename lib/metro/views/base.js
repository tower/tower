(function() {
  var Base, fs, _;
  fs = require("fs");
  _ = require("underscore");
  Base = (function() {
    function Base(controller) {
      this.controller = controller || (new Metro.Controllers.Base);
    }
    Base.prototype.render = function(options) {
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
      type = options.type || Metro.Views.engine;
      engine = Metro.Views.engines()[type];
      engine = new engine;
      if (options.text) {
        body = options.text;
      } else if (options.json) {
        body = typeof options.json === "string" ? options.json : JSON.stringify(options.json);
      } else {
        if (!options.inline) {
          template = Metro.Views.lookup(options.template);
          template = Metro.Support.Path.read(template);
        }
        body = engine.compile(template, locals);
      }
      if (options.hasOwnProperty("layout") && options.layout === false) {
        layout = false;
      } else {
        layout = options.layout || this.controller.layout();
      }
      if (layout) {
        layout = Metro.Views.lookup("layouts/" + layout);
        locals.yield = body;
        body = engine.compile(layout, locals);
      }
      return body;
    };
    Base.prototype.context = function(options) {
      var controller, key, locals;
      controller = this.controller;
      locals = {};
      for (key in controller) {
        if (key !== "constructor") {
          locals[key] = controller[key];
        }
      }
      locals = _.extend(locals, this.locals || {}, options.locals);
      if (Metro.Views.pretty_print) {
        locals.pretty = true;
      }
      return locals;
    };
    return Base;
  })();
  module.exports = Base;
}).call(this);
