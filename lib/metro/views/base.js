(function() {
  var Base, fs, _;
  fs = require("fs");
  _ = require("underscore");
  Base = (function() {
    function Base(controller) {
      this.controller = controller || (new Metro.Controllers.Base);
    }
    Base.prototype.render = function(path, options) {
      var body, engine, layout, locals, template, type;
      if (options == null) {
        options = {};
      }
      type = options.type || Metro.Views.engine;
      engine = Metro.Views.engines()[type];
      engine = new engine;
      template = Metro.Views.lookup(path);
      locals = this.context(options);
      body = engine.compile(template, locals);
      layout = options.layout || this.controller.layout();
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
