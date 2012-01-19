
Tower.View.RenderingHelper = {
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
    __ck.indent();
    text(String(this.renderWithEngine(String(template))));
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
    var value;
    value = this[key];
    if (typeof value === "function") {
      eval("(" + (String(value)) + ")()");
    } else {
      __ck.indent();
      text(value);
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
