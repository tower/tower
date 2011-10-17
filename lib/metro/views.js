(function() {
  var Views, _;
  _ = require("underscore");
  Views = {
    Base: require('./views/base'),
    Helpers: require('./views/helpers'),
    bootstrap: function() {
      this.resolve_load_paths();
      return this.resolve_template_paths();
    },
    resolve_load_paths: function() {
      var file;
      file = Metro.Support.File;
      return this.load_paths = _.map(this.load_paths, function(path) {
        return file.expand_path(path);
      });
    },
    lookup: function(view) {
      var paths_by_name, pattern, result, template, templates, _i, _len;
      paths_by_name = Metro.Views.paths_by_name;
      result = paths_by_name[view];
      if (result) {
        return result;
      }
      templates = Metro.Views.paths;
      pattern = new RegExp(view + "$", "i");
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        if (template.split(".")[0].match(pattern)) {
          paths_by_name[view] = template;
          return template;
        }
      }
      return null;
    },
    resolve_template_paths: function() {
      var file, path, template_paths, _i, _len, _ref;
      file = require("file");
      template_paths = this.paths;
      _ref = Metro.Views.load_paths;
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
    },
    load_paths: ["./spec/spec-app/app/views"],
    paths: [],
    paths_by_name: {},
    engine: "jade",
    pretty_print: false,
    engines: function() {
      var _ref;
      return (_ref = this._engines) != null ? _ref : this._engines = {
        "stylus": Metro.Compilers.Stylus,
        "jade": Metro.Compilers.Jade,
        "haml": Metro.Compilers.Haml,
        "ejs": Metro.Compilers.Ejs,
        "coffee": Metro.Compilers.CoffeeScript,
        "less": Metro.Compilers.Less,
        "sass": Metro.Compilers.Sass,
        "mustache": Metro.Compilers.Mustache
      };
    }
  };
  module.exports = Views;
}).call(this);
