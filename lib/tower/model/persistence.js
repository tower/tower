(function() {
  var __slice = Array.prototype.slice;

  Tower.Model.Persistence = {
    ClassMethods: {
      load: function(array) {
        var item, record, records, _i, _len;
        if (!Tower.Support.Object.isArray(array)) array = [array];
        records = this.store().records;
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          record = item instanceof Tower.Model ? item : new this(item);
          records[record.id] = record;
        }
        return records;
      },
      build: function(attributes) {
        return new this(attributes);
      },
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
            className: Tower.namespaced(this.name)
          }));
          Tower.Support.Object.extend(this._store, value);
        } else if (value) {
          this._store = value;
        }
        this._store || (this._store = new this.defaultStore({
          name: this.collectionName(),
          className: Tower.namespaced(this.name)
        }));
        return this._store;
      },
      defaultStore: Tower.Store.Memory,
      collectionName: function() {
        return Tower.Support.String.camelize(Tower.Support.String.pluralize(this.name), true);
      },
      resourceName: function() {
        return Tower.Support.String.camelize(this.name, true);
      },
      clone: function(model) {}
    },
    InstanceMethods: {
      isNew: function() {
        return !!!this.attributes.id;
      },
      save: function(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        if (options.validate !== false) {
          if (!this.validate()) {
            if (callback) callback.call(this, null, false);
            return false;
          }
        }
        if (this.isNew()) {
          this._create(callback);
        } else {
          this._update(this.toUpdates(), callback);
        }
        return true;
      },
      _update: function(attributes, callback) {
        var _this = this;
        this.constructor.update(this.id, attributes, function(error) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error, !error);
        });
        return this;
      },
      _create: function(callback) {
        var _this = this;
        this.constructor.create(this.attributes, function(error, docs) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error, !error);
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

  module.exports = Tower.Model.Persistence;

}).call(this);
