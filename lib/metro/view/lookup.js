(function() {
  Metro.View.Lookup = (function() {
    function Lookup() {}
    Lookup.initialize = function() {
      this.resolveLoadPaths();
      this.resolveTemplatePaths();
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
    };
    Lookup.teardown = function() {};
    Lookup.resolveLoadPaths = function() {
      var file;
      file = Metro.Support.Path;
      return this.loadPaths = _.map(this.loadPaths, function(path) {
        return file.expandPath(path);
      });
    };
    Lookup.lookup = function(view) {
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
    Lookup.resolveTemplatePaths = function() {
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
    Lookup.loadPaths = ["./spec/spec-app/app/views"];
    Lookup.paths = [];
    Lookup.pathsByName = {};
    Lookup.engine = "jade";
    Lookup.prettyPrint = false;
    return Lookup;
  })();
  module.exports = Metro.View.Lookup;
}).call(this);
