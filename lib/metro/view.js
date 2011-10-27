(function() {
  var View, _;
  _ = require('underscore');
  View = (function() {
    View.Helpers = require('./view/helpers');
    View.Lookup = require('./view/lookup');
    View.Rendering = require('./view/rendering');
    View.include(View.Rendering);
    View.initialize = function() {
      this.resolve_load_paths();
      this.resolve_template_paths();
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
    };
    View.teardown = function() {};
    View.resolve_load_paths = function() {
      var file;
      file = Metro.Support.Path;
      return this.load_paths = _.map(this.load_paths, function(path) {
        return file.expand_path(path);
      });
    };
    View.lookup = function(view) {
      var paths_by_name, pattern, result, template, templates, _i, _len;
      paths_by_name = Metro.View.paths_by_name;
      result = paths_by_name[view];
      if (result) {
        return result;
      }
      templates = Metro.View.paths;
      pattern = new RegExp(view + "$", "i");
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        if (template.split(".")[0].match(pattern)) {
          paths_by_name[view] = template;
          return template;
        }
      }
      return null;
    };
    View.resolve_template_paths = function() {
      var file, path, template_paths, _i, _len, _ref;
      file = require("file");
      template_paths = this.paths;
      _ref = Metro.View.load_paths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        file.walkSync(path, function(_path, _directories, _files) {
          var template, _file, _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = _files.length; _j < _len2; _j++) {
            _file = _files[_j];
            template = [_path, _file].join("/");
            _results.push(template_paths.indexOf(template) === -1 ? template_paths.push(template) : void 0);
          }
          return _results;
        });
      }
      return template_paths;
    };
    View.load_paths = ["./spec/spec-app/app/views"];
    View.paths = [];
    View.paths_by_name = {};
    View.engine = "jade";
    View.pretty_print = false;
    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }
    return View;
  })();
  module.exports = View;
}).call(this);
