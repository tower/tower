
Tower.Model.Persistence = {
  ClassMethods: {
    defaultStore: Tower.Store.Memory,
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
    collectionName: function() {
      return Tower.Support.String.camelize(Tower.Support.String.pluralize(this.name), true);
    },
    resourceName: function() {
      return Tower.Support.String.camelize(this.name, true);
    },
    clone: function(model) {},
    create: function(attributes, callback) {
      var record;
      record = new this(attributes);
      record.save(callback);
      return record;
    }
  },
  InstanceMethods: {
    isNew: function() {
      return !!!this.attributes.id;
    },
    save: function(options, callback) {
      if (this.readOnly) throw new Error("Record is readOnly");
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      if (options.validate !== false) {
        if (!this.validate()) {
          if (callback) callback.call(this, null, false);
          return false;
        }
      }
      this.runCallbacks("save", function() {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(this.toUpdates(), callback);
        }
      });
      return true;
    },
    _update: function(attributes, callback) {
      this.runCallbacks("update", function() {
        var _this = this;
        return this.constructor.update(this.id, attributes, function(error) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error, !error);
        });
      });
      return this;
    },
    _create: function(callback) {
      this.runCallbacks("create", function() {
        var _this = this;
        return this.constructor.store().create(this.attributes, function(error, docs) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error, !error);
        });
      });
      return this;
    },
    updateAttributes: function(attributes, callback) {
      return this._update(attributes, callback);
    },
    "delete": function(callback) {
      var _this = this;
      if (this.isNew()) {
        if (callback) callback.call(null, this);
      } else {
        this.constructor.destroy({
          id: this.id
        }, function(error) {
          if (!error) delete _this.attributes.id;
          if (callback) return callback.call(_this, error);
        });
      }
      this.destroyed = true;
      this.freeze();
      return this;
    },
    destroy: function(callback) {
      this.destroyRelations();
      return this["delete"](function(error) {
        if (error) throw error;
        if (callback) return callback.call(error, this);
      });
    },
    freeze: function() {},
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
