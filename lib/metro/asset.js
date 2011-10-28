(function() {
  var Asset;
  Asset = (function() {
    Asset.Compiler = require('./asset/compiler');
    Asset.Digest = require('./asset/digest');
    Asset.Lookup = require('./asset/lookup');
    Asset.include(Metro.Support.Path);
    Asset.include(Asset.Digest);
    Asset.include(Asset.Lookup);
    Asset.include(Asset.Compiler);
    Asset.initialize = function() {
      return this.config = {
        public_path: "" + Metro.root + "/public",
        load_paths: ["" + Metro.root + "/app/assets", "" + Metro.root + "/lib/assets", "" + Metro.root + "/vendor/assets"],
        stylesheet_directory: "stylesheets",
        stylesheet_extensions: ["css", "styl", "scss", "less"],
        stylesheet_aliases: {
          css: ["styl", "less", "scss", "sass"]
        },
        javascript_directory: "javascripts",
        javascript_extensions: ["js", "coffee", "ejs"],
        javascript_aliases: {
          js: ["coffee", "coffeescript"],
          coffee: ["coffeescript"]
        },
        image_directory: "images",
        image_extensions: ["png", "jpg", "gif"],
        image_aliases: {
          jpg: ["jpeg"]
        },
        font_directory: "fonts",
        font_extensions: ["eot", "svg", "tff", "woff"],
        font_aliases: {},
        host: null,
        relative_root_url: null,
        precompile: [],
        js_compressor: null,
        css_compressor: null,
        enabled: true,
        manifest: "/public/assets",
        compile: true,
        prefix: "assets"
      };
    };
    Asset.teardown = function() {
      delete this._javascript_lookup;
      delete this._stylesheet_lookup;
      delete this._image_lookup;
      delete this._font_lookup;
      delete this._path_pattern;
      delete this._css_compressor;
      delete this._js_compressor;
      delete this._parser;
      delete this._compiler;
      return delete this._digests;
    };
    Asset.configure = function(options) {
      var key, value, _len, _results;
      _results = [];
      for (value = 0, _len = options.length; value < _len; value++) {
        key = options[value];
        _results.push(this.config[key] = value);
      }
      return _results;
    };
    Asset.css_compressor = function() {
      var _ref;
      return (_ref = this._css_compressor) != null ? _ref : this._css_compressor = new (require('shift').YuiCompressor);
    };
    Asset.js_compressor = function() {
      var _ref;
      return (_ref = this._js_compressor) != null ? _ref : this._js_compressor = new (require('shift').UglifyJS);
    };
    function Asset(path, extension) {
      this.path = this.constructor.expand_path(path);
      this.extension = extension || this.extensions()[0];
    }
    Asset.prototype.compiler = function() {
      return this.constructor.compiler();
    };
    return Asset;
  })();
  module.exports = Asset;
}).call(this);
