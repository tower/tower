
  Metro.View.Rendering = {
    render: function(options, callback) {
      var self;
      options.locals = this._renderingContext(options);
      if (!options.hasOwnProperty("layout")) {
        options.layout = this.controller.layout();
      }
      self = this;
      return this._renderBody(options, function(error, body) {
        return self._renderLayout(body, options, callback);
      });
    },
    _renderBody: function(options, callback) {
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          options.template = this.store().find({
            path: options.template
          });
        }
        return this._renderString(options.template, options, callback);
      }
    },
    _renderLayout: function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = this.store().find({
          path: layout
        });
        options.locals.yield = body;
        return this._renderString(layout, options.locals, callback);
      } else {
        return callback(null, body);
      }
    },
    _renderString: function(string, options, callback) {
      var engine;
      if (options == null) options = {};
      if (options.type) {
        engine = require("shift").engine(type);
      } else {
        engine = require("shift");
      }
      return engine.render(string, options.locals, callback);
    },
    _renderingContext: function(options) {
      var controller, key, locals, value;
      controller = this.controller;
      locals = {};
      for (key in controller) {
        value = controller[key];
        if (key !== "constructor") locals[key] = value;
      }
      locals = Metro.Support.Object.extend(locals, this.locals || {}, options.locals);
      if (this.constructor.prettyPrint) locals.pretty = true;
      return locals;
    }
  };

  module.exports = Metro.View.Rendering;
