(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Net = {};

  Metro.Net.Agent = (function() {

    function Agent(attributes) {
      var key, value;
      if (attributes == null) attributes = {};
      for (key in attributes) {
        value = attributes[key];
        this[key] = value;
      }
    }

    return Agent;

  })();

  Metro.Net.Param = (function() {

    Param.perPage = 20;

    Param.sortDirection = "ASC";

    Param.sortKey = "sort";

    Param.limitKey = "limit";

    Param.pageKey = "page";

    Param.separator = "_";

    Param.operators = {
      gte: ":value..t",
      gt: ":value...t",
      lte: "t..:value",
      lte: "t...:value",
      rangeInclusive: ":i..:f",
      rangeExclusive: ":i...:f",
      "in": [",", "+OR+"],
      nin: "-",
      all: "[:value]",
      nil: "[-]",
      notNil: "[+]",
      asc: ["+", ""],
      desc: "-",
      geo: ":lat,:lng,:radius"
    };

    Param.create = function(key, options) {
      options.type || (options.type = "String");
      return new Metro.Net.Param[options.type](key, options);
    };

    function Param(key, options) {
      if (options == null) options = {};
      this.controller = options.controller;
      this.key = key;
      this.attribute = options.as || this.key;
      this.modelName = options.modelName;
      if (typeof modelName !== "undefined" && modelName !== null) {
        this.namespace = Metro.Support.String.pluralize(this.modelName);
      }
      this.exact = options.exact || false;
      this["default"] = options["default"];
    }

    Param.prototype.parse = function(value) {
      return value;
    };

    Param.prototype.render = function(value) {
      return value;
    };

    Param.prototype.toCriteria = function(value) {
      var result;
      return result = this.parse(value);
    };

    Param.prototype.parseValue = function(value, operators) {
      return {
        namespace: this.namespace,
        key: this.key,
        operators: operators,
        value: value,
        attribute: this.attribute
      };
    };

    Param.prototype._clean = function(string) {
      return string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "");
    };

    return Param;

  })();

  Metro.Net.Param.String = (function() {

    __extends(String, Metro.Net.Param);

    function String() {
      String.__super__.constructor.apply(this, arguments);
    }

    String.prototype.parse = function(value) {
      var arrays, i, node, values, _len;
      var _this = this;
      arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/);
      for (i = 0, _len = arrays.length; i < _len; i++) {
        node = arrays[i];
        values = [];
        node.replace(/([\+\-\^]?[\w@_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')/g, function(_, token) {
          var exact, negation, operators;
          negation = false;
          exact = false;
          token = token.replace(/^(\+?-+)/, function(_, $1) {
            negation = $1 && $1.length > 0;
            return "";
          });
          token = token.replace(/^\'(.+)\'$/, function(_, $1) {
            exact = $1 && $1.length > 0;
            return $1;
          });
          if (negation) {
            operators = [exact ? "!=" : "!~"];
          } else {
            operators = [exact ? "=" : "=~"];
          }
          if (!!token.match(/^\+?\-?\^/)) operators.push("^");
          if (!!token.match(/\$$/)) operators.push("$");
          values.push(_this.parseValue(_this._clean(token), operators));
          return _;
        });
        arrays[i] = values;
      }
      return arrays;
    };

    String.prototype.toCriteria = function(value) {
      var node, nodes, result, _i, _len, _name;
      nodes = String.__super__.toCriteria.call(this, value)[0];
      result = {};
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        result[_name = node.attribute] || (result[_name] = {});
        result[node.attribute][node.operators[0]] = node.value;
      }
      return result;
    };

    return String;

  })();

  Metro.Net.Route = (function() {

    __extends(Route, Metro.Object);

    Route.store = function() {
      return this._store || (this._store = []);
    };

    Route.create = function(route) {
      return this.store().push(route);
    };

    Route.all = function() {
      return this.store();
    };

    Route.clear = function() {
      return this._store = [];
    };

    Route.draw = function(callback) {
      return callback.apply(new Metro.Net.Route.DSL(this));
    };

    function Route(options) {
      options || (options = options);
      this.path = options.path;
      this.name = options.name;
      this.method = (options.method || "GET").toUpperCase();
      this.ip = options.ip;
      this.defaults = options.defaults || {};
      this.constraints = options.constraints;
      this.options = options;
      this.controller = options.controller;
      this.keys = [];
      this.pattern = this.extractPattern(this.path);
      this.id = this.path;
      if (this.controller) {
        this.id += this.controller.name + this.controller.action;
      }
    }

    Route.prototype.match = function(requestOrPath) {
      var match, path;
      if (typeof requestOrPath === "string") {
        return this.pattern.exec(requestOrPath);
      }
      path = requestOrPath.location.path;
      if (requestOrPath.method.toUpperCase() !== this.method) return null;
      match = this.pattern.exec(path);
      if (!match) return null;
      if (!this.matchConstraints(requestOrPath)) return null;
      return match;
    };

    Route.prototype.matchConstraints = function(request) {
      var constraints, key, value, _results;
      constraints = this.constraints;
      switch (typeof constraints) {
        case "object":
          _results = [];
          for (key in constraints) {
            value = constraints[key];
            switch (typeof value) {
              case "string":
              case "number":
                if (request[key] !== value) {
                  return false;
                } else {
                  _results.push(void 0);
                }
                break;
              case "function":
              case "object":
                if (!request.location[key].match(value)) {
                  return false;
                } else {
                  _results.push(void 0);
                }
                break;
              default:
                _results.push(void 0);
            }
          }
          return _results;
          break;
        case "function":
          return constraints.call(request, request);
        default:
          return false;
      }
    };

    Route.prototype.urlFor = function(options) {
      var key, result, value;
      if (options == null) options = {};
      result = this.path;
      for (key in options) {
        value = options[key];
        result = result.replace(new RegExp(":" + key + "\\??", "g"), value);
      }
      result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "");
      return result;
    };

    Route.prototype.extractPattern = function(path, caseSensitive, strict) {
      var self;
      if (path instanceof RegExp) return path;
      self = this;
      if (path === "/") return new RegExp('^' + path + '$');
      path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
        var result, splat;
        optional = (!!optional) || (open + close === "()");
        splat = symbol === "*";
        self.keys.push({
          name: key,
          optional: !!optional,
          splat: splat
        });
        slash || (slash = "");
        result = "";
        if (!optional || !splat) result += slash;
        result += "(?:";
        if (format != null) {
          result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
        } else {
          result += splat ? "/?(.+)" : "([^/\\.]+)";
        }
        result += ")";
        if (optional) result += "?";
        return result;
      });
      return new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i');
    };

    return Route;

  })();

  Metro.Route = Metro.Net.Route;

  Metro.Net.Route.DSL = (function() {

    function DSL() {
      this._scope = {};
    }

    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
      return Metro.Net.Route.create(new Metro.Net.Route(this._extractOptions.apply(this, arguments)));
    };

    DSL.prototype.get = function() {
      return this.matchMethod("get", Metro.Support.Array.args(arguments));
    };

    DSL.prototype.post = function() {
      return this.matchMethod("post", Metro.Support.Array.args(arguments));
    };

    DSL.prototype.put = function() {
      return this.matchMethod("put", Metro.Support.Array.args(arguments));
    };

    DSL.prototype["delete"] = function() {
      return this.matchMethod("delete", Metro.Support.Array.args(arguments));
    };

    DSL.prototype.matchMethod = function(method, args) {
      var name, options, path;
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      name = args.shift();
      options.method = method;
      options.action = name;
      options.name = name;
      if (this._scope.name) {
        options.name = this._scope.name + Metro.Support.String.camelize(options.name);
      }
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
      this.match(path, options);
      return this;
    };

    DSL.prototype.scope = function(options, block) {
      var originalScope;
      if (options == null) options = {};
      originalScope = this._scope || (this._scope = {});
      this._scope = Metro.Support.Object.extend({}, originalScope, options);
      block.call(this);
      this._scope = originalScope;
      return this;
    };

    DSL.prototype.controller = function(controller, options, block) {
      options.controller = controller;
      return this.scope(options, block);
    };

    /*
      * Scopes routes to a specific namespace. For example:
      * 
      * ```coffeescript
      * namespace "admin", ->
      *   resources "posts"
      * ```
      * 
      * This generates the following routes:
      * 
      *       adminPosts GET    /admin/posts(.:format)          admin/posts#index
      *       adminPosts POST   /admin/posts(.:format)          admin/posts#create
      *    newAdminPost GET    /admin/posts/new(.:format)      admin/posts#new
      *   editAdminPost GET    /admin/posts/:id/edit(.:format) admin/posts#edit
      *        adminPost GET    /admin/posts/:id(.:format)      admin/posts#show
      *        adminPost PUT    /admin/posts/:id(.:format)      admin/posts#update
      *        adminPost DELETE /admin/posts/:id(.:format)      admin/posts#destroy
      * 
      * ## Options
      * 
      * The +:path+, +:as+, +:module+, +:shallowPath+ and +:shallowPrefix+
      * options all default to the name of the namespace.
      * 
      * For options, see <tt>Base#match</tt>. For +:shallowPath+ option, see
      * <tt>Resources#resources</tt>.
      * 
      * ## Examples
      * 
      * ``` coffeescript
      * # accessible through /sekret/posts rather than /admin/posts
      * namespace "admin", path: "sekret", ->
      *   resources "posts"
      * 
      * # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
      * namespace "admin", module: "sekret", ->
      *   resources "posts"
      * 
      * # generates +sekretPostsPath+ rather than +adminPostsPath+
      * namespace "admin", as: "sekret", ->
      *   resources "posts"
      * ```
      * 
      * @param {String} path
    */

    DSL.prototype.namespace = function(path, options, block) {
      if (typeof options === 'function') {
        block = options;
        options = {};
      } else {
        options = {};
      }
      options = Metro.Support.Object.extend({
        name: path,
        path: path,
        as: path,
        module: path,
        shallowPath: path,
        shallowPrefix: path
      }, options);
      if (options.name && this._scope.name) {
        options.name = this._scope.name + Metro.Support.String.camelize(options.name);
      }
      return this.scope(options, block);
    };

    DSL.prototype.constraints = function(options, block) {
      return this.scope({
        constraints: options
      }, block);
    };

    DSL.prototype.defaults = function(options, block) {
      return this.scope({
        defaults: options
      }, block);
    };

    DSL.prototype.resource = function(name, options) {
      if (options == null) options = {};
      options.controller = name;
      this.match("" + name + "/new", Metro.Support.Object.extend({
        action: "new"
      }, options));
      this.match("" + name, Metro.Support.Object.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + name + "/", Metro.Support.Object.extend({
        action: "show"
      }, options));
      this.match("" + name + "/edit", Metro.Support.Object.extend({
        action: "edit"
      }, options));
      this.match("" + name, Metro.Support.Object.extend({
        action: "update",
        method: "PUT"
      }, options));
      return this.match("" + name, Metro.Support.Object.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
    };

    DSL.prototype.resources = function(name, options, callback) {
      var many, one, path;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = {};
      }
      options.controller || (options.controller = name);
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
      if (this._scope.name) {
        many = this._scope.name + Metro.Support.String.camelize(name);
      } else {
        many = name;
      }
      one = Metro.Support.String.singularize(many);
      this.match("" + path, Metro.Support.Object.extend({
        name: "" + many,
        action: "index"
      }, options));
      this.match("" + path + "/new", Metro.Support.Object.extend({
        name: "new" + (Metro.Support.String.camelize(one)),
        action: "new"
      }, options));
      this.match("" + path, Metro.Support.Object.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + path + "/:id", Metro.Support.Object.extend({
        name: "" + one,
        action: "show"
      }, options));
      this.match("" + path + "/:id/edit", Metro.Support.Object.extend({
        name: "edit" + (Metro.Support.String.camelize(one)),
        action: "edit"
      }, options));
      this.match("" + path + "/:id", Metro.Support.Object.extend({
        action: "update",
        method: "PUT"
      }, options));
      this.match("" + path + "/:id", Metro.Support.Object.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
      if (callback) {
        this.scope(Metro.Support.Object.extend({
          path: "" + path + "/:" + (Metro.Support.String.singularize(name)) + "Id",
          name: one
        }, options), callback);
      }
      return this;
    };

    DSL.prototype.collection = function() {};

    DSL.prototype.member = function() {};

    DSL.prototype.root = function(options) {
      return this.match('/', Metro.Support.Object.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, args, constraints, controller, defaults, format, method, name, options, path;
      args = Metro.Support.Array.args(arguments);
      path = "/" + args.shift().replace(/^\/|\/$/, "");
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      if (args.length > 0) options.to || (options.to = args.shift());
      options.path = path;
      format = this._extractFormat(options);
      options.path = this._extractPath(options);
      method = this._extractRequestMethod(options);
      constraints = this._extractConstraints(options);
      defaults = this._extractDefaults(options);
      controller = this._extractController(options);
      anchor = this._extractAnchor(options);
      name = this._extractName(options);
      options = Metro.Support.Object.extend(options, {
        method: method,
        constraints: constraints,
        defaults: defaults,
        name: name,
        format: format,
        controller: controller,
        anchor: anchor,
        ip: options.ip
      });
      return options;
    };

    DSL.prototype._extractFormat = function(options) {};

    DSL.prototype._extractName = function(options) {
      return options.as || options.name;
    };

    DSL.prototype._extractConstraints = function(options) {
      return Metro.Support.Object.extend(this._scope.constraints || {}, options.constraints || {});
    };

    DSL.prototype._extractDefaults = function(options) {
      return options.defaults || {};
    };

    DSL.prototype._extractPath = function(options) {
      return "" + options.path + ".:format?";
    };

    DSL.prototype._extractRequestMethod = function(options) {
      return (options.method || options.via || "GET").toUpperCase();
    };

    DSL.prototype._extractAnchor = function(options) {
      return options.anchor;
    };

    DSL.prototype._extractController = function(options) {
      var action, controller, to;
      if (options == null) options = {};
      to = options.to;
      if (to) {
        to = to.split('#');
        if (to.length === 1) {
          action = to[0];
        } else {
          controller = to[0];
          action = to[1];
        }
      }
      controller || (controller = options.controller || this._scope.controller);
      action || (action = options.action);
      if (!controller) {
        throw new Error("No controller was specified for the route " + options.path);
      }
      controller = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller");
      return {
        name: controller,
        action: action,
        className: Metro.Support.String.camelize("" + controller)
      };
    };

    return DSL;

  })();

  Metro.Net.Route.Urls = {
    ClassMethods: {
      urlFor: function(options) {
        var action, anchor, controller, host, port;
        switch (typeof options) {
          case "string":
            return options;
          default:
            return controller = options.controller, action = options.action, host = options.host, port = options.port, anchor = options.anchor, options;
        }
      }
    }
  };

  Metro.Net.Route.PolymorphicUrls = {
    ClassMethods: {
      polymorphicUrl: function() {}
    }
  };

  Metro.Net.Route.include(Metro.Net.Route.Urls);

  Metro.Net.Route.include(Metro.Net.Route.PolymorphicUrls);

  Metro.Net.Request = (function() {

    function Request(data) {
      if (data == null) data = {};
      this.url = data.url;
      this.location = data.location;
      this.pathname = this.location.path;
      this.query = this.parsedUrl.param;
      this.title = data.title;
      this.title || (this.title = typeof document !== "undefined" && document !== null ? document.title : void 0);
      this.body = data.body || {};
      this.headers = data.headers || {};
      this.method = data.method || "GET";
    }

    return Request;

  })();

  Metro.Net.Response = (function() {

    function Response(data) {
      if (data == null) data = {};
      this.url = data.url;
      this.location = data.location;
      this.pathname = this.location.path;
      this.query = this.parsedUrl.param;
      this.title = data.title;
      this.title || (this.title = typeof document !== "undefined" && document !== null ? document.title : void 0);
      this.body = data.body || {};
      this.headers = data.headers || {};
      this.headerSent = false;
      this.statusCode = 200;
      this.body = "";
    }

    Response.prototype.writeHead = function(statusCode, headers) {
      this.statusCode = statusCode;
      return this.headers = headers;
    };

    Response.prototype.setHeader = function(key, value) {
      if (this.headerSent) throw new Error("Headers already sent");
      return this.headers[key] = value;
    };

    Response.prototype.write = function(body) {
      if (body == null) body = '';
      return this.body += body;
    };

    Response.prototype.end = function(body) {
      if (body == null) body = '';
      this.body += body;
      this.sent = true;
      return this.headerSent = true;
    };

    return Response;

  })();

  Metro.Net.Url = (function() {

    Url.key = ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "fragment"];

    Url.aliases = {
      anchor: "fragment"
    };

    Url.parser = {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };

    Url.querystringParser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.fragmentParser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.typeParser = /(youtube|vimeo|eventbrite)/;

    Url.prototype.parse = function(string) {
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
        if ($1) return params[$1] = $2;
      });
      attributes["fragment"].replace(this.constructor.fragmentParser, function($0, $1, $2) {
        if ($1) return fragment.params[$1] = $2;
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
      if (this.port != null) return this.port = parseInt(this.port);
    };

    function Url(url, depth, strictMode) {
      if (depth == null) depth = 1;
      this.strictMode = strictMode || false;
      this.depth = depth || 1;
      if (typeof window !== "undefined" && window !== null) {
        this.url = url || (url = window.location.toString());
      }
      this.parse(url);
    }

    return Url;

  })();

}).call(this);
