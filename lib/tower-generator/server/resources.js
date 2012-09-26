var File, fs;

File = require('pathfinder').File;

fs = require('fs');

Tower.GeneratorResources = {
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
    generator = this.constructor.buildGenerator(type);
    generator = new generator(options);
    return generator.run();
  },
  nodeModule: function(name, options) {
    if (options == null) {
      options = {};
    }
  },
  locals: function() {
    return {
      model: this.model,
      view: this.view,
      controller: this.controller,
      app: this.app,
      user: this.user,
      _: _,
      printCoffeeOptions: function(options) {
        var key, result, value;
        if (options == null) {
          options = {};
        }
        result = [];
        for (key in options) {
          value = options[key];
          if (typeof value !== 'undefined') {
            value = (function() {
              switch (_.kind(value)) {
                case 'NaN':
                case 'null':
                  return 'null';
                case 'array':
                case 'string':
                case 'integer':
                case 'float':
                case 'number':
                case 'boolean':
                  return JSON.stringify(value);
              }
            })();
            result.push(("" + key + ": " + value).replace(/"/g, "'"));
          }
        }
        return result.join(', ');
      }
    };
  },
  buildAttribute: function(name, type, options) {
    var attribute, defaultValue, fakeKey;
    if (type == null) {
      type = 'string';
    }
    if (options == null) {
      options = {};
    }
    if (!options.hasOwnProperty('default')) {
      defaultValue = (function() {
        switch (type.toLowerCase()) {
          case 'integer':
            return 0;
          case 'array':
            return [];
          default:
            return void 0;
        }
      })();
      if (typeof defaultValue !== 'undefined') {
        options["default"] = defaultValue;
      }
    }
    attribute = {
      name: name,
      options: options,
      type: (function() {
        switch (type.toLowerCase()) {
          case 'text':
            return 'String';
          default:
            return _.camelize(type);
        }
      })(),
      humanName: _.humanize(name),
      fieldType: (function() {
        switch (type.toLowerCase()) {
          case 'integer':
            return 'number';
          case 'float':
          case 'decimal':
          case 'string':
            return 'string';
          case 'time':
            return 'time';
          case 'datetime':
          case 'timestamp':
            return 'datetime';
          case 'date':
            return 'date';
          case 'text':
            return 'text';
          case 'boolean':
            return 'checkbox';
          default:
            return 'string';
        }
      })(),
      value: (function() {
        switch (type) {
          case 'integer':
            return 0;
          case 'array':
            return [];
          default:
            return "A " + name;
        }
      })()
    };
    switch (type.toLowerCase()) {
      case 'string':
        fakeKey = null;
        if (name.match(/email/i)) {
          fakeKey = 'email';
        } else if (name.match(/username|screenname|login/i)) {
          fakeKey = 'userName';
        } else if (name.match(/domain|url/)) {
          fakeKey = 'domainName';
        } else if (name.match(/^(firstName|lastName)$/)) {
          fakeKey = RegExp.$1;
        } else if (name.match(/^(name|fullName)$/)) {
          fakeKey = 'fullName';
        } else if (name.match('phone')) {
          fakeKey = 'phone';
        } else if (name.match(/text|content|body/)) {
          fakeKey = 'paragraph';
        } else if (name.match(/title/)) {
          fakeKey = 'words';
        }
        if (fakeKey) {
          attribute.fakeKey = fakeKey;
        }
        break;
      case 'boolean':
        attribute.fakeKey = 'boolean';
    }
    return attribute;
  },
  buildRelation: function(type, className, options) {
    var relation;
    relation = {
      name: _.camelize(className, true),
      type: type,
      humanName: _.humanize(className)
    };
    if (_.isPresent(options)) {
      relation.options = options;
    }
    return relation;
  },
  buildModel: function(name, appNamespace, argv) {
    var attributes, className, classNamePlural, humanName, humanNamePlural, isRelation, key, namePlural, namespacedClassName, namespaces, optionKey, optionValue, options, pair, paramName, paramNamePlural, rawOption, rawOptions, relations, type, _i, _j, _len, _len1, _ref, _ref1;
    if (argv == null) {
      argv = [];
    }
    namespaces = name.split('/');
    name = namespaces.pop();
    name = _.camelize(name, true);
    className = _.camelize(name);
    classNamePlural = _.pluralize(className);
    namespacedClassName = "" + appNamespace + "." + className;
    namePlural = _.pluralize(name);
    paramName = _.parameterize(name);
    paramNamePlural = _.parameterize(namePlural);
    humanName = _.humanize(className);
    humanNamePlural = _.pluralize(humanName);
    attributes = [];
    relations = {
      belongsTo: [],
      hasOne: [],
      hasMany: []
    };
    argv.splice(0, 3);
    for (_i = 0, _len = argv.length; _i < _len; _i++) {
      pair = argv[_i];
      rawOptions = null;
      if (pair.match(/\[/)) {
        pair = pair.replace(/([^\[]+)\[(.+)/, function(_, $1, $2) {
          rawOptions = $2;
          return pair = $1;
        });
      } else {
        _ref = pair.split(/\[/), pair = _ref[0], rawOptions = _ref[1];
      }
      pair = pair.split(':');
      key = pair[0];
      isRelation = !!key.match(/(belongsTo|hasMany|hasOne)/);
      if (pair.length > 1) {
        type = pair[1];
      } else {
        type = key.match(/count$/i) ? 'Integer' : key.match(/At$/) ? 'Date' : 'String';
      }
      type = _.camelize(type || 'String', true);
      options = {};
      if (!_.isBlank(rawOptions)) {
        rawOptions = rawOptions.replace(/\]$/, '').split(/,\s*/);
        for (_j = 0, _len1 = rawOptions.length; _j < _len1; _j++) {
          rawOption = rawOptions[_j];
          _ref1 = rawOption = rawOption.split(':'), optionKey = _ref1[0], optionValue = _ref1[1];
          if (rawOption.length === 1) {
            optionValue = optionKey;
            if (isRelation) {
              optionKey = 'type';
            } else {
              optionKey = 'default';
            }
          }
          if (optionKey === 'type') {
            optionValue = _.camelize(optionValue);
          }
          try {
            options[optionKey] = JSON.parse(optionValue);
          } catch (error) {
            options[optionKey] = optionValue;
          }
        }
      }
      rawOptions = null;
      if (isRelation) {
        relations[key].push(this.buildRelation(key, _.camelize(type), options));
      } else {
        attributes.push(this.buildAttribute(key, _.camelize(type), options));
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
      humanNamePlural: humanNamePlural,
      attributes: attributes,
      relations: relations,
      namespacedDirectory: namespaces.join('/'),
      viewDirectory: namespaces.join('/') + ("/" + namePlural),
      namespaced: _.map(namespaces, function(n) {
        return _.camelize(n);
      }).join('.')
    };
  },
  buildApp: function(name) {
    var _base;
    if (name == null) {
      name = this.appName;
    }
    (_base = this.program).namespace || (_base.namespace = Tower.namespace());
    return {
      name: name,
      namespace: _.camelize(this.program.namespace),
      paramName: _.parameterize(name),
      paramNamePlural: _.parameterize(_.pluralize(name)),
      session: this.generateRandom('hex'),
      year: (new Date).getFullYear(),
      directory: name,
      isStatic: true
    };
  },
  buildView: function(name) {
    name = _.map(name.split('/'), function(n) {
      return _.camelize(n, true);
    }).join('/');
    return {
      namespace: name,
      directory: _.pluralize(name)
    };
  },
  buildController: function(name) {
    var className, directory, namespace, namespaces;
    namespaces = name.split('/');
    className = _.pluralize(_.camelize(namespaces[namespaces.length - 1])) + 'Controller';
    if (namespaces.length > 1) {
      namespaces = namespaces.slice(0, -1);
      directory = _.map(namespaces, function(n) {
        return _.camelize(n, true);
      }).join('/');
      namespace = this.app.namespace + '.' + _.map(namespaces, function(n) {
        return _.camelize(n);
      }).join('.');
    } else {
      namespace = this.app.namespace;
      directory = '';
    }
    return {
      namespace: namespace,
      className: className,
      directory: directory,
      name: _.camelize(className, true),
      namespaced: directory !== ''
    };
  },
  generateRandom: function(code) {
    var crypto, hash, uuid;
    if (code == null) {
      code = 'hex';
    }
    crypto = require('crypto');
    uuid = require('node-uuid');
    hash = crypto.createHash('sha1');
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
        lines = File.read(gitFile).split('\n');
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          if (line.charAt(0) !== '#' && line.match(/\S/)) {
            if (line.match(/^\[(.*)\]$/)) {
              variable = RegExp.$1;
            } else {
              line = line.split('=');
              key = line[0].trim();
              value = line[1].trim();
              gitConfig[variable] || (gitConfig[variable] = {});
              gitConfig[variable][key] = value;
            }
          }
        }
      }
      user.name = gitConfig.user && gitConfig.user.name ? gitConfig.user.name : 'username';
      user.email = gitConfig.user && gitConfig.user.email ? gitConfig.user.email : 'user@example.com';
      user.username = gitConfig.github && gitConfig.github.user ? gitConfig.github.user : 'User';
    } catch (error) {
      this;

    }
    user.name || (user.name = 'username');
    user.email || (user.email = 'user@example.com');
    user.username || (user.username = 'User');
    user.database = 'mongodb';
    if (callback) {
      callback(user);
    }
    return user;
  }
};

module.exports = Tower.GeneratorResources;
