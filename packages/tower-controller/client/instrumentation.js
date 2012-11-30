
Tower.ControllerInstrumentation = {
  params: Ember.computed(function() {
    return Tower.router.getStateMeta(Tower.router.get('currentState'), 'serialized');
  }).volatile(),
  resource: Ember.computed(function() {
    return Tower.router.getStateMeta(Tower.router.get('currentState'), 'context') || this.get(this.get('resourceName'));
  }).volatile(),
  enter: function() {
    var _this = this;
    return Ember.changeProperties(function() {
      _this.set('isActive', true);
      return _this.set('format', 'html');
    });
  },
  enterAction: function(action) {
    var _this = this;
    return Ember.changeProperties(function() {
      _this.set('action', action);
      _this.set('getFlash', _this.flash());
      return _this.set(_.toStateName(action), true);
    });
  },
  call: function(router, params) {
    var action,
      _this = this;
    if (params == null) {
      params = {};
    }
    router.send('stashContext', params);
    action = this.get('action');
    this.propertyDidChange('resource');
    return this.runCallbacks('action', {
      name: action
    }, function(callback) {
      var method;
      method = _this[action];
      method = (function() {
        switch (typeof method) {
          case 'object':
            return method.enter;
          case 'function':
            return method;
          default:
            return null;
        }
      })();
      if (!method) {
        throw new Error("Action '" + action + "' is not defined properly.");
      }
      return method.call(_this, params, callback);
    });
  },
  exit: function() {
    return this.set('isActive', false);
  },
  exitAction: function(action) {
    var method,
      _this = this;
    Ember.changeProperties(function() {
      return _this.set(Tower._.toStateName(action), false);
    });
    method = this[action];
    if (typeof method === 'object' && method.exit) {
      return method.exit.call(this);
    }
  },
  clear: function() {},
  metadata: function() {
    return this.constructor.metadata();
  }
};
