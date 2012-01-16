
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
        this.addRenderer;
      }
      return this;
    },
    renderers: function() {
      return this._renderers || (this._renderers = {});
    }
  },
  render: function() {
    var args, callback, options, self, view, _base;
    args = Tower.Support.Array.args(arguments);
    if (args.length >= 2 && typeof args[args.length - 1] === "function") {
      callback = args.pop();
    } else {
      callback = null;
    }
    if (args.length > 1 && typeof args[args.length - 1] === "object") {
      options = args.pop();
    }
    if (typeof args[0] === "object") {
      options = args[0];
    } else {
      options || (options = {});
      options.template = args[0];
    }
    if (options.template) {
      if (typeof options.template === "string" && !!!options.template.match(/\//)) {
        options.template = "" + this.collectionName + "/" + options.template;
      }
    } else if (options.action) {
      options.template = "" + this.collectionName + "/" + options.action;
    }
    view = new Tower.View(this);
    (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
    self = this;
    return view.render.call(view, options, function(error, body) {
      if (error) {
        self.body = error.stack;
      } else {
        self.body = body;
      }
      if (callback) callback(error, body);
      if (self.callback) return self.callback();
    });
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
    return this.template.render(viewContext, options);
  },
  _processRenderOptions: function(options) {
    if (options == null) options = {};
    if (options.status) this.status = options.status;
    if (options.contentType) this.contentType = options.contentType;
    if (options.location) this.headers["Location"] = this.urlFor(options.location);
    return this;
  },
  _normalizeRender: function() {
    return this._normalizeOptions(this._normalizeArgs.apply(this, arguments));
  },
  _normalizeArgs: function(action, options) {
    var key;
    if (options == null) options = {};
    switch (typeof action) {
      case "undefined":
      case "object":
        options = action || {};
        break;
      case "string":
        key = !!action.match(/\//) ? "file" : "action";
        options[key] = action;
        break;
      default:
        options.partial = action;
    }
    return options;
  },
  _normalizeOptions: function(options) {
    if (options == null) options = {};
    if (options.partial === true) options.partial = this.action;
    options.template || (options.template = options.action || this.action);
    return options;
  }
};

module.exports = Tower.Controller.Rendering;
