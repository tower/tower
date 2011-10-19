(function() {
  var Helpers;
  Helpers = (function() {
    function Helpers() {}
    Helpers.prototype.stylesheet_link_tag = function(source) {
      return "<link href=\"" + (this.asset_path(source, {
        directory: Metro.Assets.stylesheet_directory,
        ext: "css"
      })) + "\"></link>";
    };
    Helpers.prototype.asset_path = function(source, options) {
      if (options == null) {
        options = {};
      }
      if (options.digest === void 0) {
        options.digest = !!Metro.env.match(/(development|test)/);
      }
      return Metro.Application.assets().compute_public_path(source, options);
    };
    Helpers.prototype.javascript_include_tag = function(path) {};
    Helpers.prototype.title_tag = function(title) {
      return "<title>" + title + "</title>";
    };
    Helpers.prototype.meta_tag = function(name, content) {};
    Helpers.prototype.tag = function(name, options) {};
    Helpers.prototype.link_tag = function(title, path, options) {};
    Helpers.prototype.image_tag = function(path, options) {};
    return Helpers;
  })();
  module.exports = Helpers;
}).call(this);
