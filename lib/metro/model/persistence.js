
  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attrs) {
        return this.store().create(new this(attrs));
      },
      update: function() {},
      deleteAll: function() {
        return this.store().clear();
      },
      store: function() {
        return this._store || (this._store = new Metro.Store.Memory);
      }
    },
    InstanceMethods: {
      isNew: function() {
        return !!!attributes.id;
      },
      save: function(options) {},
      update: function(options) {},
      reset: function() {},
      updateAttribute: function(name, value) {},
      updateAttributes: function(attributes) {},
      increment: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      decrement: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      reload: function() {},
      "delete": function() {},
      destroy: function() {},
      createOrUpdate: function() {},
      isDestroyed: function() {},
      isPersisted: function() {},
      isDirty: function() {
        return Metro.Support.Object.isPresent(this.changes());
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
