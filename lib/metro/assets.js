(function() {
  var Assets;
  Assets = {
    Asset: require('./assets/asset'),
    Processor: require('./assets/processor'),
    Environment: require('./assets/environment'),
    load_paths: ["./app/assets", "./lib/assets", "./vendor/assets"],
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
      public_path: "./public",
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
      return (_ref = this._css_processor) != null ? _ref : this._css_processor = new Metro.Assets.Processor(this.css_compressor(), {
        extension: ".css"
      });
    },
    js_processor: function() {
      var _ref;
      return (_ref = this._js_processor) != null ? _ref : this._js_processor = new Metro.Assets.Processor(this.js_compressor(), {
        extension: ".js",
        terminator: ";"
      });
    },
    css_compressor: function() {
      var _ref;
      return (_ref = this._css_compressor) != null ? _ref : this._css_compressor = new Metro.Compilers[Metro.Support.String.titleize(this.config.css_compressor)];
    },
    js_compressor: function() {
      var _ref;
      return (_ref = this._js_compressor) != null ? _ref : this._js_compressor = new Metro.Compilers[Metro.Support.String.titleize(this.config.js_compressor)];
    },
    processor_for: function(extension) {
      if (extension.match(/(js|coffee)/)) {
        return this.js_processor();
      } else if (extension.match(/(css|styl|scss|sass|less)/)) {
        return this.css_processor();
      }
    }
  };
  module.exports = Assets;
}).call(this);
