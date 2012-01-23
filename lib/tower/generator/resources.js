var File;

File = require('pathfinder').File;

Tower.Generator.Resources = {
  route: function(routingCode) {
    var sentinel;
    this.log("route", routingCode);
    sentinel = /\.Route\.draw ->(?:\s*\|map\|)?\s*$/;
    return this.inRoot(function() {
      return this.injectIntoFile('config/routes.coffee', "\n  " + routingCode + "\n", {
        after: sentinel,
        verbose: false
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
      project: this.project,
      user: this.user,
      model: this.model,
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
      project: this.project,
      user: this.user
    };
  },
  builtAttribute: function(name, type) {
    if (type == null) type = "string";
    return {
      name: name,
      type: (function() {
        switch (type) {
          case "text":
            return "String";
          default:
            return Tower.Support.camelize(type);
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
  buildModel: function(name, namespace, argv) {
    var attributes, className, humanName, key, namespacedClassName, pair, paramName, pluralClassName, pluralName, pluralParamName, relations, type, _i, _len;
    name = Tower.Support.String.camelize(name, true);
    namespace = namespace;
    className = Tower.Support.String.camelize(name);
    pluralClassName = Tower.Support.String.pluralize(className);
    namespacedClassName = "" + namespace + "." + className;
    pluralName = Tower.Support.String.pluralize(name);
    paramName = Tower.Support.String.parameterize(name);
    pluralParamName = Tower.Support.String.parameterize(pluralName);
    humanName = _.titleize(className);
    attributes = [];
    relations = [];
    for (_i = 0, _len = argv.length; _i < _len; _i++) {
      pair = argv[_i];
      pair = pair.split(":");
      if (!(pair.length > 1)) continue;
      key = pair[0];
      type = Tower.Support.String.camelize(pair[1] || key, true);
      if (key.match(/(belongsTo|hasMany|hasOne)/)) {
        relations.push(this.buildRelation(key, Tower.Support.String.camelize(type)));
      } else {
        attributes.push(this.builtAttribute(key, Tower.Support.String.camelize(type)));
      }
    }
    return {
      name: name,
      namespace: namespace,
      className: className,
      pluralClassName: pluralClassName,
      namespacedClassName: namespacedClassName,
      pluralName: pluralName,
      paramName: paramName,
      pluralParamName: pluralParamName,
      humanName: humanName,
      attributes: attributes,
      relations: relations
    };
  },
  buildProject: function(name) {
    if (name == null) name = this.projectName;
    return {
      name: name,
      className: Tower.Support.String.camelize(this.program.namespace || name),
      cssName: Tower.Support.String.parameterize(this.program.namespace || name),
      pluralCssName: Tower.Support.String.parameterize(Tower.Support.String.pluralize(this.program.namespace || name)),
      session: this.generateRandom("hex")
    };
  },
  generateRandom: function(code) {
    var crypto, hash;
    if (code == null) code = "hex";
    crypto = require('crypto');
    hash = crypto.createHash("sha1");
    hash.update(crypto.randomBytes(64).toString());
    return hash.digest(code);
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
