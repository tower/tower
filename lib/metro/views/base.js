(function() {
  var Base, fs, _;
  fs = require("fs");
  _ = require("underscore");
  Base = (function() {
    function Base(controller) {
      this.controller = controller || (new Metro.Controllers.Base);
    }
    Base.prototype.render = function(path, options) {
      var engine, template, type;
      if (options == null) {
        options = {};
      }
      type = options.type || Metro.Views.engine;
      engine = Metro.Views.engines()[type];
      engine = new engine;
      template = Metro.Views.lookup(path);
      return engine.compile(template, this.context(options));
    };
    Base.prototype.context = function(options) {
      var controller, locals;
      controller = this.controller;
      locals = {};
      _.each(_.keys(controller.constructor.prototype), function(key) {
        if (key !== "constructor") {
          return locals[key] = controller[key];
        }
      });
      locals = _.extend(locals, this.locals || {}, options.locals);
      return locals;
    };
    return Base;
  })();
  module.exports = Base;
}).call(this);
