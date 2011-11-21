(function() {
  var File, Shift;

  Shift = require('shift');

  File = require('pathfinder').File;

  Metro.View.Rendering = (function() {

    function Rendering() {}

    Rendering.prototype.render = function() {
      var args, callback, options, self, template;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      if (!(args.length >= 2 && typeof args[args.length - 1] === "function")) {
        throw new Error("You must pass a callback to the render method");
      }
      callback = args.pop();
      if (args.length === 1) {
        if (typeof args[0] === "string") {
          options = {
            template: args[0]
          };
        } else {
          options = args[0];
        }
      } else {
        template = args[0];
        options = args[1];
        options.template = template;
      }
      options || (options = {});
      options.locals = this.context(options);
      options.type || (options.type = Metro.View.engine);
      options.engine = Shift.engine(options.type);
      if (options.hasOwnProperty("layout") && options.layout === false) {
        options.layout = false;
      } else {
        options.layout = options.layout || this.controller.layout();
      }
      self = this;
      return this._renderBody(options, function(error, body) {
        return self._renderLayout(body, options, callback);
      });
    };

    Rendering.prototype._renderBody = function(options, callback) {
      var template;
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          template = Metro.View.lookup(options.template);
          template = File.read(template);
        }
        return options.engine.render(template, options.locals, callback);
      }
    };

    Rendering.prototype._renderLayout = function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = Metro.View.lookup("layouts/" + options.layout);
        layout = File.read(layout);
        options.locals.yield = body;
        return options.engine.render(layout, options.locals, callback);
      } else {
        return callback(null, body);
      }
    };

    Rendering.prototype.context = function(options) {
      var controller, key, locals;
      controller = this.controller;
      locals = {};
      for (key in controller) {
        if (key !== "constructor") locals[key] = controller[key];
      }
      locals = require("underscore").extend(locals, this.locals || {}, options.locals);
      if (Metro.View.prettyPrint) locals.pretty = true;
      return locals;
    };

    return Rendering;

  })();

  module.exports = Metro.View.Rendering;

}).call(this);
