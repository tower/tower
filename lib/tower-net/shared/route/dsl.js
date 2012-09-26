var _,
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

_ = Tower._;

Tower.NetRouteDSL = (function() {

  function NetRouteDSL() {
    this._scope = {};
  }

  __defineProperty(NetRouteDSL,  "match", function() {
    var route;
    this.scope || (this.scope = {});
    route = new Tower.NetRoute(this._extractOptions.apply(this, arguments));
    return Tower.NetRoute.create(route);
  });

  __defineProperty(NetRouteDSL,  "get", function() {
    return this.matchMethod("get", _.args(arguments));
  });

  __defineProperty(NetRouteDSL,  "post", function() {
    return this.matchMethod("post", _.args(arguments));
  });

  __defineProperty(NetRouteDSL,  "put", function() {
    return this.matchMethod("put", _.args(arguments));
  });

  __defineProperty(NetRouteDSL,  "delete", function() {
    return this.matchMethod("delete", _.args(arguments));
  });

  __defineProperty(NetRouteDSL,  "destroy", NetRouteDSL.prototype["delete"]);

  __defineProperty(NetRouteDSL,  "matchMethod", function(method, args) {
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
      options.name = this._scope.name + _.camelize(options.name);
    }
    path = "/" + name;
    if (this._scope.path) {
      path = this._scope.path + path;
    }
    this.match(path, options);
    return this;
  });

  __defineProperty(NetRouteDSL,  "scope", function(options, block) {
    var originalScope;
    if (options == null) {
      options = {};
    }
    originalScope = this._scope || (this._scope = {});
    this._scope = _.extend({}, originalScope, options);
    block.call(this);
    this._scope = originalScope;
    return this;
  });

  __defineProperty(NetRouteDSL,  "controller", function(controller, options, block) {
    options.controller = controller;
    return this.scope(options, block);
  });

  __defineProperty(NetRouteDSL,  "namespace", function(path, options, block) {
    if (typeof options === 'function') {
      block = options;
      options = {};
    } else {
      options = {};
    }
    options = _.extend({
      name: path,
      path: path,
      as: path,
      module: path,
      shallowPath: path,
      shallowPrefix: path
    }, options);
    if (options.name && this._scope.name) {
      options.name = this._scope.name + _.camelize(options.name);
    }
    return this.scope(options, block);
  });

  __defineProperty(NetRouteDSL,  "constraints", function(options, block) {
    return this.scope({
      constraints: options
    }, block);
  });

  __defineProperty(NetRouteDSL,  "defaults", function(options, block) {
    return this.scope({
      defaults: options
    }, block);
  });

  __defineProperty(NetRouteDSL,  "resource", function(name, options) {
    var camelName, path;
    if (options == null) {
      options = {};
    }
    options.controller = name;
    path = "/" + name;
    if (this._scope.path) {
      path = this._scope.path + path;
    }
    if (this._scope.name) {
      name = this._scope.name + _.camelize(name);
    }
    camelName = _.camelize(name);
    this.match("" + path + "/new", _.extend({
      action: "new",
      state: "" + name + ".new",
      name: "new" + camelName
    }, options));
    this.match(path, _.extend({
      action: "create",
      state: "" + name + ".create",
      method: "POST"
    }, options));
    this.match(path, _.extend({
      action: "show",
      state: "" + name + ".show",
      name: name
    }, options));
    this.match("" + path + "/edit", _.extend({
      action: "edit",
      state: "" + name + ".edit",
      name: "edit" + camelName
    }, options));
    this.match(path, _.extend({
      action: "update",
      state: "" + name + ".update",
      method: "PUT"
    }, options));
    return this.match(path, _.extend({
      action: "destroy",
      state: "" + name + ".destroy",
      method: "DELETE"
    }, options));
  });

  __defineProperty(NetRouteDSL,  "resources", function(name, options, block) {
    var camelOne, many, one, path;
    console.log('resouces');
    if (typeof options === 'function') {
      block = options;
      options = {};
    } else {
      options = {};
    }
    options.controller || (options.controller = name);
    path = "/" + name;
    if (this._scope.path) {
      path = this._scope.path + path;
    }
    if (this._scope.name) {
      many = this._scope.name + _.camelize(name);
    } else {
      many = name;
    }
    one = _.singularize(many);
    camelOne = _.camelize(one);
    this.match(path, _.extend({
      action: "index",
      state: "" + many + ".index",
      name: many,
      method: ['GET']
    }, options));
    this.match("" + path + "/new", _.extend({
      action: "new",
      state: "" + many + ".new",
      name: "new" + camelOne
    }, options));
    this.match(path, _.extend({
      action: "create",
      state: "" + many + ".create",
      method: "POST"
    }, options));
    this.match("" + path + "/:id", _.extend({
      action: "show",
      state: "" + many + ".show",
      name: one
    }, options));
    this.match("" + path + "/:id/edit", _.extend({
      action: "edit",
      state: "" + many + ".edit",
      name: "edit" + camelOne
    }, options));
    this.match("" + path + "/:id", _.extend({
      action: "update",
      state: "" + many + ".update",
      method: "PUT"
    }, options));
    this.match("" + path + "/:id", _.extend({
      action: "destroy",
      state: "" + many + ".destroy",
      method: "DELETE"
    }, options));
    if (block) {
      this.scope(_.extend({
        path: "" + path + "/:" + (_.singularize(name)) + "Id",
        name: one
      }, options), block);
    }
    return this;
  });

  __defineProperty(NetRouteDSL,  "collection", function() {});

  __defineProperty(NetRouteDSL,  "member", function() {});

  __defineProperty(NetRouteDSL,  "root", function(options) {
    return this.match('/', _.extend({
      state: "root.index",
      name: 'showRoot',
      method: ['GET']
    }, options));
  });

  __defineProperty(NetRouteDSL,  "_extractOptions", function() {
    var anchor, args, constraints, controller, defaults, format, method, name, options, path;
    args = _.args(arguments);
    path = "/" + args.shift().replace(/^\/|\/$/, "");
    if (typeof args[args.length - 1] === "object") {
      options = args.pop();
    } else {
      options = {};
    }
    if (args.length > 0) {
      options.to || (options.to = args.shift());
    }
    options.path = path;
    format = this._extractFormat(options);
    options.path = this._extractPath(options);
    method = this._extractRequestMethod(options);
    constraints = this._extractConstraints(options);
    defaults = this._extractDefaults(options);
    controller = this._extractController(options);
    anchor = this._extractAnchor(options);
    name = this._extractName(options);
    options = _.extend(options, {
      method: method,
      constraints: constraints,
      defaults: defaults,
      name: name,
      format: format,
      controller: controller,
      anchor: anchor,
      ip: options.ip,
      state: options.state
    });
    return options;
  });

  __defineProperty(NetRouteDSL,  "_extractFormat", function(options) {});

  __defineProperty(NetRouteDSL,  "_extractName", function(options) {
    return options.as || options.name;
  });

  __defineProperty(NetRouteDSL,  "_extractConstraints", function(options) {
    return _.extend(this._scope.constraints || {}, options.constraints || {});
  });

  __defineProperty(NetRouteDSL,  "_extractDefaults", function(options) {
    return options.defaults || {};
  });

  __defineProperty(NetRouteDSL,  "_extractPath", function(options) {
    return "" + options.path + ".:format?";
  });

  __defineProperty(NetRouteDSL,  "_extractRequestMethod", function(options) {
    return options.method || options.via || "GET";
  });

  __defineProperty(NetRouteDSL,  "_extractAnchor", function(options) {
    return options.anchor;
  });

  __defineProperty(NetRouteDSL,  "_extractController", function(options) {
    var action, controller, to;
    if (options == null) {
      options = {};
    }
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
    controller = _.camelize(controller).replace(/(?:[cC]ontroller)?$/, "Controller");
    return {
      name: controller,
      action: action,
      className: controller
    };
  });

  return NetRouteDSL;

})();

module.exports = Tower.RouteDSL;
