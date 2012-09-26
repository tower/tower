
Tower.ViewRendering = {
  render: function(options, callback) {
    var type, view,
      _this = this;
    if (!options.type && options.template && typeof options.template === 'string' && !options.inline) {
      type = options.template.split('/');
      type = type[type.length - 1].split(".");
      type = type.slice(1).join();
      options.type = type !== '' ? type : this.constructor.engine;
    }
    options.type || (options.type = this.constructor.engine);
    if (!options.hasOwnProperty("layout") && this._context.layout) {
      options.layout = this._context.layout();
    }
    options.locals = this._renderingContext(options);
    if (Tower.isClient) {
      try {
        if (options.template === 'new') {
          options.template = 'edit';
        }
        options.template = options.prefixes[0] + '/' + options.template;
        view = this.renderEmberView(options);
        if (view) {
          if (callback) {
            callback.call(this, null, '');
          }
          return;
        }
      } catch (error) {
        console.log(error.stack || error);
      }
    }
    return this._renderBody(options, function(error, body) {
      if (error) {
        return callback(error, body);
      }
      return _this._renderLayout(body, options, callback);
    });
  },
  _normalizeRenderOptions: function(options) {
    var type;
    if (!options.type && options.template && typeof options.template === 'string' && !options.inline) {
      type = options.template.split('/');
      type = type[type.length - 1].split(".");
      type = type.slice(1).join();
      options.type = type !== '' ? type : this.constructor.engine;
    }
    options.type || (options.type = this.constructor.engine);
    if (!options.hasOwnProperty("layout") && this._context.layout) {
      options.layout = this._context.layout();
    }
    options.locals = this._renderingContext(options);
    return options;
  },
  partial: function(path, options, callback) {
    var prefixes, template;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    prefixes = options.prefixes;
    if (this._context) {
      prefixes || (prefixes = [this._context.collectionName]);
    }
    template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
    return this._renderString(template, options, callback);
  },
  renderWithEngine: function(template, engine) {
    var mint;
    if (Tower.isClient) {
      return "(" + template + ").call(this);";
    } else {
      mint = require("mint");
      return mint[mint.engine(engine || "coffee")](template, {}, function(error, result) {
        if (error) {
          return console.log(error);
        }
      });
    }
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
      layout = this._readTemplate("layout/" + options.layout, [], options.type);
      options.locals.body = body;
      return this._renderString(layout, options, callback);
    } else {
      return callback(null, body);
    }
  },
  _renderString: function(string, options, callback) {
    var engine, mint;
    if (options == null) {
      options = {};
    }
    if (!!options.type.match(/coffee/)) {
      return this._renderCoffeecupString(string, options, callback);
    } else if (options.type) {
      mint = require("mint");
      if (typeof string === 'function') {
        string = string();
      }
      engine = mint.engine(options.type);
      if (engine.match(/(eco|mustache)/)) {
        return mint[engine](string, options, callback);
      } else {
        return mint[engine](string, options.locals, callback);
      }
    } else {
      engine = require("mint");
      options.locals.string = string;
      return engine.render(options.locals, callback);
    }
  },
  _renderCoffeecupString: function(string, options, callback) {
    var coffeecup, e, hardcode, locals, result;
    e = null;
    result = null;
    try {
      coffeecup = Tower.module('coffeecup');
      locals = options.locals || {};
      locals.renderWithEngine = this.renderWithEngine;
      locals._readTemplate = this._readTemplate;
      locals.cache = Tower.env !== "development";
      locals.format = true;
      hardcode = Tower.View.helpers;
      hardcode = _.extend(hardcode, {
        tags: Tower.View.coffeecupTags
      });
      locals.hardcode = hardcode;
      locals._ = _;
      result = coffeecup.render(string, locals);
    } catch (error) {
      e = error;
      console.log(e.stack);
    }
    return callback(e, result);
  },
  _renderingContext: function(options) {
    var context, key, locals, value;
    locals = this;
    context = this._context;
    for (key in context) {
      value = context[key];
      if (!key.match(/^(constructor|head)/)) {
        locals[key] = value;
      }
    }
    locals = Tower._.modules(locals, options.locals);
    if (this.constructor.prettyPrint) {
      locals.pretty = true;
    }
    return locals;
  },
  _readTemplate: function(template, prefixes, ext) {
    var cachePath, options, path, result, store;
    if (typeof template !== "string") {
      return template;
    }
    options = {
      path: template,
      ext: ext,
      prefixes: prefixes
    };
    store = this.constructor.store();
    if (typeof store.findPath !== 'undefined') {
      path = store.findPath(options);
      path || (path = store.defaultPath(options));
    } else {
      path = template;
    }
    cachePath = path;
    if (Tower.isClient) {
      cachePath = 'app/templates/' + cachePath;
    }
    result = this.constructor.cache[cachePath] || require('fs').readFileSync(require('path').join(Tower.root, path), 'utf-8').toString();
    if (!result) {
      throw new Error("Template '" + template + "' was not found.");
    }
    return result;
  }
};

module.exports = Tower.ViewRendering;
