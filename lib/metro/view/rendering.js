
  Metro.View.Rendering = {
    render: function(options, callback) {
      var self;
      options.locals = this._renderingContext(options);
      options.type || (options.type = this.constructor.engine);
      if (!options.hasOwnProperty("layout") && this.context.layout) {
        options.layout = this.context.layout();
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
          options.template = this._readTemplate(options.template, options.type);
        }
        return this._renderString(options.template, options, callback);
      }
    },
    _renderLayout: function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = this._readTemplate("layouts/" + options.layout, options.type);
        options.locals.yield = body;
        return this._renderString(layout, options, callback);
      } else {
        return callback(null, body);
      }
    },
    _renderString: function(string, options, callback) {
      var engine;
      if (options == null) options = {};
      if (options.type) {
        engine = require("shift").engine(options.type);
        return engine.render(string, options.locals, callback);
      } else {
        engine = require("shift");
        options.locals.string = string;
        return engine.render(options.locals, callback);
      }
    },
    _renderingContext: function(options) {
      var context, key, locals, value;
      context = this.context;
      locals = {};
      for (key in context) {
        value = context[key];
        if (key !== "constructor") locals[key] = value;
      }
      locals = Metro.Support.Object.extend(locals, this.locals || {}, options.locals);
      if (this.constructor.prettyPrint) locals.pretty = true;
      return locals;
    },
    _readTemplate: function(path, ext) {
      var template;
      template = this.constructor.store().find({
        path: path,
        ext: ext
      });
      if (!template) throw new Error("Template '" + path + "' was not found.");
      return template;
    }
  };

  module.exports = Metro.View.Rendering;
