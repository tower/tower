(function() {

  Tower.Support.I18n = {
    PATTERN: /(?:%%|%\{(\w+)\}|%<(\w+)>(.*?\d*\.?\d*[bBdiouxXeEfgGcps]))/g,
    defaultLanguage: "en",
    load: function(pathOrObject, language) {
      var store;
      if (language == null) language = this.defaultLanguage;
      store = this.store();
      language = store[language] || (store[language] = {});
      _.deepMerge(language, typeof pathOrObject === "string" ? require(pathOrObject) : pathOrObject);
      return this;
    },
    translate: function(key, options) {
      if (options == null) options = {};
      if (options.hasOwnProperty("tense")) key += "." + options.tense;
      if (options.hasOwnProperty("count")) {
        switch (options.count) {
          case 0:
            key += ".none";
            break;
          case 1:
            key += ".one";
            break;
          default:
            key += ".other";
        }
      }
      return this.interpolate(this.lookup(key, options.language), options);
    },
    localize: function() {
      return this.translate.apply(this, arguments);
    },
    lookup: function(key, language) {
      var part, parts, result, _i, _len;
      if (language == null) language = this.defaultLanguage;
      parts = key.split(".");
      result = this.store()[language];
      try {
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          result = result[part];
        }
      } catch (error) {
        result = null;
      }
      if (result == null) {
        throw new Error("Translation doesn't exist for '" + key + "'");
      }
      return result;
    },
    store: function() {
      return this._store || (this._store = {});
    },
    interpolate: function(string, locals) {
      if (locals == null) locals = {};
      return string.replace(this.PATTERN, function(match, $1, $2, $3) {
        var key, value;
        if (match === '%%') {
          return '%';
        } else {
          key = $1 || $2;
          if (locals.hasOwnProperty(key)) {
            value = locals[key];
          } else {
            throw new Error("Missing interpolation argument " + key);
          }
          if (typeof value === 'function') value = value.call(locals);
          if ($3) {
            return sprintf("%" + $3, value);
          } else {
            return value;
          }
        }
      });
    }
  };

  Tower.Support.I18n.t = Tower.Support.I18n.translate;

  module.exports = Tower.Support.I18n;

}).call(this);
