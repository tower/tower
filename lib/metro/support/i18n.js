
  Metro.Support.I18n = (function() {

    function I18n() {}

    I18n.defaultLanguage = "en";

    I18n.translate = function(key, options) {
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
      return this.interpolator().render(this.lookup(key, options.language), {
        locals: options
      });
    };

    I18n.t = I18n.translate;

    I18n.lookup = function(key, language) {
      var part, parts, result, _i, _len;
      if (language == null) language = this.defaultLanguage;
      parts = key.split(".");
      result = this.store[language];
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
    };

    I18n.store = {};

    I18n.interpolator = function() {
      return this._interpolator || (this._interpolator = new (require('shift').Mustache));
    };

    return I18n;

  })();

  module.exports = Metro.Support.I18n;
