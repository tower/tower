
  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attributes, callback) {
        return this.store().create(new this(attributes), callback);
      },
      update: function(query, attributes, callback) {
        return this.store().update(query, attributes, callback);
      },
      destroy: function(query, callback) {
        return this.store().destroy(query, callback);
      },
      updateAll: function() {},
      deleteAll: function() {
        return this.store().clear();
      },
      store: function(value) {
        if (value) this._store = value;
        return this._store || (this._store = new Metro.Store.Memory);
      }
    },
    InstanceMethods: {
      isNew: function() {
        return !!!attributes.id;
      },
      save: function(callback) {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(callback);
        }
      },
      _update: function(callback) {
        return this.constructor.update(this.toUpdates(), callback);
      },
      _create: function(callback) {
        return this.constructor.create(this.toUpdates(), callback);
      },
      reset: function() {},
      updateAttribute: function(key, value) {},
      updateAttributes: function(attributes) {
        return this.constructor.update(attributes, callback);
      },
      increment: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      decrement: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      reload: function() {},
      "delete": function() {},
      destroy: function() {},
      isDestroyed: function() {},
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
