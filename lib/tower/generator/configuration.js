var __slice = Array.prototype.slice;

Tower.Generator.Configuration = {
  ClassMethods: {
    sourceRoot: function(path) {
      if (path) this._sourceRoot = path;
      return this._sourceRoot || (this._sourceRoot = defaultSourceRoot);
    },
    namespace: function(name) {
      return this.namespace || (this.namespace = namespace.__super__.constructor.apply(this, arguments).replace(/_generator$/, '').replace(/:generators:/, ':'));
    },
    hookFor: function() {
      var as_hook, block, defaults, in_base, name, names, options, _base, _i, _j, _len, _results;
      names = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), block = arguments[_i++];
      options = names.extract_options;
      in_base = options["in"] || baseName;
      as_hook = options["as"] || generatorName;
      delete options["in"];
      delete options["as"];
      _results = [];
      for (_j = 0, _len = names.length; _j < _len; _j++) {
        name = names[_j];
        defaults = options.type === "boolean" ? {} : (typeof (_base = this.defaultValueForOption(name, options))["in"] === "function" ? _base["in"]([true, false]) : void 0) ? {
          banner: ""
        } : {
          desc: "" + name.to_s.humanize + " to be invoked",
          banner: "NAME"
        };
        if (!classOptions.hasOwnProperty(name)) {
          classOption(name, defaults.merge(options));
        }
        hooks[name] = [in_base, as_hook];
        _results.push(this.invokeFromOption(name, options, block));
      }
      return _results;
    },
    removeHookFor: function() {
      var name, names, _i, _len;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      remove_invocation.apply(null, names);
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        delete hooks[name];
      }
      return hooks;
    },
    classOption: function(name, options) {
      if (options == null) options = {};
      if (!options.hasOwnProperty("desc")) {
        options.desc = "Indicates when to generate " + name.to_s.humanize.downcase;
      }
      options.aliases = this.defaultAliasesForOption(name, options);
      options["default"] = this.defaultValueForOption(name, options);
      return classOption.__super__.constructor.call(this, name, options);
    },
    defaultSourceRoot: function() {
      var path;
      if (!(baseName && generatorName)) return;
      path = File.expand_path(File.join(baseName, generatorName, 'templates'), this.baseRoot());
      if (typeof File.exists === "function" ? File.exists(path) : void 0) {
        return path;
      }
    },
    baseRoot: function() {
      return File.dirname(__FILE__);
    }
  }
};

module.exports = Tower.Generator.Configuration;
