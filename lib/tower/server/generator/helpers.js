(function() {
  var File, exec, fs;

  exec = require("child_process").exec;

  File = require("pathfinder").File;

  fs = require('fs');

  Tower.Generator.Helpers = {
    route: function(routingCode) {
      var _this = this;
      return this.inRoot(function() {
        if (_this.controller.namespaced) {
          return _this.injectIntoFile("config/routes.coffee", "  " + routingCode + "\n", {
            after: /\.Route\.draw ->\n/,
            duplicate: false
          });
        } else {
          return _this.injectIntoFile("config/routes.coffee", "  " + routingCode + "\n", {
            after: /\.Route\.draw ->\n/,
            duplicate: false
          });
        }
      });
    },
    bootstrap: function(model) {
      var _this = this;
      return this.inRoot(function() {
        var string;
        _this.injectIntoFile("app/client/config/application.coffee", "    @" + model.className + ".load(data." + model.namePlural + ") if data." + model.namePlural + "\n", {
          after: /bootstrap\: *\(data\) *-\> *\n/i
        });
        string = "\ \ \ \ \ \ (next) => " + _this.app.namespace + "." + _this.model.className + ".all (error, " + _this.model.namePlural + ") =>\n        data." + _this.model.namePlural + " = " + _this.model.namePlural + "\n        next()\n";
        return _this.injectIntoFile("app/controllers/applicationController.coffee", string, {
          after: /_.series *\[ *\n/i
        });
      });
    },
    asset: function(path, options) {
      var bundle,
        _this = this;
      if (options == null) options = {};
      bundle = options.bundle || "application";
      return this.inRoot(function() {
        return _this.injectIntoFile("config/assets.coffee", "      \"" + path + "\"\n", {
          after: new RegExp("\\s*" + bundle + ": *\\[[^\\]]+\\n", "i")
        });
      });
    },
    navigation: function(key, path) {
      var content, pattern,
        _this = this;
      pattern = /div *class: *"nav-collapse" *, *->\s+ul *class: *"nav", *-> */;
      content = "\n    navItem t(\"links." + key + "\"), " + path;
      return this.inRoot(function() {
        return _this.injectIntoFile("app/views/shared/_navigation.coffee", content, {
          after: pattern
        });
      });
    },
    locale: function(pattern, content) {
      var _this = this;
      return this.inRoot(function() {
        return _this.injectIntoFile("config/locales/en.coffee", content, {
          after: pattern
        });
      });
    },
    inRoot: function(block) {
      return this.inside(".", block);
    }
  };

  module.exports = Tower.Generator.Helpers;

}).call(this);
