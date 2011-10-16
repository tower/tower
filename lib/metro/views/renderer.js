(function() {
  var Renderer, fs;
  fs = require("fs");
  Renderer = (function() {
    function Renderer(lookup_context) {
      this.lookup_context = lookup_context;
    }
    Renderer.prototype.render = function(view, options) {
      var template;
      template = Metro.Template.engines()[options.type];
      template = new template;
      return template.compile("" + view + "." + options.type);
    };
    return Renderer;
  })();
  module.exports = Renderer;
}).call(this);
