var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.HTTP.Route.DSL = (function() {

  function DSL() {
    this._scope = {};
  }

  __defineProperty(DSL,  "match", function() {
    this.scope || (this.scope = {});
    return Tower.HTTP.Route.create(new Tower.HTTP.Route(this._extractOptions.apply(this, arguments)));
  });

  __defineProperty(DSL,  "get", function() {
    return this.matchMethod("get", _.args(arguments));
  });

  __defineProperty(DSL,  "post", function() {
    return this.matchMethod("post", _.args(arguments));
  });

  __defineProperty(DSL,  "put", function() {
    return this.matchMethod("put", _.args(arguments));
  });

  __defineProperty(DSL,  "delete", function() {
    return this.matchMethod("delete", _.args(arguments));
  });

  __defineProperty(DSL,  "matchMethod", function(method, args) {
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
      options.name = this._scope.name + Tower.Support.String.camelize(options.name);
    }
    path = "/" + name;
    if (this._scope.path) {
      path = this._scope.path + path;
    }
    this.match(path, options);
    return this;
  });

  __defineProperty(DSL,  "scope", function(options, block) {
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

  __defineProperty(DSL,  "controller", function(controller, options, block) {
    options.controller = controller;
    return this.scope(options, block);
  });

  __defineProperty(DSL,  "namespace", function(path, options, block) {
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
      options.name = this._scope.name + Tower.Support.String.camelize(options.name);
    }
    return this.scope(options, block);
  });

  __defineProperty(DSL,  "constraints", function(options, block) {
    return this.scope({
      constraints: options
    }, block);
  });

  __defineProperty(DSL,  "defaults", function(options, block) {
    return this.scope({
      defaults: options
    }, block);
  });

  __defineProperty(DSL,  "resource", function(name, options) {
    var path;
    if (options == null) {
      options = {};
    }
    options.controller = name;
    path = "/" + name;
    if (this._scope.path) {
      path = this._scope.path + path;
    }
    if (this._scope.name) {
      name = this._scope.name + Tower.Support.String.camelize(name);
    }
    this.match("" + path + "/new", _.extend({
      name: "new" + (Tower.Support.String.camelize(name)),
      action: "new"
    }, options));
    this.match("" + path, _.extend({
      action: "create",
      method: "POST"
    }, options));
    this.match("" + path, _.extend({
      name: name,
      action: "show"
    }, options));
    this.match("" + path + "/edit", _.extend({
      name: "edit" + (Tower.Support.String.camelize(name)),
      action: "edit"
    }, options));
    this.match("" + path, _.extend({
      action: "update",
      method: "PUT"
    }, options));
    return this.match("" + path, _.extend({
      action: "destroy",
      method: "DELETE"
    }, options));
  });

  __defineProperty(DSL,  "resources", function(name, options, callback) {
    var many, one, path;
    if (typeof options === 'function') {
      callback = options;
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
      many = this._scope.name + Tower.Support.String.camelize(name);
    } else {
      many = name;
    }
    one = Tower.Support.String.singularize(many);
    this.match("" + path, _.extend({
      name: "" + many,
      action: "index"
    }, options));
    this.match("" + path + "/new", _.extend({
      name: "new" + (Tower.Support.String.camelize(one)),
      action: "new"
    }, options));
    this.match("" + path, _.extend({
      action: "create",
      method: "POST"
    }, options));
    this.match("" + path + "/:id", _.extend({
      name: "" + one,
      action: "show"
    }, options));
    this.match("" + path + "/:id/edit", _.extend({
      name: "edit" + (Tower.Support.String.camelize(one)),
      action: "edit"
    }, options));
    this.match("" + path + "/:id", _.extend({
      action: "update",
      method: "PUT"
    }, options));
    this.match("" + path + "/:id", _.extend({
      action: "destroy",
      method: "DELETE"
    }, options));
    if (callback) {
      this.scope(_.extend({
        path: "" + path + "/:" + (Tower.Support.String.singularize(name)) + "Id",
        name: one
      }, options), callback);
    }
    return this;
  });

  __defineProperty(DSL,  "collection", function() {});

  __defineProperty(DSL,  "member", function() {});

  __defineProperty(DSL,  "root", function(options) {
    return this.match('/', _.extend({
      as: "root"
    }, options));
  });

  __defineProperty(DSL,  "_extractOptions", function() {
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
      ip: options.ip
    });
    return options;
  });

  __defineProperty(DSL,  "_extractFormat", function(options) {});

  __defineProperty(DSL,  "_extractName", function(options) {
    return options.as || options.name;
  });

  __defineProperty(DSL,  "_extractConstraints", function(options) {
    return _.extend(this._scope.constraints || {}, options.constraints || {});
  });

  __defineProperty(DSL,  "_extractDefaults", function(options) {
    return options.defaults || {};
  });

  __defineProperty(DSL,  "_extractPath", function(options) {
    return "" + options.path + ".:format?";
  });

  __defineProperty(DSL,  "_extractRequestMethod", function(options) {
    return options.method || options.via || "GET";
  });

  __defineProperty(DSL,  "_extractAnchor", function(options) {
    return options.anchor;
  });

  __defineProperty(DSL,  "_extractController", function(options) {
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
    controller = Tower.Support.String.camelize(controller).replace(/(?:[cC]ontroller)?$/, "Controller");
    return {
      name: controller,
      action: action,
      className: controller
    };
  });

  return DSL;

})();

module.exports = Tower.Route.DSL;
