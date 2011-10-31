var View, _;
_ = require('underscore');
View = (function() {
  View.Helpers = require('./view/helpers');
  View.Lookup = require('./view/lookup');
  View.Rendering = require('./view/rendering');
  View.include(View.Rendering);
  View.initialize = function() {
    this.resolveLoadPaths();
    this.resolveTemplatePaths();
    return Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
  };
  View.teardown = function() {};
  View.resolveLoadPaths = function() {
    var file;
    file = Metro.Support.Path;
    return this.loadPaths = _.map(this.loadPaths, function(path) {
      return file.expandPath(path);
    });
  };
  View.lookup = function(view) {
    var pathsByName, pattern, result, template, templates, _i, _len;
    pathsByName = Metro.View.pathsByName;
    result = pathsByName[view];
    if (result) {
      return result;
    }
    templates = Metro.View.paths;
    pattern = new RegExp(view + "$", "i");
    for (_i = 0, _len = templates.length; _i < _len; _i++) {
      template = templates[_i];
      if (template.split(".")[0].match(pattern)) {
        pathsByName[view] = template;
        return template;
      }
    }
    return null;
  };
  View.resolveTemplatePaths = function() {
    var file, path, templatePaths, _i, _len, _ref;
    file = require("file");
    templatePaths = this.paths;
    _ref = Metro.View.loadPaths;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      file.walkSync(path, function(_path, _directories, _files) {
        var template, _file, _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = _files.length; _j < _len2; _j++) {
          _file = _files[_j];
          template = [_path, _file].join("/");
          _results.push(templatePaths.indexOf(template) === -1 ? templatePaths.push(template) : void 0);
        }
        return _results;
      });
    }
    return templatePaths;
  };
  View.loadPaths = ["./spec/spec-app/app/views"];
  View.paths = [];
  View.pathsByName = {};
  View.engine = "jade";
  View.prettyPrint = false;
  function View(controller) {
    this.controller = controller || (new Metro.Controller);
  }
  return View;
})();
module.exports = View;