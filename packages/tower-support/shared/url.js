var _;

_ = Tower._;

Tower.SupportUrl = {
  toQueryValue: function(value, type, negate) {
    var item, items, result, _i, _len;
    if (negate == null) {
      negate = "";
    }
    if (_.isArray(value)) {
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
      if (type === 'date') {
        result += _(value).strftime('YYYY-MM-DD');
      } else {
        result += value.toString();
      }
    }
    result = result.replace(" ", "+").replace(/[#%\"\|<>]/g, function(_) {
      return encodeURIComponent(_);
    });
    return result;
  },
  toQuery: function(object, schema) {
    var data, key, negate, param, range, rangeIdentifier, result, set, type, value;
    if (schema == null) {
      schema = {};
    }
    result = [];
    for (key in object) {
      value = object[key];
      param = "" + key + "=";
      type = schema[key] ? schema[key].type.toLowerCase() : 'string';
      negate = type === "string" ? "-" : "^";
      if (_.isHash(value)) {
        data = {};
        if (value.hasOwnProperty(">=")) {
          data.min = value[">="];
        }
        if (value.hasOwnProperty(">")) {
          data.min = value[">"];
        }
        if (value.hasOwnProperty("<=")) {
          data.max = value["<="];
        }
        if (value.hasOwnProperty("<")) {
          data.max = value["<"];
        }
        if (value.hasOwnProperty("=~")) {
          data.match = value["=~"];
        }
        if (value.hasOwnProperty("!~")) {
          data.notMatch = value["!~"];
        }
        if (value.hasOwnProperty("==")) {
          data.eq = value["=="];
        }
        if (value.hasOwnProperty("!=")) {
          data.neq = value["!="];
        }
        data.range = data.hasOwnProperty("min") || data.hasOwnProperty("max");
        set = [];
        if (data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))) {
          range = "";
          rangeIdentifier = type === 'date' ? 't' : 'n';
          if (data.hasOwnProperty("min")) {
            range += Tower.SupportUrl.toQueryValue(data.min, type);
          } else {
            range += rangeIdentifier;
          }
          range += "..";
          if (data.hasOwnProperty("max")) {
            range += Tower.SupportUrl.toQueryValue(data.max, type);
          } else {
            range += rangeIdentifier;
          }
          set.push(range);
        }
        if (data.hasOwnProperty("eq")) {
          set.push(Tower.SupportUrl.toQueryValue(data.eq, type));
        }
        if (data.hasOwnProperty("match")) {
          set.push(Tower.SupportUrl.toQueryValue(data.match, type));
        }
        if (data.hasOwnProperty("neq")) {
          set.push(Tower.SupportUrl.toQueryValue(data.neq, type, negate));
        }
        if (data.hasOwnProperty("notMatch")) {
          set.push(Tower.SupportUrl.toQueryValue(data.notMatch, type, negate));
        }
        param += set.join(",");
      } else {
        param += Tower.SupportUrl.toQueryValue(value, type);
      }
      result.push(param);
    }
    return result.sort().join("&");
  },
  extractDomain: function(host, tldLength) {
    var parts;
    if (tldLength == null) {
      tldLength = 1;
    }
    if (!this.namedHost(host)) {
      return null;
    }
    parts = host.split('.');
    return parts.slice(0, +(parts.length - 1 - 1 + tldLength) + 1 || 9e9).join(".");
  },
  extractSubdomains: function(host, tldLength) {
    var parts;
    if (tldLength == null) {
      tldLength = 1;
    }
    if (!this.namedHost(host)) {
      return [];
    }
    parts = host.split('.');
    return parts.slice(0, +(-(tldLength + 2)) + 1 || 9e9);
  },
  extractSubdomain: function(host, tldLength) {
    if (tldLength == null) {
      tldLength = 1;
    }
    return this.extractSubdomains(host, tldLength).join('.');
  },
  namedHost: function(host) {
    return !!!(host === null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host));
  },
  rewriteAuthentication: function(options) {
    if (options.user && options.password) {
      return "" + (encodeURI(options.user)) + ":" + (encodeURI(options.password)) + "@";
    } else {
      return "";
    }
  },
  hostOrSubdomainAndDomain: function(options) {
    var host, subdomain, tldLength;
    if (options.subdomain === null && options.domain === null) {
      return options.host;
    }
    tldLength = options.tldLength || 1;
    host = "";
    if (options.subdomain !== false) {
      subdomain = options.subdomain || this.extractSubdomain(options.host, tldLength);
      if (subdomain) {
        host += "" + subdomain + ".";
      }
    }
    host += options.domain || this.extractDomain(options.host, tldLength);
    return host;
  },
  urlForBase: function(options) {
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
        if (!result.match(_.regexpEscape(":|//"))) {
          result += ":";
        }
      }
      if (!result.match("//")) {
        result += "//";
      }
      result += this.rewriteAuthentication(options);
      result += this.hostOrSubdomainAndDomain(options);
      if (port) {
        result += ":" + port;
      }
    }
    if (options.trailingSlash) {
      result += path.replace(/\/$/, "/");
    } else {
      result += path;
    }
    if ((options.format != null) && !result.match(new RegExp('\.' + options.format + '$'))) {
      result += "." + options.format;
    }
    if (!_.isBlank(params)) {
      result += "?" + (Tower.SupportUrl.toQuery(params, schema));
    }
    if (options.anchor) {
      result += "#" + (Tower.SupportUrl.toQuery(options.anchor));
    }
    return result;
  },
  urlFor: function() {
    var args, item, last, options, result, route, _i, _len;
    args = _.args(arguments);
    if (!args[0]) {
      return null;
    }
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
    if (options.route) {
      route = Tower.Route.find(options.route);
      if (route) {
        result = route.urlFor();
      }
    } else if (options.controller && options.action) {
      route = Tower.Route.findByControllerOptions({
        name: _.camelize(options.controller).replace(/(Controller)?$/, "Controller"),
        action: options.action
      });
      if (route) {
        result = "/" + _.parameterize(options.controller);
      }
    } else {
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        item = args[_i];
        result += "/";
        if (typeof item === "string") {
          result += item;
        } else if (item instanceof Tower.Model) {
          result += item.toPath();
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
    last = args[args.length - 1];
    if (last && options.params && !options.schema && last instanceof Tower.Model) {
      options.schema = last.constructor.fields();
    }
    if (Tower.defaultURLOptions) {
      _.defaults(options, Tower.defaultURLOptions);
    } else {
      if (!options.hasOwnProperty("onlyPath")) {
        options.onlyPath = true;
      }
    }
    options.path = result;
    return this.urlForBase(options);
  }
};

Tower.urlFor = function() {
  var _ref;
  return (_ref = Tower.SupportUrl).urlFor.apply(_ref, arguments);
};

module.exports = Tower.SupportUrl;
