var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Controller.Responder = (function() {

  __defineStaticProperty(Responder,  "respond", function(controller, options, callback) {
    var responder;
    responder = new this(controller, options);
    return responder.respond(callback);
  });

  function Responder(controller, options) {
    var format, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    this.controller = controller;
    this.options = options;
    _ref = this.controller.formats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      format = _ref[_i];
      this.accept(format);
    }
  }

  __defineProperty(Responder,  "accept", function(format) {
    return this[format] = function(callback) {
      return this["_" + format] = callback;
    };
  });

  __defineProperty(Responder,  "respond", function(callback) {
    var method;
    if (callback) {
      callback.call(this.controller, this);
    }
    method = this["_" + this.controller.format];
    if (method) {
      return method.call(this);
    } else {
      return this.toFormat();
    }
  });

  __defineProperty(Responder,  "_html", function() {
    return this.controller.render({
      action: this.controller.action
    });
  });

  __defineProperty(Responder,  "_json", function() {
    return this.controller.render({
      json: this.options.records
    });
  });

  __defineProperty(Responder,  "toFormat", function() {
    try {
      if ((typeof get !== "undefined" && get !== null) || !(typeof hasErrors !== "undefined" && hasErrors !== null)) {
        return this.defaultRender();
      } else {
        return this.displayErrors();
      }
    } catch (error) {
      return this._apiBehavior(error);
    }
  });

  __defineProperty(Responder,  "_navigationBehavior", function(error) {
    if (typeof get !== "undefined" && get !== null) {
      throw error;
    } else if ((typeof hasErrors !== "undefined" && hasErrors !== null) && defaultAction) {
      return this.render({
        action: this.defaultAction
      });
    } else {
      return this.redirectTo(this.navigationLocation);
    }
  });

  __defineProperty(Responder,  "_apiBehavior", function(error) {
    if (typeof get !== "undefined" && get !== null) {
      return this.display(resource);
    } else if (typeof post !== "undefined" && post !== null) {
      return this.display(resource, {
        status: 'created',
        location: this.apiLocation
      });
    } else {
      return this.head('noContent');
    }
  });

  __defineProperty(Responder,  "isResourceful", function() {
    return this.resource.hasOwnProperty("to" + (this.format.toUpperCase()));
  });

  __defineProperty(Responder,  "resourceLocation", function() {
    return this.options.location || this.resources;
  });

  __defineProperty(Responder,  "defaultRender", function() {
    return this.defaultResponse.call(options);
  });

  __defineProperty(Responder,  "display", function(resource, givenOptions) {
    if (givenOptions == null) {
      givenOptions = {};
    }
    return this.controller.render(_.extend(givenOptions, this.options, {
      format: this.resource
    }));
  });

  __defineProperty(Responder,  "displayErrors", function() {
    return this.controller.render({
      format: this.resourceErrors,
      status: 'unprocessableEntity'
    });
  });

  __defineProperty(Responder,  "hasErrors", function() {
    var _base;
    return (typeof (_base = this.resource).respondTo === "function" ? _base.respondTo('errors') : void 0) && !(this.resource.errors.empty != null);
  });

  __defineProperty(Responder,  "defaultAction", function() {
    return this.action || (this.action = ACTIONS_FOR_VERBS[request.requestMethodSymbol]);
  });

  __defineProperty(Responder,  "resourceErrors", function() {
    if (this.hasOwnProperty("" + format + "ResourceErrors")) {
      return this["" + format + "RresourceErrors"];
    } else {
      return this.resource.errors;
    }
  });

  __defineProperty(Responder,  "jsonResourceErrors", function() {
    return {
      errors: this.resource.errors
    };
  });

  return Responder;

})();

module.exports = Tower.Controller.Responder;
