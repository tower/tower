var File, exec, fs;

exec = require("child_process").exec;

File = require("pathfinder").File;

fs = require('fs');

Tower.Generator.Resources = {
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
  asset: function(path, options) {
    var _this = this;
    return this.inRoot(function() {
      return _this.injectIntoFile("config/assets.coffee", "      \"" + path + "\"\n", {
        after: /javascripts:\s*application: *\[[^\]]+\n/g
      });
    });
  },
  navigation: function(key, path) {
    var content, pattern;
    var _this = this;
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
  },
  generate: function(type) {
    var generator, options;
    options = {
      program: this.program,
      app: this.app,
      user: this.user,
      model: this.model,
      view: this.view,
      controller: this.controller,
      destinationRoot: this.destinationRoot
    };
    generator = new Tower.Generator[Tower.Support.String.camelize(type) + "Generator"](options);
    return generator.run();
  },
  nodeModule: function(name, options) {
    if (options == null) options = {};
  },
  locals: function() {
    return {
      model: this.model,
      view: this.view,
      controller: this.controller,
      app: this.app,
      user: this.user
    };
  },
  builtAttribute: function(name, type) {
    if (type == null) type = "string";
    return {
      name: name,
      type: (function() {
        switch (type.toLowerCase()) {
          case "text":
            return "String";
          default:
            return Tower.Support.String.camelize(type);
        }
      })(),
      humanName: _.humanize(name),
      fieldType: (function() {
        switch (type) {
          case "integer":
            return "number";
          case "float":
          case "decimal":
          case "string":
            return "string";
          case "time":
            return "time";
          case "datetime":
          case "timestamp":
            return "datetime";
          case "date":
            return "date";
          case "text":
            return "text";
          case "boolean":
            return "checkbox";
          default:
            return "string";
        }
      })(),
      "default": (function() {
        switch (type) {
          case "integer":
            return 0;
          default:
            return null;
        }
      })()
    };
  },
  buildRelation: function(type, className) {
    return {
      name: Tower.Support.String.camelize(className, true),
      type: type,
      humanName: _.humanize(className)
    };
  },
  buildModel: function(name, appNamespace, argv) {
    var attributes, className, classNamePlural, humanName, key, namePlural, namespacedClassName, namespaces, pair, paramName, paramNamePlural, relations, type, _i, _len;
    namespaces = name.split("/");
    name = namespaces.pop();
    name = Tower.Support.String.camelize(name, true);
    className = Tower.Support.String.camelize(name);
    classNamePlural = Tower.Support.String.pluralize(className);
    namespacedClassName = "" + appNamespace + "." + className;
    namePlural = Tower.Support.String.pluralize(name);
    paramName = Tower.Support.String.parameterize(name);
    paramNamePlural = Tower.Support.String.parameterize(namePlural);
    humanName = _.titleize(className);
    attributes = [];
    relations = [];
    for (_i = 0, _len = argv.length; _i < _len; _i++) {
      pair = argv[_i];
      pair = pair.split(":");
      if (!(pair.length > 1)) continue;
      key = pair[0];
      type = Tower.Support.String.camelize(pair[1] || "String", true);
      if (key.match(/(belongsTo|hasMany|hasOne)/)) {
        relations.push(this.buildRelation(key, Tower.Support.String.camelize(type)));
      } else {
        attributes.push(this.builtAttribute(key, Tower.Support.String.camelize(type)));
      }
    }
    return {
      name: name,
      namespace: appNamespace,
      className: className,
      classNamePlural: classNamePlural,
      namespacedClassName: namespacedClassName,
      namePlural: namePlural,
      paramName: paramName,
      paramNamePlural: paramNamePlural,
      humanName: humanName,
      attributes: attributes,
      relations: relations,
      namespacedDirectory: namespaces.join("/"),
      viewDirectory: namespaces.join("/") + ("/" + namePlural),
      namespaced: _.map(namespaces, function(n) {
        return Tower.Support.String.camelize(n);
      }).join(".")
    };
  },
  buildApp: function(name) {
    var _base;
    if (name == null) name = this.appName;
    (_base = this.program).namespace || (_base.namespace = Tower.namespace());
    return {
      name: name,
      namespace: Tower.Support.String.camelize(this.program.namespace),
      paramName: Tower.Support.String.parameterize(name),
      paramNamePlural: Tower.Support.String.parameterize(Tower.Support.String.pluralize(name)),
      session: this.generateRandom("hex"),
      year: (new Date).getFullYear(),
      directory: name
    };
  },
  buildView: function(name) {
    name = _.map(name.split("/"), function(n) {
      return Tower.Support.String.camelize(n, true);
    }).join("/");
    return {
      namespace: name,
      directory: Tower.Support.String.pluralize(name)
    };
  },
  buildController: function(name) {
    var className, directory, namespace, namespaces;
    namespaces = name.split("/");
    className = Tower.Support.String.pluralize(Tower.Support.String.camelize(namespaces[namespaces.length - 1])) + "Controller";
    if (namespaces.length > 1) {
      namespaces = namespaces.slice(0, -1);
      directory = _.map(namespaces, function(n) {
        return Tower.Support.String.camelize(n, true);
      }).join("/");
      namespace = this.app.namespace + "." + _.map(namespaces, function(n) {
        return Tower.Support.String.camelize(n);
      }).join(".");
    } else {
      namespace = this.app.namespace;
      directory = "";
    }
    return {
      namespace: namespace,
      className: className,
      directory: directory,
      name: Tower.Support.String.camelize(className, true),
      namespaced: directory !== ""
    };
  },
  generateRandom: function(code) {
    var crypto, hash, uuid;
    if (code == null) code = "hex";
    crypto = require('crypto');
    uuid = require('node-uuid');
    hash = crypto.createHash("sha1");
    hash.update(uuid.v4());
    return hash.digest(code);
  },
  buildUser: function(callback) {
    var gitConfig, gitFile, key, line, lines, user, value, variable, _i, _len;
    gitFile = "" + process.env.HOME + "/.gitconfig";
    gitConfig = {};
    user = {};
    try {
      if (File.exists(gitFile)) {
        lines = File.read(gitFile).split("\n");
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          if (line.charAt(0) !== "#" && line.match(/\S/)) {
            if (line.match(/^\[(.*)\]$/)) {
              variable = RegExp.$1;
            } else {
              line = line.split("=");
              key = line[0].trim();
              value = line[1].trim();
              gitConfig[variable] || (gitConfig[variable] = {});
              gitConfig[variable][key] = value;
            }
          }
        }
      }
      user.name = gitConfig.user && gitConfig.user.name ? gitConfig.user.name : "username";
      user.email = gitConfig.user && gitConfig.user.email ? gitConfig.user.email : "example@example.com";
      user.username = gitConfig.github && gitConfig.github.user ? gitConfig.github.user : "User";
    } catch (error) {
      this;
    }
    user.database = "mongodb";
    if (callback) callback(user);
    return user;
  }
};

module.exports = Tower.Generator.Resources;
