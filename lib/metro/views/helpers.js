(function() {
  var Helpers;
  Helpers = (function() {
    function Helpers() {}
    ["form", "table"].each(function() {
      var klass;
      klass = "Metro.Components." + (this.toUpperCase());
      return this.prototype["" + this + "_for"] = function() {
        var _ref;
        return (_ref = global[klass])["new"].apply(_ref, arguments).render();
      };
    });
    Helpers.prototype.stylesheet_link_tag = function(path) {
      return "<link></link>";
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
}).call(this);
