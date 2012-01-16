
Tower.Support.String = {
  camelize_rx: /(?:^|_|\-)(.)/g,
  capitalize_rx: /(^|\s)([a-z])/g,
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g,
  underscore_rx2: /([a-z\d])([A-Z])/g,
  parameterize: function(string) {
    return Tower.Support.String.underscore(string).replace("_", "-");
  },
  constantize: function(string, scope) {
    if (scope == null) scope = global;
    return scope[this.camelize(string)];
  },
  camelize: function(string, firstLetterLower) {
    string = string.replace(this.camelize_rx, function(str, p1) {
      return p1.toUpperCase();
    });
    if (firstLetterLower) {
      return string.substr(0, 1).toLowerCase() + string.substr(1);
    } else {
      return string;
    }
  },
  underscore: function(string) {
    return string.replace(this.underscore_rx1, '$1_$2').replace(this.underscore_rx2, '$1_$2').replace('-', '_').toLowerCase();
  },
  singularize: function(string) {
    var len;
    len = string.length;
    if (string.substr(len - 3) === 'ies') {
      return string.substr(0, len - 3) + 'y';
    } else if (string.substr(len - 1) === 's') {
      return string.substr(0, len - 1);
    } else {
      return string;
    }
  },
  pluralize: function(count, string) {
    var lastLetter, len;
    if (string) {
      if (count === 1) return string;
    } else {
      string = count;
    }
    len = string.length;
    lastLetter = string.substr(len - 1);
    if (lastLetter === 'y') {
      return "" + (string.substr(0, len - 1)) + "ies";
    } else if (lastLetter === 's') {
      return string;
    } else {
      return "" + string + "s";
    }
  },
  capitalize: function(string) {
    return string.replace(this.capitalize_rx, function(m, p1, p2) {
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
      if (!string) string = stringOrObject['other'];
    } else {
      string = stringOrObject;
    }
    for (key in keys) {
      value = keys[key];
      string = string.replace(new RegExp("%\\{" + key + "\\}", "g"), value);
    }
    return string;
  }
};

module.exports = Tower.Support.String;

Tower.Support.String.toQueryValue = function(value, negate) {
  var item, items, result, _i, _len;
  if (negate == null) negate = "";
  if (Tower.Support.Object.isArray(value)) {
    items = [];
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      item = value[_i];
      result = negate;
      result += item;
      items.push(result);
    }
    result = items.join(",");
  } else {
    result = negate;
    result += value.toString();
  }
  result = result.replace(" ", "+").replace(/[#%\"\|<>]/g, function(_) {
    return encodeURIComponent(_);
  });
  return result;
};

Tower.Support.String.toQuery = function(object, schema) {
  var data, key, negate, param, range, result, set, type, value;
  if (schema == null) schema = {};
  result = [];
  for (key in object) {
    value = object[key];
    param = "" + key + "=";
    type = schema[key] || "string";
    negate = type === "string" ? "-" : "^";
    if (Tower.Support.Object.isHash(value)) {
      data = {};
      if (value.hasOwnProperty(">=")) data.min = value[">="];
      if (value.hasOwnProperty(">")) data.min = value[">"];
      if (value.hasOwnProperty("<=")) data.max = value["<="];
      if (value.hasOwnProperty("<")) data.max = value["<"];
      if (value.hasOwnProperty("=~")) data.match = value["=~"];
      if (value.hasOwnProperty("!~")) data.notMatch = value["!~"];
      if (value.hasOwnProperty("==")) data.eq = value["=="];
      if (value.hasOwnProperty("!=")) data.neq = value["!="];
      data.range = data.hasOwnProperty("min") || data.hasOwnProperty("max");
      set = [];
      if (data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))) {
        range = "";
        if (data.hasOwnProperty("min")) {
          range += Tower.Support.String.toQueryValue(data.min);
        } else {
          range += "n";
        }
        range += "..";
        if (data.hasOwnProperty("max")) {
          range += Tower.Support.String.toQueryValue(data.max);
        } else {
          range += "n";
        }
        set.push(range);
      }
      if (data.hasOwnProperty("eq")) {
        set.push(Tower.Support.String.toQueryValue(data.eq));
      }
      if (data.hasOwnProperty("match")) {
        set.push(Tower.Support.String.toQueryValue(data.match));
      }
      if (data.hasOwnProperty("neq")) {
        set.push(Tower.Support.String.toQueryValue(data.neq, negate));
      }
      if (data.hasOwnProperty("notMatch")) {
        set.push(Tower.Support.String.toQueryValue(data.notMatch, negate));
      }
      param += set.join(",");
    } else {
      param += Tower.Support.String.toQueryValue(value);
    }
    result.push(param);
  }
  return result.sort().join("&");
};

