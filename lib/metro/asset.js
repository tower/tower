Metro.Asset = (function() {
  Asset.Compiler = require('./asset/compiler');
  Asset.Digest = require('./asset/digest');
  Asset.Lookup = require('./asset/lookup');
  Asset.include(Metro.Support.Path);
  Asset.include(Asset.Digest);
  Asset.include(Asset.Lookup);
  Asset.include(Asset.Compiler);
  Asset.initialize = function() {
    return this.config = {
      publicPath: "" + Metro.root + "/public",
      loadPaths: ["" + Metro.root + "/app/assets", "" + Metro.root + "/lib/assets", "" + Metro.root + "/vendor/assets"],
      stylesheetDirectory: "stylesheets",
      stylesheetExtensions: ["css", "styl", "scss", "less"],
      stylesheetAliases: {
        css: ["styl", "less", "scss", "sass"]
      },
      javascriptDirectory: "javascripts",
      javascriptExtensions: ["js", "coffee", "ejs"],
      javascriptAliases: {
        js: ["coffee", "coffeescript"],
        coffee: ["coffeescript"]
      },
      imageDirectory: "images",
      imageExtensions: ["png", "jpg", "gif"],
      imageAliases: {
        jpg: ["jpeg"]
      },
      fontDirectory: "fonts",
      fontExtensions: ["eot", "svg", "tff", "woff"],
      fontAliases: {},
      host: null,
      relativeRootUrl: null,
      precompile: [],
      jsCompressor: null,
      cssCompressor: null,
      enabled: true,
      manifest: "/public/assets",
      compile: true,
      prefix: "assets"
    };
  };
  Asset.teardown = function() {
    delete this._javascriptLookup;
    delete this._stylesheetLookup;
    delete this._imageLookup;
    delete this._fontLookup;
    delete this._pathPattern;
    delete this._cssCompressor;
    delete this._jsCompressor;
    delete this._parser;
    delete this._compiler;
    return delete this._digests;
  };
  Asset.configure = function(options) {
    var key, value, _results;
    _results = [];
    for (key in options) {
      value = options[key];
      _results.push(this.config[key] = value);
    }
    return _results;
  };
  Asset.cssCompressor = function() {
    return this._cssCompressor || (this._cssCompressor = new (require('shift').YuiCompressor));
  };
  Asset.jsCompressor = function() {
    return this._jsCompressor || (this._jsCompressor = new (require('shift').UglifyJS));
  };
  function Asset(path, extension) {
    this.path = this.constructor.expandPath(path);
    this.extension = extension || this.extensions()[0];
  }
  Asset.prototype.compiler = function() {
    return this.constructor.compiler();
  };
  return Asset;
})();
module.exports = Metro.Asset;