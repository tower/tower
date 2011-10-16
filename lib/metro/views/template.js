(function() {
  var Template, fs, _;
  fs = require("fs");
  _ = require("underscore");
  Template = (function() {
    function Template() {}
    Template.prototype.render = function(view, options) {
      var engine;
      engine = Metro.Compilers.engines()[options.type];
      engine = new engine;
      return engine.compile("" + view + "." + options.type);
    };
    Template.prototype.lookup = function(view) {
      var pattern, result, template, templates, _i, _len;
      result = Metro.Views.template_paths_by_name[view];
      if (result) {
        return result;
      }
      templates = Metro.Views.template_paths;
      pattern = new RegExp(view + "$", "i");
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        if (template.split(".")[0].match(pattern)) {
          Metro.Views.template_paths_by_name[view] = template;
          return template;
        }
      }
      return null;
    };
    return Template;
  })();
  module.exports = Template;
}).call(this);