Tower.Support.String.extractDomain = function(host, tldLength) {
  var parts;
  if (tldLength == null) tldLength = 1;
  if (!this.namedHost(host)) return null;
  parts = host.split('.');
  return parts.slice(0, (parts.length - 1 - 1 + tldLength) + 1 || 9e9).join(".");
};

Tower.Support.String.extractSubdomains = function(host, tldLength) {
  var parts;
  if (tldLength == null) tldLength = 1;
  if (!this.namedHost(host)) return [];
  parts = host.split('.');
  return parts.slice(0, -(tldLength + 2) + 1 || 9e9);
};

Tower.Support.String.extractSubdomain = function(host, tldLength) {
  if (tldLength == null) tldLength = 1;
  return this.extractSubdomains(host, tldLength).join('.');
};

Tower.Support.String.namedHost = function(host) {
  return !!!(host === null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host));
};

Tower.Support.String.rewriteAuthentication = function(options) {
  if (options.user && options.password) {
    return "" + (encodeURI(options.user)) + ":" + (encodeURI(options.password)) + "@";
  } else {
    return "";
  }
};

Tower.Support.String.hostOrSubdomainAndDomain = function(options) {
  var host, subdomain, tldLength;
  if (options.subdomain === null && options.domain === null) return options.host;
  tldLength = options.tldLength || 1;
  host = "";
  if (options.subdomain !== false) {
    subdomain = options.subdomain || this.extractSubdomain(options.host, tldLength);
    if (subdomain) host += "" + subdomain + ".";
  }
  host += options.domain || this.extractDomain(options.host, tldLength);
  return host;
};

Tower.Support.String.urlFor = function(options) {
  var params, path, port, result, schema;
  if (!(options.host || options.onlyPath)) {
    throw new Error('Missing host to link to! Please provide the :host parameter, set defaultUrlOptions[:host], or set :onlyPath to true');
  }
  result = "";
  params = options.params || {};
  path = (options.path || "").replace(/\/+/, "/");
  schema = options.schema || {};
  delete options.path;
  delete options.schema;
  if (!options.onlyPath) {
    port = options.port;
    delete options.port;
    if (options.protocol !== false) {
      result += options.protocol || "http";
      if (!result.match(Tower.Support.RegExp.regexpEscape(":|//"))) result += ":";
    }
    if (!result.match("//")) result += "//";
    result += this.rewriteAuthentication(options);
    result += this.hostOrSubdomainAndDomain(options);
    if (port) result += ":" + port;
  }
  if (options.trailingSlash) {
    result += path.replace(/\/$/, "/");
  } else {
    result += path;
  }
  if (!Tower.Support.Object.isBlank(params)) {
    result += "?" + (Tower.Support.String.toQuery(params, schema));
  }
  if (options.anchor) {
    result += "#" + (Tower.Support.String.toQuery(options.anchor));
  }
  return result;
};

Tower.urlFor = function() {
  var args, item, last, options, result, route, _i, _len;
  args = Tower.Support.Array.args(arguments);
  if (!args[0]) return null;
  if (args[0] instanceof Tower.Model || (typeof args[0]).match(/(string|function)/)) {
    last = args[args.length - 1];
    if (last instanceof Tower.Model || (typeof last).match(/(string|function)/)) {
      options = {};
    } else {
      options = args.pop();
    }
  }
  options || (options = args.pop());
  result = "";
  if (options.controller && options.action) {
    route = Tower.Route.find({
      name: options.controller.replace(/(Controller)?$/, "Controller"),
      action: options.action
    });
    if (route) {
      result = "/" + Tower.Support.String.parameterize(options.controller);
    }
  } else {
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      item = args[_i];
      result += "/";
      if (typeof item === "string") {
        result += item;
      } else if (item instanceof Tower.Model) {
        result += item.constructor.toParam() + "/" + item.toParam();
      } else if (typeof item === "function") {
        result += item.toParam();
      }
    }
  }
  result += (function() {
    switch (options.action) {
      case "new":
        return "/new";
      case "edit":
        return "/edit";
      default:
        return "";
    }
  })();
  options.path = result;
  return Tower.Support.String.urlFor(options);
};

Tower.Support.String.parameterize = function(string) {
  return Tower.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
};
