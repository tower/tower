var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.HTTP.Url = (function() {

  __defineStaticProperty(Url,  "key", ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "fragment"]);

  __defineStaticProperty(Url,  "aliases", {
    anchor: "fragment"
  });

  __defineStaticProperty(Url,  "parser", {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  });

  __defineStaticProperty(Url,  "querystringParser", /(?:^|&|;)([^&=;]*)=?([^&;]*)/g);

  __defineStaticProperty(Url,  "fragmentParser", /(?:^|&|;)([^&=;]*)=?([^&;]*)/g);

  __defineStaticProperty(Url,  "typeParser", /(youtube|vimeo|eventbrite)/);

  __defineProperty(Url,  "parse", function(string) {
    var attributes, domains, fragment, i, key, params, parsed, value;
    key = this.constructor.key;
    string = decodeURI(string);
    parsed = this.constructor.parser[(this.strictMode || false ? "strict" : "loose")].exec(string);
    attributes = {};
    this.params = params = {};
    this.fragment = fragment = {
      params: {}
    };
    i = 14;
    while (i--) {
      attributes[key[i]] = parsed[i] || "";
    }
    attributes["query"].replace(this.constructor.querystringParser, function($0, $1, $2) {
      if ($1) {
        return params[$1] = $2;
      }
    });
    attributes["fragment"].replace(this.constructor.fragmentParser, function($0, $1, $2) {
      if ($1) {
        return fragment.params[$1] = $2;
      }
    });
    this.segments = attributes.path.replace(/^\/+|\/+$/g, "").split("/");
    fragment.segments = attributes.fragment.replace(/^\/+|\/+$/g, "").split("/");
    for (key in attributes) {
      value = attributes[key];
      this[key] || (this[key] = value);
    }
    this.root = (attributes.host ? attributes.protocol + "://" + attributes.hostname + (attributes.port ? ":" + attributes.port : "") : "");
    domains = this.hostname.split(".");
    this.domain = domains.slice(domains.length - 1 - this.depth, (domains.length - 1) + 1 || 9e9).join(".");
    this.subdomains = domains.slice(0, (domains.length - 2 - this.depth) + 1 || 9e9);
    this.subdomain = this.subdomains.join(".");
    if (this.port != null) {
      return this.port = parseInt(this.port);
    }
  });

  function Url(url, depth, strictMode) {
    if (depth == null) {
      depth = 1;
    }
    this.strictMode = strictMode || false;
    this.depth = depth || 1;
    if (typeof window !== "undefined" && window !== null) {
      this.url = url || (url = window.location.toString());
    }
    this.parse(url);
  }

  return Url;

})();

module.exports = Tower.HTTP.Url;
