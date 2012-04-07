
Tower.Controller.Rendering = {
  ClassMethods: {
    addRenderer: function(key, block) {
      return this.renderers()[key] = block;
    },
    addRenderers: function(renderers) {
      var block, key;
      if (renderers == null) renderers = {};
      for (key in renderers) {
        block = renderers[key];
        this.addRenderer(key, block);
      }
      return this;
    },
    renderers: function() {
      return this._renderers || (this._renderers = {});
    }
  },
  InstanceMethods: {
    render: function() {
      return this.renderToBody(this._normalizeRender.apply(this, arguments));
    },
    renderToBody: function(options) {
      this._processRenderOptions(options);
      return this._renderTemplate(options);
    },
    renderToString: function() {
      return this.renderToBody(this._normalizeRender.apply(this, arguments));
    },
    sendFile: function(path, options) {
      if (options == null) options = {};
    },
    sendData: function(data, options) {
      if (options == null) options = {};
    },
    _renderTemplate: function(options) {
      var callback, view, _base, _callback,
        _this = this;
      _callback = options.callback;
      callback = function(error, body) {
        if (error) {
          _this.status || (_this.status = 404);
          _this.body = error.stack;
        } else {
          _this.status || (_this.status = 200);
          _this.body = body;
        }
        if (_callback) _callback.apply(_this, arguments);
        if (_this.callback) return _this.callback();
      };
      if (this._handleRenderers(options, callback)) return;
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = "text/html");
      view = new Tower.View(this);
      try {
        return view.render.call(view, options, callback);
      } catch (error) {
        return callback(error);
      }
    },
    _handleRenderers: function(options, callback) {
      var name, renderer, _ref;
      _ref = Tower.Controller.renderers();
      for (name in _ref) {
        renderer = _ref[name];
        if (options.hasOwnProperty(name)) {
          renderer.call(this, options[name], options, callback);
          return true;
        }
      }
      return false;
    },
    _processRenderOptions: function(options) {
      if (options == null) options = {};
      if (options.status) this.status = options.status;
      if (options.contentType) this.headers["Content-Type"] = options.contentType;
      if (options.location) {
        this.headers["Location"] = this.urlFor(options.location);
      }
      return this;
    },
    _normalizeRender: function() {
      return this._normalizeOptions(this._normalizeArgs.apply(this, arguments));
    },
    _normalizeArgs: function() {
      var action, args, callback, key, options;
      args = _.args(arguments);
      if (typeof args[0] === "string") action = args.shift();
      if (typeof args[0] === "object") options = args.shift();
      if (typeof args[0] === "function") callback = args.shift();
      options || (options = {});
      if (action) {
        key = !!action.match(/\//) ? "file" : "action";
        options[key] = action;
      }
      if (callback) options.callback = callback;
      return options;
    },
    _normalizeOptions: function(options) {
      if (options == null) options = {};
      if (options.partial === true) options.partial = this.action;
      options.prefixes || (options.prefixes = []);
      options.prefixes.push(this.collectionName);
      options.template || (options.template = options.file || (options.action || this.action));
      return options;
    }
  }
};

module.exports = Tower.Controller.Rendering;
