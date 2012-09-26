var _,
  __slice = [].slice;

Ember.Map.prototype.toArray = function() {
  return Tower._.values(this.values);
};

_ = global._;

_.extend(Tower, {
  nativeExtensions: true,
  env: "development",
  port: 3000,
  client: typeof window !== "undefined",
  isClient: typeof window !== "undefined",
  isServer: typeof window === "undefined",
  root: "/",
  publicPath: "/",
  "case": "camelcase",
  accessors: typeof window === "undefined",
  logger: typeof _console !== 'undefined' ? _console : console,
  structure: "standard",
  config: {},
  namespaces: {},
  metadata: {},
  tryRequire: function(paths) {
    var path, _i, _len;
    paths = _.flatten(paths);
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      try {
        return require(path);
      } catch (error) {
        this;

      }
    }
  },
  _: _,
  subscribe: function() {
    var _ref;
    return (_ref = Tower.Application.instance()).subscribe.apply(_ref, arguments);
  },
  cb: function() {},
  notifyConnections: function(action, records, callback) {
    var connection, sessionId, _ref, _results;
    _ref = Tower.connections;
    _results = [];
    for (sessionId in _ref) {
      connection = _ref[sessionId];
      _results.push(connection.notify(action, records, callback));
    }
    return _results;
  },
  connections: {},
  createConnection: function(socket) {
    var connection;
    connection = Tower.NetConnection.create().setProperties({
      socket: socket
    });
    return this.connections[connection.toString()] = connection;
  },
  bench: function(name, block) {
    var endDate, result, startDate,
      _this = this;
    if (typeof name === 'function') {
      block = name;
      name = null;
    }
    if (block.length) {
      startDate = new Date();
      return block(function(result) {
        var endDate;
        endDate = new Date();
        console.log(name, String(endDate - startDate) + 'ms');
        return result;
      });
    } else {
      startDate = new Date();
      result = block();
      endDate = new Date();
      console.log(name, String(endDate - startDate) + 'ms');
      return result;
    }
  },
  toMixin: function() {
    return {
      include: function() {
        return Tower.include.apply(Tower, [this].concat(__slice.call(arguments)));
      },
      className: function() {
        return Tower._.functionName(this);
      },
      build: function(attributes) {
        var object;
        object = this.create();
        if (attributes) {
          object.setProperties(attributes);
        }
        return object;
      },
      computed: function(key, block) {
        var object;
        object = {};
        object[key] = Ember.computed(block);
        return this.reopen(object);
      },
      get: function(key) {
        return Ember.get(this, key);
      },
      set: function(key, value) {
        return Ember.set(this, key, value);
      }
    };
  },
  cursors: {},
  addCursor: function(cursor) {
    var cursors, fieldName, fieldNames, type, types, _i, _j, _len, _len1;
    types = Ember.get(cursor, 'observableTypes');
    Tower.cursors[Ember.guidFor(cursor)] = cursor;
    for (_i = 0, _len = types.length; _i < _len; _i++) {
      type = types[_i];
      cursors = Tower.cursors[type];
      if (!cursors) {
        cursors = Tower.cursors[type] = {};
      }
      fieldNames = Ember.get(cursor, 'observableFields');
      for (_j = 0, _len1 = fieldNames.length; _j < _len1; _j++) {
        fieldName = fieldNames[_j];
        cursors[fieldName] = cursor;
      }
    }
    return cursor;
  },
  removeCursor: function(cursor) {
    var cursors, fieldName, fieldNames, type, types, _i, _j, _len, _len1;
    types = Ember.get(cursor, 'observableTypes');
    delete Tower.cursors[Ember.guidFor(cursor)];
    for (_i = 0, _len = types.length; _i < _len; _i++) {
      type = types[_i];
      cursors = Tower.cursors[type];
      if (cursors) {
        fieldNames = Ember.get(cursor, 'observableFields');
        for (_j = 0, _len1 = fieldNames.length; _j < _len1; _j++) {
          fieldName = fieldNames[_j];
          delete cursors[fieldName];
        }
      }
    }
    return cursor;
  },
  getCursor: function(path) {
    return Ember.get(Tower.cursors, path);
  },
  notifyCursorFromPath: function(path) {
    var cursor;
    cursor = Tower.getCursor(path);
    if (cursor) {
      cursor.refresh();
    }
    delete Tower.cursorsToUpdate[path];
    return cursor;
  },
  autoNotifyCursors: true,
  cursorsToUpdate: {},
  cursorNotification: function(path) {
    Tower.cursorsToUpdate[path] = true;
    if (Tower.autoNotifyCursors) {
      return Ember.run.schedule('sync', this, this.notifyCursors);
    }
  },
  notifyCursors: function(force) {
    var cursor, cursors, guid, path, paths, _results;
    cursors = {};
    paths = _.keys(force ? Tower.cursors : Tower.cursorsToUpdate);
    for (path in paths) {
      cursor = Tower.getCursor(path);
      if (cursor) {
        cursors[Ember.guidFor(cursor)] = cursor;
      }
    }
    Tower.cursorsToUpdate = {};
    _results = [];
    for (guid in cursors) {
      cursor = cursors[guid];
      _results.push(cursor.refresh());
    }
    return _results;
  },
  include: function(self, object) {
    var ClassMethods, InstanceMethods, included;
    included = object.included;
    ClassMethods = object.ClassMethods;
    InstanceMethods = object.InstanceMethods;
    delete object.included;
    delete object.ClassMethods;
    delete object.InstanceMethods;
    if (ClassMethods) {
      self.reopenClass(ClassMethods);
    }
    if (InstanceMethods) {
      self.include(InstanceMethods);
    }
    self.reopen(object);
    object.InstanceMethods = InstanceMethods;
    object.ClassMethods = ClassMethods;
    if (included) {
      included.apply(self);
    }
    return object;
  },
  metadataFor: function(name) {
    var _base;
    return (_base = this.metadata)[name] || (_base[name] = {});
  },
  callback: function() {
    var _ref;
    return (_ref = Tower.Application).callback.apply(_ref, arguments);
  },
  runCallbacks: function() {
    var _ref;
    return (_ref = Tower.Application.instance()).runCallbacks.apply(_ref, arguments);
  },
  raise: function() {
    throw new Error(Tower.t.apply(Tower, arguments));
  },
  t: function() {
    var _ref;
    return (_ref = Tower.SupportI18n).translate.apply(_ref, arguments);
  },
  l: function() {
    var _ref;
    return (_ref = Tower.SupportI18n).localize.apply(_ref, arguments);
  },
  stringify: function() {
    var string;
    string = Tower._.args(arguments).join("_");
    switch (Tower["case"]) {
      case "snakecase":
        return _.underscore(string);
      default:
        return _.camelize(string);
    }
  },
  namespace: function() {
    return Tower.Application.instance().toString();
  },
  modules: {},
  module: function(name) {
    var _base;
    return (_base = Tower.modules)[name] || (_base[name] = Tower._modules[name]());
  },
  constant: function(string) {
    var namespace, node, part, parts, _i, _len;
    node = global;
    parts = string.split(".");
    try {
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        node = node[part];
      }
    } catch (error) {
      node = null;
    }
    if (!node) {
      namespace = Tower.namespace();
      if (namespace && parts[0] !== namespace) {
        node = Tower.constant("" + namespace + "." + string);
      } else {
        throw new Error("Constant '" + string + "' wasn't found");
      }
    }
    return node;
  },
  namespaced: function(string) {
    var namespace;
    namespace = Tower.namespace();
    if (namespace) {
      return "" + namespace + "." + string;
    } else {
      return string;
    }
  },
  async: function(array, iterator, callback) {
    return this.series(array, iterator, callback);
  },
  each: function(array, iterator) {
    var index, item, _i, _len, _results;
    if (array.forEach) {
      return array.forEach(iterator);
    } else {
      _results = [];
      for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
        item = array[index];
        _results.push(iterator(item, index, array));
      }
      return _results;
    }
  },
  series: function(array, iterator, callback) {
    var completed, iterate;
    if (callback == null) {
      callback = function() {};
    }
    if (!array.length) {
      return callback();
    }
    completed = 0;
    iterate = function() {
      return iterator(array[completed], function(error) {
        if (error) {
          callback(error);
          return callback = function() {};
        } else {
          completed += 1;
          if (completed === array.length) {
            return callback();
          } else {
            return iterate();
          }
        }
      });
    };
    return iterate();
  },
  parallel: function(array, iterator, callback) {
    var completed, iterate;
    if (callback == null) {
      callback = function() {};
    }
    if (!array.length) {
      return callback();
    }
    completed = 0;
    iterate = function() {};
    return Tower.each(array, function(x) {
      return iterator(x, function(error) {
        if (error) {
          callback(error);
          return callback = function() {};
        } else {
          completed += 1;
          if (completed === array.length) {
            return callback();
          }
        }
      });
    });
  },
  callbackChain: function() {
    var callbacks,
      _this = this;
    callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function(error) {
      var callback, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        if (callback) {
          _results.push(callback.call(_this, error));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
  },
  get: function() {
    return Tower.request.apply(Tower, ['get'].concat(__slice.call(arguments)));
  },
  post: function() {
    return Tower.request.apply(Tower, ['post'].concat(__slice.call(arguments)));
  },
  put: function() {
    return Tower.request.apply(Tower, ['put'].concat(__slice.call(arguments)));
  },
  destroy: function() {
    return Tower.request.apply(Tower, ['destroy'].concat(__slice.call(arguments)));
  },
  request: function() {
    var _ref;
    return (_ref = Tower.agent).request.apply(_ref, arguments);
  }
});
