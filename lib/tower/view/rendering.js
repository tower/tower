
Tower.View.Rendering = {
  render: function(options, callback) {
    var self;
    options.type || (options.type = this.constructor.engine);
    if (!options.hasOwnProperty("layout") && this._context.layout) {
      options.layout = this._context.layout();
    }
    options.locals = this._renderingContext(options);
    self = this;
    return this._renderBody(options, function(error, body) {
      if (error) return callback(error, body);
      return self._renderLayout(body, options, callback);
    });
  },
  partial: function(path, options, callback) {
    var prefixes, template;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    prefixes = options.prefixes;
    if (this._context) prefixes || (prefixes = [this._context.collectionName]);
    template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
    return this._renderString(template, options, callback);
  },
  _renderBody: function(options, callback) {
    if (options.text) {
      return callback(null, options.text);
    } else if (options.json) {
      return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
    } else {
      if (!options.inline) {
        options.template = this._readTemplate(options.template, options.prefixes, options.type);
      }
      return this._renderString(options.template, options, callback);
    }
  },
  _renderLayout: function(body, options, callback) {
    var layout;
    if (options.layout) {
      layout = this._readTemplate("layouts/" + options.layout, [], options.type);
      options.locals.body = body;
      return this._renderString(layout, options, callback);
    } else {
      return callback(null, body);
    }
  },
  _renderString: function(string, options, callback) {
    var e, engine, locals, result;
    if (options == null) options = {};
    if (!!options.type.match(/coffee/)) {
      e = null;
      result = null;
      try {
        locals = options.locals;
        locals.renderWithEngine = this.renderWithEngine;
        locals.cache = Tower.env !== "development";
        locals.format = true;
        locals.hardcode = _.extend({}, Tower.View.ComponentHelper, Tower.View.AssetHelper, Tower.View.HeadHelper, Tower.View.RenderingHelper, Tower.View.StringHelper, {
          tags: require('coffeekup').tags
        });
        result = require('coffeekup').render(string, locals);
      } catch (error) {
        e = error;
      }
      return callback(e, result);
    } else if (options.type) {
      engine = require("shift").engine(options.type);
      return engine.render(string, options.locals, callback);
    } else {
      engine = require("shift");
      options.locals.string = string;
      return engine.render(options.locals, callback);
    }
  },
  _renderingContext: function(options) {
    var key, locals, value, _ref;
    locals = this;
    _ref = this._context;
    for (key in _ref) {
      value = _ref[key];
      if (!key.match(/^(constructor)/)) this[key] = value;
    }
    locals = Tower.Support.Object.extend(locals, options.locals);
    if (this.constructor.prettyPrint) locals.pretty = true;
    return locals;
  },
  _readTemplate: function(template, prefixes, ext) {
    var result;
    if (typeof template !== "string") return template;
    result = this.constructor.store().find({
      path: template,
      ext: ext,
      prefixes: prefixes
    });
    if (!result) throw new Error("Template '" + template + "' was not found.");
    return result;
  },
  renderWithEngine: function(template, engine) {
    return require("shift").engine(engine || "coffee").render(template);
  }
};

module.exports = Tower.View.Rendering;
