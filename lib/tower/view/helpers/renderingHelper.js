
Tower.View.RenderingHelper = {
  partial: function(path, options, callback) {
    var item, name, prefixes, template, tmpl, _i, _len, _ref;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    path = path.split("/");
    path[path.length - 1] = "_" + path[path.length - 1];
    path = path.join("/");
    prefixes = options.prefixes;
    if (this._context) prefixes || (prefixes = [this._context.collectionName]);
    template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
    template = this.renderWithEngine(String(template));
    tmpl = "(function() {" + (String(template)) + "})";
    if (options.collection) {
      name = options.as || Tower.Support.String.camelize(options.collection[0].constructor.name, true);
      _ref = options.collection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this[name] = item;
        eval(tmpl).call(this);
        delete this[name];
      }
    } else {
      eval(tmpl).call(this);
    }
    return null;
  },
  page: function() {
    var args, browserTitle, options;
    args = Tower.Support.Array.args(arguments);
    options = Tower.Support.Array.extractOptions(args);
    browserTitle = args.shift() || options.title;
    return this.contentFor("title", function() {
      return title(browserTitle);
    });
  },
  yields: function(key) {
    var ending, value;
    value = this[key];
    if (typeof value === "function") {
      eval("(" + (String(value)) + ")()");
    } else {
      ending = value.match(/\n$/) ? "\n" : "";
      text(value.replace(/\n$/, "").replace(/^(?!\s+$)/mg, __ck.repeat('  ', __ck.tabs)) + ending);
    }
    return null;
  },
  hasContentFor: function(key) {
    return !!(this.hasOwnProperty(key) && this[key] && this[key] !== "");
  },
  contentFor: function(key, block) {
    this[key] = block;
    return null;
  }
};
