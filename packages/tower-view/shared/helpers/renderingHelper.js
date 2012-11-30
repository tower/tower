
Tower.ViewRenderingHelper = {
  partial: function(path, options, callback) {
    var item, locals, name, prefixes, template, tmpl, _i, _len, _ref;
    try {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      options.locals || (options.locals = {});
      locals = options.locals;
      path = path.split("/");
      path[path.length - 1] = "_" + path[path.length - 1];
      path = path.join("/");
      prefixes = options.prefixes;
      if (this._context) {
        prefixes || (prefixes = [this._context.collectionName]);
      }
      template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
      template = this.renderWithEngine(String(template));
      if (options.collection) {
        name = options.as || _.camelize(options.collection[0].constructor.name, true);
        tmpl = eval("(function(data) { with(data) { this." + name + " = " + name + "; " + (String(template)) + " } })");
        _ref = options.collection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          locals[name] = item;
          tmpl.call(this, locals);
          delete this[name];
        }
      } else {
        tmpl = "(function(data) { with(data) { " + (String(template)) + " } })";
        eval(tmpl).call(this, locals);
      }
    } catch (error) {
      console.log(error.stack || error);
    }
    return null;
  },
  page: function() {
    var args, browserTitle, options;
    args = _.args(arguments);
    options = _.extractOptions(args);
    browserTitle = args.shift() || options.title;
    return this.contentFor("title", function() {
      return title(browserTitle);
    });
  },
  urlFor: function() {
    return Tower.urlFor.apply(Tower, arguments);
  },
  yields: function(key) {
    var ending, value;
    value = this[key];
    if (typeof value === "function") {
      eval("(" + (String(value)) + ")()");
    } else {
      ending = value.match(/\n$/) ? "\n" : "";
      text(value.replace(/\n$/, "").replace(/^(?!\s+$)/mg, __cc.repeat('  ', __cc.tabs)) + ending);
    }
    return null;
  },
  hasContentFor: function(key) {
    return !!(this.hasOwnProperty(key) && this[key] && this[key] !== "");
  },
  has: function(key) {
    return !!(this.hasOwnProperty(key) && this[key] && this[key] !== "");
  },
  contentFor: function(key, block) {
    this[key] = block;
    return null;
  }
};
