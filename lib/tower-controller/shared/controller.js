var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.Controller = (function(_super) {
  var Controller;

  function Controller() {
    return Controller.__super__.constructor.apply(this, arguments);
  }

  Controller = __extends(Controller, _super);

  Controller.include(Tower.SupportCallbacks);

  Controller.reopenClass(Tower.SupportEventEmitter);

  Controller.include(Tower.SupportEventEmitter);

  Controller.reopenClass({
    instance: function() {
      return this._instance || (this._instance = new this);
    }
  });

  Controller.reopen({
    init: function() {
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
      this.formats = Tower.isClient ? ['html'] : _.keys(metadata.mimes);
      return this.hasParent = this.constructor.hasParent();
    }
  });

  return Controller;

})(Tower.Collection);

module.exports = Tower.Controller;
