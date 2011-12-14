(function() {
  var __slice = Array.prototype.slice;

  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attributes, callback) {
        return this.scoped().create(attributes, callback);
      },
      update: function() {
        var callback, ids, updates, _i, _ref;
        ids = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), updates = arguments[_i++], callback = arguments[_i++];
        return (_ref = this.scoped()).update.apply(_ref, __slice.call(ids).concat([updates], [callback]));
      },
      updateAll: function(updates, query, callback) {
        return this.scoped().updateAll(updates, query, callback);
      },
      destroy: function(query, callback) {
        return this.scoped().destroy(query, callback);
      },
      deleteAll: function() {
        return this.scoped().deleteAll();
      },
      store: function(value) {
        if (!value && this._store) return this._store;
        if (typeof value === "object") {
          this._store || (this._store = new this.defaultStore({
            name: this.collectionName(),
            className: Metro.namespaced(this.name)
          }));
          Metro.Support.Object.extend(this._store, value);
        } else if (value) {
          this._store = value;
        }
        this._store || (this._store = new this.defaultStore({
          name: this.collectionName(),
          className: Metro.namespaced(this.name)
        }));
        return this._store;
      },
      defaultStore: Metro.Store.Memory,
      collectionName: function() {
        return Metro.Support.String.camelize(Metro.Support.String.pluralize(this.name), true);
      },
      resourceName: function() {
        return Metro.Support.String.camelize(this.name, true);
      },
      clone: function(model) {}
    },
    InstanceMethods: {
      isNew: function() {
        return !!!this.attributes.id;
      },
      save: function(callback) {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(this.toUpdates(), callback);
        }
      },
      _update: function(attributes, callback) {
        var _this = this;
        this.constructor.update(this.id, attributes, function(error) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error);
        });
        return this;
      },
      _create: function(callback) {
        var _this = this;
        this.constructor.create(this.attributes, function(error, docs) {
          if (error) throw error;
          _this.changes = {};
          if (callback) return callback.call(_this, error);
        });
        return this;
      },
      updateAttributes: function(attributes, callback) {
        return this._update(attributes, callback);
      },
      "delete": function(callback) {
        var _this = this;
        if (this.isNew()) {
          if (callback) callback.apply(null, this);
        } else {
          this.constructor.destroy({
            id: this.id
          }, function(error) {
            if (!error) delete _this.attributes.id;
            if (callback) return callback.apply(_this, error);
          });
        }
        return this;
      },
      destroy: function(callback) {
        return this["delete"](function(error) {
          if (error) throw error;
          if (callback) return callback.apply(error, this);
        });
      },
      isPersisted: function() {
        return !!this.isNew();
      },
      toObject: function() {
        return this.attributes;
      },
      clone: function() {},
      reset: function() {},
      reload: function() {},
      toggle: function(name) {}
    }
  };

  module.exports = Metro.Model.Persistence;

}).call(this);
