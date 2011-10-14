(function() {
  var Metro, exports, fs, _;
  fs = require('fs');
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  Metro = {
    Asset: {
      YuiCompressor: require('./asset/yui_compressor'),
      UglifierCompressor: require('./asset/uglifier_compressor'),
      Processor: require('./asset/processor'),
      CssProcessor: require('./asset/css_processor'),
      JsProcessor: require('./asset/js_processor'),
      Environment: require('./asset/environment'),
      File: require('./asset/file'),
      BundledFile: require('./asset/bundled_file'),
      Server: require('./asset/server'),
      config: {
        css: [],
        js: [],
        version: 1.0,
        enabled: true,
        js_compressor: "uglifier",
        css_compressor: "yui",
        css_paths: [],
        js_paths: [],
        path: "./assets",
        compress: true,
        compile: true,
        digest: true,
        debug: false
      },
      process_css: function() {
        return this.css_processor().process({
          paths: this.config.css_paths,
          files: this.config.css
        });
      },
      process_js: function() {
        return this.js_processor().process({
          paths: this.config.js_paths,
          files: this.config.js
        });
      },
      process: function() {
        return {
          css: this.process_css(),
          js: this.process_js()
        };
      },
      compile_js: function() {
        return this.js_processor().compile({
          paths: this.config.js_paths,
          files: this.config.js,
          path: this.config.path
        });
      },
      compile_css: function() {
        return this.css_processor().compile({
          paths: this.config.css_paths,
          files: this.config.css,
          path: this.config.path
        });
      },
      compile: function() {
        this.compile_js();
        return this.compile_css();
      },
      css_processor: function() {
        var _ref;
        return (_ref = this._css_processor) != null ? _ref : this._css_processor = new this.CssProcessor(this.css_compressor());
      },
      js_processor: function() {
        var _ref;
        return (_ref = this._js_processor) != null ? _ref : this._js_processor = new this.JsProcessor(this.js_compressor());
      },
      css_compressor: function() {
        var _ref;
        return (_ref = this._css_compressor) != null ? _ref : this._css_compressor = new this[_.titleize(this.config.css_compressor) + "Compressor"];
      },
      js_compressor: function() {
        var _ref;
        return (_ref = this._js_compressor) != null ? _ref : this._js_compressor = new this[_.titleize(this.config.js_compressor) + "Compressor"];
      }
    }
  };
  exports = module.exports = Metro;
}).call(this);
