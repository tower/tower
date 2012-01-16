
Tower.Controller.Responder = (function() {

  Responder.respond = function(controller, options, callback) {
    var responder;
    responder = new this(controller, options);
    return responder.respond(callback);
  };

  function Responder(controller, options) {
    var format, _fn, _i, _len, _ref;
    var _this = this;
    if (options == null) options = {};
    this.controller = controller;
    this.options = options;
    _ref = this.controller.formats;
    _fn = function(format) {
      return _this[format] = function(callback) {
        return this["_" + format] = callback;
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      format = _ref[_i];
      _fn(format);
    }
  }

  Responder.prototype.respond = function(callback) {
    var method;
    if (callback) callback.call(this.controller, this);
    method = "_" + this.controller.format;
    method = this[method];
    if (method) {
      return method();
    } else {
      return this.toFormat();
    }
  };

  Responder.prototype.html = function() {
    try {
      return this.defaultRender();
    } catch (error) {
      return this._navigationBehavior(error);
    }
  };

  Responder.prototype.json = function() {
    return this.defaultRender();
  };

  Responder.prototype.toFormat = function() {
    try {
      if ((typeof get !== "undefined" && get !== null) || !(typeof hasErrors !== "undefined" && hasErrors !== null)) {
        return this.defaultRender();
      } else {
        return this.displayErrors();
      }
    } catch (error) {
      return this._apiBehavior(error);
    }
  };

  Responder.prototype._navigationBehavior = function(error) {
    if (typeof get !== "undefined" && get !== null) {
      return raise(error);
    } else if ((typeof hasErrors !== "undefined" && hasErrors !== null) && defaultAction) {
      return this.render({
        action: this.defaultAction
      });
    } else {
      return this.redirectTo(this.navigationLocation);
    }
  };

  Responder.prototype._apiBehavior = function(error) {
    if (typeof resourceful === "undefined" || resourceful === null) raise(error);
    if (typeof get !== "undefined" && get !== null) {
      return this.display(resource);
    } else if (typeof post !== "undefined" && post !== null) {
      return this.display(resource, {
        status: "created",
        location: this.apiLocation
      });
    } else {
      return this.head("noContent");
    }
  };

  Responder.prototype.isResourceful = function() {
    return this.resource.hasOwnProperty("to" + (this.format.toUpperCase()));
  };

  Responder.prototype.resourceLocation = function() {
    return this.options.location || this.resources;
  };

  Responder.prototype.defaultRender = function() {
    return this.defaultResponse.call(options);
  };

  Responder.prototype.display = function(resource, givenOptions) {
    if (givenOptions == null) givenOptions = {};
    return this.controller.render(_.extend(givenOptions, options, {
      format: resource
    }));
  };

  Responder.prototype.displayErrors = function() {
    return this.controller.render({
      format: this.resourceErrors,
      status: "unprocessableEntity"
    });
  };

  Responder.prototype.hasErrors = function() {
    var _base;
    return (typeof (_base = this.resource).respondTo === "function" ? _base.respondTo("errors") : void 0) && !(this.resource.errors.empty != null);
  };

  Responder.prototype.defaultAction = function() {
    return this.action || (this.action = ACTIONS_FOR_VERBS[request.requestMethodSymbol]);
  };

  Responder.prototype.resourceErrors = function() {
    if (this.hasOwnProperty("" + format + "ResourceErrors")) {
      return this["" + format + "RresourceErrors"];
    } else {
      return this.resource.errors;
    }
  };

  Responder.prototype.jsonResourceErrors = function() {
    return {
      errors: this.resource.errors
    };
  };

  return Responder;

})();

module.exports = Tower.Controller.Responder;
