(function() {
  var Helpers;
  Helpers = {
    stylesheet_link_tag: function(path) {
      return "<link href=\"" + path + "\"></link>";
    },
    javascript_include_tag: function(path) {},
    title_tag: function(title) {
      return "<title>" + title + "</title>";
    },
    meta_tag: function(name, content) {},
    tag: function(name, options) {},
    link_tag: function(title, path, options) {},
    image_tag: function(path, options) {}
  };
  module.exports = Helpers;
}).call(this);
