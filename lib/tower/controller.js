var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Controller = (function(_super) {
  var Controller;

  function Controller() {
    return Controller.__super__.constructor.apply(this, arguments);
  }

  Controller = __extends(Controller, _super);

  Controller.include(Tower.Support.Callbacks);

  Controller.extend(Tower.Support.EventEmitter);

  Controller.include(Tower.Support.EventEmitter);

  __defineStaticProperty(Controller,  "instance", function() {
    return this._instance || (this._instance = new this);
  });

  __defineProperty(Controller,  "init", function() {
    var metadata;
    this._super.apply(this, arguments);
    this.constructor._instance = this;
    this.headers = {};
    this.status = 200;
    this.request = null;
    this.response = null;
    this.params = {};
    this.query = {};
    metadata = this.constructor.metadata();
    this.resourceName = metadata.resourceName;
    this.resourceType = metadata.resourceType;
    this.collectionName = metadata.collectionName;
    this.formats = _.keys(metadata.mimes);
    return this.hasParent = this.constructor.hasParent();
  });

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
