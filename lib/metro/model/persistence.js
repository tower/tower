
  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attributes, callback) {
        return this.store().create(attributes, callback);
      },
      update: function(query, attributes, callback) {
        return this.store().update(query, attributes, callback);
      },
      destroy: function(query, callback) {
        return this.store().destroy(query, callback);
      },
      deleteAll: function() {
        return this.store().clear();
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
      }
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
        this.constructor.update({
          id: this.id
        }, attributes, function(error, docs) {
          if (error) throw error;
          _this.changes = {};
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
      reset: function() {},
      updateAttributes: function(attributes, callback) {
        return this._update(attributes, callback);
      },
      increment: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      decrement: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      reload: function() {},
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
      isDirty: function() {
        return Metro.Support.Object.isPresent(this.changes);
      },
      _attributeChange: function(attribute, value) {
        var array, beforeValue, _base;
        array = (_base = this.changes)[attribute] || (_base[attribute] = []);
        beforeValue = array[0] || (array[0] = this.attributes[attribute]);
        array[1] = value;
        if (array[0] === array[1]) array = null;
        if (array) {
          this.changes[attribute] = array;
        } else {
          delete this.changes[attribute];
        }
        return beforeValue;
      }
    }
  };

  module.exports = Metro.Model.Persistence;
