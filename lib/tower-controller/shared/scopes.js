var _;

_ = Tower._;

Tower.ControllerScopes = {
  ClassMethods: {
    scope: function(name, scope) {
      var chain, cursor, instance, metadata, object;
      name || (name = 'all');
      metadata = this.metadata();
      if (!scope) {
        if (typeof name === 'string') {
          chain = Tower.constant(metadata.resourceType);
          if (name !== 'all') {
            if (Tower.isClient) {
              scope = Ember.computed(function() {
                return chain[name]().all().observable();
              });
            } else {
              scope = chain[name]();
            }
          } else {
            if (Tower.isClient) {
              scope = Ember.computed(function() {
                return chain.all().observable();
              });
            } else {
              scope = chain;
            }
          }
        } else {
          scope = name;
          name = 'all';
        }
      } else {
        if (Tower.isClient && typeof scope === 'function') {
          cursor = scope;
          scope = Ember.computed(scope);
        }
      }
      try {
        if (scope.toCursor) {
          scope = scope.toCursor();
        }
        metadata.scopes[name] = scope;
        if (_.indexOf(metadata.scopeNames, name) === -1) {
          metadata.scopeNames.push(name);
        }
        object = {};
        object[name] = scope;
        this.reopen(object);
        if (Tower.isClient) {
          instance = this.instance();
          if (instance && !instance.get(name)) {
            return instance.set(name, cursor());
          }
        }
      } catch (error) {
        return console.log(error.stack || error);
      }
    }
  },
  resolveAgainstCursors: function(action, records, matches, callback) {
    var cursorMethod, cursors, iterator, keys,
      _this = this;
    cursors = this.constructor.metadata().scopes;
    if (!Tower.isClient) {
      matches || (matches = Ember.Map.create());
    }
    keys = _.keys(cursors);
    if (Tower.isClient) {
      cursorMethod = (function() {
        switch (action) {
          case 'create':
          case 'load':
            return 'mergeCreatedRecords';
          case 'update':
            return 'mergeUpdatedRecords';
          case 'destroy':
          case 'unload':
            return 'mergeDeletedRecords';
        }
      })();
    }
    iterator = function(name, next) {
      var cursor;
      if (Tower.isClient) {
        cursor = _this.get(name);
        cursor[cursorMethod](records);
        return next();
      } else {
        cursor = _this.getCursor(cursors[name]);
        cursor.testEach(records, function(success, record) {
          if (success) {
            return matches.set(record.get('id'), record);
          }
        });
        return next();
      }
    };
    Tower.parallel(keys, iterator, callback);
    return matches;
  },
  getCursor: function(object, callback) {
    var _this = this;
    object = (function() {
      switch (typeof object) {
        case 'object':
          return object;
        case 'string':
          return this.constructor.metadata().scopes[object];
      }
    }).call(this);
    if (typeof object === 'function') {
      switch (object.length) {
        case 1:
          object.call(this, function(error, result) {
            object = result;
            if (callback) {
              return callback.call(_this, object);
            }
          });
          break;
        default:
          object = object.call(this);
      }
    }
    if (object && object.toCursor) {
      object = object.toCursor();
    }
    return object;
  }
};

Tower.ControllerScopes.ClassMethods.collection = Tower.ControllerScopes.ClassMethods.scope;

module.exports = Tower.ControllerScopes;
