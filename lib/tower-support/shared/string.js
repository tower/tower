var _;

_ = Tower._;

Tower.SupportString = {
  camelize_rx: /(?:^|_|\-|\/)(.)/g,
  capitalize_rx: /(^|\s)([a-z])/g,
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g,
  underscore_rx2: /([a-z\d])([A-Z])/g,
  constantize: function(string, scope) {
    if (scope == null) {
      scope = global;
    }
    return scope[Tower.SupportString.camelize(string)];
  },
  camelize: function(string, firstLetterLower) {
    string = string.replace(Tower.SupportString.camelize_rx, function(str, p1) {
      return p1.toUpperCase();
    });
    if (firstLetterLower) {
      return string.substr(0, 1).toLowerCase() + string.substr(1);
    } else {
      return string;
    }
  },
  underscore: function(string) {
    return string.replace(Tower.SupportString.underscore_rx1, '$1_$2').replace(Tower.SupportString.underscore_rx2, '$1_$2').replace('-', '_').toLowerCase();
  },
  singularize: function(string) {
    var _ref;
    return (_ref = Tower.module('inflector')).singularize.apply(_ref, arguments);
  },
  repeat: function(string, number) {
    return new Array(number + 1).join(string);
  },
  pluralize: function(count, string) {
    if (string) {
      if (count === 1) {
        return string;
      }
    } else {
      string = count;
    }
    return Tower.module('inflector').pluralize(string);
  },
  capitalize: function(string) {
    return string.replace(Tower.SupportString.capitalize_rx, function(m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  },
  trim: function(string) {
    if (string) {
      return string.trim();
    } else {
      return "";
    }
  },
  interpolate: function(stringOrObject, keys) {
    var key, string, value;
    if (typeof stringOrObject === 'object') {
      string = stringOrObject[keys.count];
      if (!string) {
        string = stringOrObject['other'];
      }
    } else {
      string = stringOrObject;
    }
    for (key in keys) {
      value = keys[key];
      string = string.replace(new RegExp("%\\{" + key + "\\}", "g"), value);
    }
    return string;
  },
  grep: function(object, regex, iterator, context) {
    var found;
    regex = _.isRegExp(regex) ? regex : RegExp(String(regex).replace(/([{.(|}:)$+?=^*!\/[\]\\])/g, "\\$1"));
    found = _.select(object, function(s) {
      return regex.test(s);
    }, context);
    if (iterator) {
      return _.map(found, iterator, context);
    }
    return found;
  },
  parameterize: function(string) {
    return Tower.SupportString.underscore(string).replace(/\.([^\.])/, function(__, $1) {
      return $1;
    }).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, '');
  },
  toStateName: function(string) {
    return "is" + (_.camelize(string)) + "Active";
  },
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },
  stringify: function(object, pretty) {
    if (pretty == null) {
      pretty = true;
    }
    if (pretty) {
      return JSON.stringify(object, null, 2);
    } else {
      return JSON.stringify(object);
    }
  }
};

module.exports = Tower.SupportString;
