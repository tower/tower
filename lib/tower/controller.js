var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Controller = (function(_super) {

  __extends(Controller, _super);

  Controller.include(Tower.Support.Callbacks);

  Controller.extend(Tower.Support.EventEmitter);

  Controller.include(Tower.Support.EventEmitter);

  Controller.instance = function() {
    return this._instance || (this._instance = new this);
  };

  Controller.metadata = function() {
    return this._metadata || (this._metadata = {});
  };

  function Controller() {
    this.constructor._instance = this;
    this.headers = {};
    this.status = 200;
    this.request = null;
    this.response = null;
    this.params = {};
    this.query = {};
    this.resourceName = this.constructor.resourceName();
    this.resourceType = this.constructor.resourceType();
    this.collectionName = this.constructor.collectionName();
    this.formats = _.keys(this.constructor.mimes());
    this.hasParent = this.constructor.hasParent();
  }

  return Controller;

})(Tower.Class);

require('./controller/callbacks');

require('./controller/helpers');

require('./controller/instrumentation');

require('./controller/params');

require('./controller/redirecting');

require('./controller/rendering');

require('./controller/resourceful');

require('./controller/responder');

require('./controller/responding');

Tower.Controller.include(Tower.Controller.Callbacks);

Tower.Controller.include(Tower.Controller.Helpers);

Tower.Controller.include(Tower.Controller.Instrumentation);

Tower.Controller.include(Tower.Controller.Params);

Tower.Controller.include(Tower.Controller.Redirecting);

Tower.Controller.include(Tower.Controller.Rendering);

Tower.Controller.include(Tower.Controller.Resourceful);

Tower.Controller.include(Tower.Controller.Responding);

module.exports = Tower.Controller;
