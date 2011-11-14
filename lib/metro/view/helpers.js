(function() {
  Metro.View.Helpers = (function() {
    function Helpers() {}
    Helpers.prototype.contentTypeTag = function(type) {
      if (type == null) {
        type = "UTF-8";
      }
      return "\n    <meta charset=\"" + type + "\" />";
    };
    Helpers.prototype.t = function(string) {
      var _ref;
      if ((_ref = this._t) == null) {
        this._t = require("" + Metro.root + "/config/locales/en");
      }
      return this._t[string];
    };
    Helpers.prototype.stylesheetTag = function(source) {
      var path, paths, result, _i, _len;
      paths = this.assetPaths(source, {
        directory: Metro.Asset.config.stylesheetDirectory,
        extension: ".css"
      });
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push("\n    <link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>");
      }
      return result.join("");
    };
    Helpers.prototype.javascriptTag = function(source) {
      var path, paths, result, _i, _len;
      paths = this.assetPaths(source, {
        directory: Metro.Asset.config.javascriptDirectory,
        extension: ".js"
      });
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push("\n    <script type=\"text/javascript\" src=\"" + path + "\" ></script>");
      }
      return result.join("");
    };
    Helpers.prototype.assetPaths = function(source, options) {
      var asset, env, publicPath, result, self;
      if (options == null) {
        options = {};
      }
      options.digest = false;
      env = Metro.Asset;
      publicPath = env.computePublicPath(source, options);
      if (Metro.env === "production" || Metro.Support.Path.isUrl(publicPath)) {
        return [publicPath];
      }
      self = this;
      asset = env.find(publicPath);
      result = [];
      asset.paths({
        paths: env.pathsFor(asset.extension),
        require: Metro.env !== "production"
      }, function(paths) {
        var i, path, _len, _results;
        _results = [];
        for (i = 0, _len = paths.length; i < _len; i++) {
          path = paths[i];
          if (i === paths.length - 1) {
            path = source;
          }
          _results.push(result.push(env.computePublicPath(path, options)));
        }
        return _results;
      });
      return result;
    };
    Helpers.prototype.titleTag = function(title) {
      return "<title>" + title + "</title>";
    };
    Helpers.prototype.metaTag = function(name, content) {};
    Helpers.prototype.tag = function(name, options) {};
    Helpers.prototype.linkTag = function(title, path, options) {};
    Helpers.prototype.imageTag = function(path, options) {};
    return Helpers;
  })();
  module.exports = Metro.View.Helpers;
}).call(this);
