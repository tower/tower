var File, exec, fs;

exec = require("child_process").exec;

File = require("pathfinder").File;

fs = require('fs');

Tower.GeneratorHelpers = {
  route: function(routingCode) {
    var _this = this;
    return this.inRoot(function() {
      if (_this.controller.namespaced) {
        return _this.injectIntoFile("app/config/shared/routes.coffee", "  " + routingCode + "\n", {
          after: /\.Route\.draw ->\n/,
          duplicate: false
        });
      } else {
        return _this.injectIntoFile("app/config/shared/routes.coffee", "  " + routingCode + "\n", {
          after: /\.Route\.draw ->\n/,
          duplicate: false
        });
      }
    });
  },
  seed: function(model) {
    var string;
    string = "\ \ (callback) =>\n\ \ \ \ _(20).timesAsync callback, (next) =>\n\ \ \ \ \ \ Tower.Factory.create '" + this.model.name + "', (error, record) =>\n\ \ \ \ \ \ \ \ console.log _.stringify(record)\n\ \ \ \ \ \ \ \ next()\n";
    return this.injectIntoFile("data/seeds.coffee", string, {
      after: /_.series *\[ *\n/i,
      duplicate: false
    });
  },
  bootstrap: function(model) {
    var _this = this;
    return this.inRoot(function() {
      var string;
      _this.injectIntoFile("app/config/client/bootstrap.coffee", "  " + _this.app.namespace + "." + model.className + ".load(data." + model.namePlural + ") if data." + model.namePlural + "\n", {
        after: /bootstrap\ = *\(data\) *-\> *\n/i,
        duplicate: false
      });
      string = "\ \ \ \ \ \ (next) => " + _this.app.namespace + "." + _this.model.className + ".all (error, " + _this.model.namePlural + ") =>\n        data." + _this.model.namePlural + " = " + _this.model.namePlural + "\n        next()\n";
      return _this.injectIntoFile("app/controllers/server/applicationController.coffee", string, {
        after: /_.series *\[ *\n/i,
        duplicate: false
      });
    });
  },
  asset: function(path, options) {
    var bundle,
      _this = this;
    if (options == null) {
      options = {};
    }
    bundle = options.bundle || "application";
    return this.inRoot(function() {
      return _this.injectIntoFile("app/config/server/assets.coffee", "      \'" + path + "\'\n", {
        after: new RegExp("\\s*" + bundle + ": *\\[[^\\]]*\\n", "i"),
        duplicate: false
      });
    });
  },
  navigation: function(key, path) {
    var content, pattern,
      _this = this;
    pattern = /div *class: *'nav-collapse' *, *->\s+ul *class: *'nav', *-> */;
    content = "\n    li '{{bindAttr class=\"App." + this.model.className + "Controller.isActive:active\"}}', ->\n\ \ \ \ \ \ a '{{action index" + this.model.className + " href=true}}', t('links." + key + "')";
    return this.inRoot(function() {
      return _this.injectIntoFile("app/templates/shared/layout/_navigation.coffee", content, {
        after: pattern,
        duplicate: false
      });
    });
  },
  locale: function(pattern, content) {
    var _this = this;
    return this.inRoot(function() {
      return _this.injectIntoFile("app/config/shared/locales/en.coffee", content, {
        after: pattern,
        duplicate: false
      });
    });
  },
  inRoot: function(block) {
    return this.inside(".", block);
  }
};

module.exports = Tower.GeneratorHelpers;
