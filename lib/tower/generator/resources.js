var File;

File = require('pathfinder').File;

Tower.Generator.Resources = {
  route: function(routingCode) {
    var sentinel;
    this.log("route", routingCode);
    sentinel = /\.Route\.draw do(?:\s*\|map\|)?\s*$/;
    return this.inRoot(function() {
      return this.injectIntoFile('config/routes.rb', "\n  " + routing_code + "\n", {
        after: sentinel,
        verbose: false
      });
    });
  },
  generate: function(type) {
    var generator, options;
    options = {
      program: this.program,
      project: this.project,
      user: this.user,
      model: this.model,
      destinationRoot: this.destinationRoot
    };
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](options);
    return generator.run();
  },
  nodeModule: function(name, options) {
    if (options == null) options = {};
  },
  locals: function() {
    return {
      model: this.model,
      project: this.project,
      user: this.user
    };
  },
  builtAttribute: function(name, type) {
    if (type == null) type = "string";
    return {
      name: name,
      type: type,
      humanName: _.humanize(name),
      fieldType: (function() {
        switch (type) {
          case "integer":
            return "numberField";
          case "float":
          case "decimal":
            return "textField";
          case "time":
            return "timeSelect";
          case "datetime":
          case "timestamp":
            return "datetimeSelect";
          case "date":
            return "dateSelect";
          case "text":
            return "textArea";
          case "boolean":
            return "checkBox";
          default:
            return "textField";
        }
      })(),
      "default": (function() {
        switch (type) {
          case "integer":
            return 1;
          case "float":
            return 1.5;
          case "decimal":
            return "9.99";
          case "datetime":
          case "timestamp":
          case "time":
            return Time.now.toString("db");
          case "date":
            return Date.today.toString("db");
          case "string":
            if (name === "type") {
              return "";
            } else {
              return "MyString";
            }
          case "text":
            return "MyText";
          case "boolean":
            return false;
          case "references":
          case "belongsTo":
            return null;
          default:
            return "";
        }
      })()
    };
  },
  buildModel: function(name, namespace, argv) {
    var attr, attributes, className, cssName, humanName, namespacedClassName, pair, pluralClassName, pluralCssName, pluralName, type, _i, _len;
    name = Tower.Support.String.camelize(name, true);
    namespace = namespace;
    className = Tower.Support.String.camelize(name);
    pluralClassName = Tower.Support.String.pluralize(className);
    namespacedClassName = "" + namespace + "." + className;
    pluralName = Tower.Support.String.pluralize(name);
    cssName = Tower.Support.String.parameterize(name);
    pluralCssName = Tower.Support.String.parameterize(pluralName);
    humanName = _.titleize(className);
    attributes = [];
    for (_i = 0, _len = argv.length; _i < _len; _i++) {
      pair = argv[_i];
      pair = pair.split(":");
      if (!(pair.length > 1)) continue;
      attr = pair[0];
      type = Tower.Support.String.camelize(pair[1] || pair[0], true);
      attributes.push(this.builtAttribute(attr, Tower.Support.String.camelize(type)));
    }
    return {
      name: name,
      namespace: namespace,
      className: className,
      pluralClassName: pluralClassName,
      namespacedClassName: namespacedClassName,
      pluralName: pluralName,
      cssName: cssName,
      pluralCssName: pluralCssName,
      humanName: humanName,
      attributes: attributes
    };
  },
  buildProject: function(name) {
    if (name == null) name = this.projectName;
    return {
      name: name,
      className: Tower.Support.String.camelize(this.program.namespace || name),
      cssName: Tower.Support.String.parameterize(this.program.namespace || name),
      pluralCssName: Tower.Support.String.parameterize(Tower.Support.String.pluralize(this.program.namespace || name))
    };
  },
  buildUser: function(callback) {
    var configFile, user;
    var _this = this;
    configFile = process.env.HOME + "/.tower.json";
    if (!File.exists(configFile)) {
      user = {};
      return this.prompt("github username", function(username) {
        user.username = username;
        return _this.prompt("email", function(email) {
          user.email = email;
          return _this.prompt("your full name", function(name) {
            var databases;
            user.name = name;
            databases = ["mongodb"];
            return _this.choose("default database", databases, function(index) {
              user.database = databases[index];
              File.write(configFile, JSON.stringify(user, null, 2));
              return process.nextTick(function() {
                return callback(user);
              });
            });
          });
        });
      });
    } else {
      try {
        user = JSON.parse(File.read(configFile));
      } catch (error) {
        user = {};
      }
      user.database || (user.database = "mongodb");
      return callback(user);
    }
  }
};

module.exports = Tower.Generator.Resources;
