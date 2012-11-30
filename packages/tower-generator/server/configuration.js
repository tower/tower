var _,
  __slice = [].slice;

_ = Tower._;

Tower.GeneratorConfiguration = {
  ClassMethods: {
    desc: function(usage, description, options) {
      var task;
      if (options == null) {
        options = {};
      }
      if (options["for"]) {
        task = this.findAndRefreshTask(options["for"]);
        if (usage) {
          task.usage = usage;
        }
        if (description) {
          return task.description = description;
        }
      } else {
        this.usage = usage;
        this.desc = description;
        return this.hide = options.hide || false;
      }
    },
    sourceRoot: function(path) {
      if (path) {
        this._sourceRoot = path;
      }
      return this._sourceRoot || (this._sourceRoot = defaultSourceRoot);
    },
    namespace: function(name) {
      return this.namespace || (this.namespace = namespace.__super__.constructor.apply(this, arguments).replace(/_generator$/, '').replace(/:generators:/, ':'));
    },
    hookFor: function() {
      var asHook, block, defaults, inBase, name, names, options, _base, _i, _j, _len, _results;
      names = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), block = arguments[_i++];
      options = names.extractOptions;
      inBase = options["in"] || baseName;
      asHook = options["as"] || generatorName;
      delete options["in"];
      delete options["as"];
      _results = [];
      for (_j = 0, _len = names.length; _j < _len; _j++) {
        name = names[_j];
        defaults = options.type === "boolean" ? {} : (typeof (_base = this.defaultValueForOption(name, options))["in"] === "function" ? _base["in"]([true, false]) : void 0) ? {
          banner: ""
        } : {
          desc: "" + (Tower.SupportString.titleize(name)) + " to be invoked",
          banner: "NAME"
        };
        if (!classOptions.hasOwnProperty(name)) {
          classOption(name, defaults.merge(options));
        }
        hooks[name] = [inBase, asHook];
        _results.push(this.invokeFromOption(name, options, block));
      }
      return _results;
    },
    removeHookFor: function() {
      var name, names, _i, _len;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      removeInvocation.apply(null, names);
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        delete hooks[name];
      }
      return hooks;
    },
    classOption: function(name, options) {
      if (options == null) {
        options = {};
      }
      if (!options.hasOwnProperty("desc")) {
        options.desc = "Indicates when to generate " + name.toS.humanize.downcase;
      }
      options.aliases = this.defaultAliasesForOption(name, options);
      options["default"] = this.defaultValueForOption(name, options);
      return classOption.__super__.constructor.call(this, name, options);
    },
    defaultSourceRoot: function() {
      var path;
      if (!(baseName && generatorName)) {
        return;
      }
      path = File.expandPath(File.join(baseName, generatorName, 'templates'), this.baseRoot());
      if (typeof File.exists === "function" ? File.exists(path) : void 0) {
        return path;
      }
    },
    baseRoot: function() {
      return File.dirname(__FILE__);
    }
  }
};

module.exports = Tower.GeneratorConfiguration;
