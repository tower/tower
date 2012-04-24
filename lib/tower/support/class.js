var coffeescriptMixin, towerMixin,
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

if (typeof Ember !== 'undefined') {
  coffeescriptMixin = {
    __extend: function(child) {
      var object;
      object = Ember.Object.extend.apply(this);
      object.__name__ = child.name;
      if (this.extended) {
        this.extended.call(object);
      }
      return object;
    },
    __defineStaticProperty: function(key, value) {
      var object;
      object = {};
      object[key] = value;
      this[key] = value;
      return this.reopenClass(object);
    },
    __defineProperty: function(key, value) {
      var object;
      object = {};
      object[key] = value;
      return this.reopen(object);
    }
  };
  Ember.Object.reopenClass(coffeescriptMixin);
  Ember.Namespace.reopenClass(coffeescriptMixin);
  Ember.ArrayProxy.reopenClass(coffeescriptMixin);
  Ember.State.reopenClass(coffeescriptMixin);
  Ember.StateManager.reopenClass(coffeescriptMixin);
  Tower.Class = Ember.Object.extend({
    className: function() {
      return this.constructor.className();
    }
  });
  Tower.Namespace = Ember.Namespace.extend();
  Tower.Collection = Ember.ArrayProxy.extend();
  Tower.State = Ember.State.extend();
  Tower.StateMachine = Ember.StateManager.extend();
  towerMixin = Tower.toMixin();
  Tower.Class.reopenClass(towerMixin);
  Tower.Namespace.reopenClass(towerMixin);
  Tower.Collection.reopenClass(towerMixin);
  Tower.State.reopenClass(towerMixin);
  Tower.StateMachine.reopenClass(towerMixin);
} else {
  Tower.Class = (function() {

    function Class() {}

    return Class;

  })();
  _.extend(Tower.Class, Tower.toMixin());
  Tower.Namespace = (function(_super) {
    var Namespace;

    function Namespace() {
      return Namespace.__super__.constructor.apply(this, arguments);
    }

    Namespace = __extends(Namespace, _super);

    return Namespace;

  })(Tower.Class);
  Tower.Collection = (function(_super) {
    var Collection;

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection = __extends(Collection, _super);

    return Collection;

  })(Tower.Class);
}

module.exports = Tower.Class;
