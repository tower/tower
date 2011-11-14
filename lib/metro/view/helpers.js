(function() {
  Metro.View.Helpers = (function() {
    function Helpers() {}
    Helpers.prototype.stylesheetLinkTag = function(source) {
      return "<link href=\"" + (this.assetPath(source, {
        directory: Metro.Assets.stylesheetDirectory,
        ext: "css"
      })) + "\"></link>";
    };
    Helpers.prototype.assetPath = function(source, options) {
      if (options == null) {
        options = {};
      }
      if (options.digest === void 0) {
        options.digest = !!Metro.env.match(/(development|test)/);
      }
      return Metro.Application.assets().computePublicPath(source, options);
    };
    Helpers.prototype.javascriptIncludeTag = function(path) {};
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
