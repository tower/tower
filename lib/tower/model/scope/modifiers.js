
Tower.Model.Scope.Modifiers = {
  ClassMethods: {
    atomicModifiers: {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll",
      "$inc": "$inc",
      "$pop": "$pop"
    }
  },
  push: function(record, updates, all) {
    var attributes, changes, key, oldValue, schema, value;
    attributes = record.attributes;
    schema = record.constructor.schema();
    changes = record.changes;
    for (key in updates) {
      value = updates[key];
      oldValue = attributes[key];
      attributes[key] || (attributes[key] = []);
      if (all && _.isArray(value)) {
        attributes[key] = attributes[key].concat(value);
      } else {
        attributes[key].push(value);
      }
      this.changeAttribute(changes, key, oldValue, attributes[key]);
    }
    return changes;
  },
  changeAttribute: function(changes, key, oldValue, newValue) {
    if (!changes[key]) {
      changes[key] = [oldValue, newValue];
    } else {
      changes[key][1] = newValue;
    }
    if (changes[key][0] === changes[key][1]) delete changes[key];
    return changes;
  },
  pushAll: function(record, updates) {
    return this.push(record, updates, true);
  },
  pull: function(record, updates, all) {
    var attributeValue, attributes, changes, item, key, oldValue, schema, value, _i, _len;
    attributes = record.attributes;
    schema = record.constructor.schema();
    changes = record.changes;
    for (key in updates) {
      value = updates[key];
      attributeValue = attributes[key];
      oldValue = void 0;
      if (attributeValue && _.isArray(attributeValue)) {
        oldValue = attributeValue.concat();
        if (all && _.isArray(value)) {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            attributeValue.splice(_attributeValue.indexOf(item), 1);
          }
        } else {
          attributeValue.splice(_attributeValue.indexOf(value), 1);
        }
      }
      this.changeAttribute(changes, key, oldValue, attributeValue);
    }
    return changes;
  },
  pullAll: function(record, updates) {
    return this.pull(record, updates, true);
  },
  inc: function(record, updates) {
    var attributes, changes, key, oldValue, schema, value;
    attributes = record.attributes;
    schema = record.constructor.schema();
    changes = record.changes;
    for (key in updates) {
      value = updates[key];
      oldValue = attributes[key];
      attributes[key] || (attributes[key] = 0);
      attributes[key] += value;
      this.changeAttribute(changes, key, oldValue, attributes[key]);
    }
    return attributes;
  },
  set: function(record, updates) {
    var attributes, changes, field, key, oldValue, schema, value;
    attributes = record.attributes;
    schema = record.constructor.schema();
    changes = record.changes;
    for (key in updates) {
      value = updates[key];
      field = schema[key];
      oldValue = attributes[key];
      if (field && field.type === "Array" && !Tower.Support.Object.isArray(value)) {
        attributes[key] || (attributes[key] = []);
        attributes[key].push(value);
      } else {
        attributes[key] = value;
      }
      this.changeAttribute(changes, key, oldValue, attributes[key]);
    }
    return changes;
  },
  unset: function(record, updates) {
    var attributes, changes, key, oldValue, value;
    attributes = record.attributes;
    changes = record.changes;
    for (key in updates) {
      value = updates[key];
      oldValue = attributes[key];
      attributes[key] = void 0;
      this.changeAttribute(changes, key, oldValue, attributes[key]);
    }
    return changes;
  },
  update: function(record, updates) {
    var key, set, value;
    set = null;
    for (key in updates) {
      value = updates[key];
      if (this.isAtomicModifier(key)) {
        this["" + (key.replace("$", ""))](record, value);
      } else {
        set || (set = {});
        set[key] = value;
      }
    }
    if (set) this.set(record, set);
    return record;
  },
  assignAttributes: function(attributes) {
    var key, value;
    for (key in attributes) {
      value = attributes[key];
      delete this.changes[key];
      this.attributes[key] = value;
    }
    return this;
  },
  resetAttributes: function(keys) {
    var key, _i, _len;
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      this.resetAttributes(key);
    }
    return this;
  },
  resetAttribute: function(key) {
    var array;
    array = this.changes[key];
    if (array) {
      delete this.changes[key];
      this.attributes[key] = array[0];
    }
    return this;
  },
  toUpdates: function(record) {
    var changes, field, key, pop, push, result, schema, value;
    result = {};
    changes = record.changes;
    schema = record.constructor.schema();
    for (key in changes) {
      value = changes[key];
      field = field[key];
      if (field) {
        if (field.type === "Array") {
          pop = _.difference(value[0], value[1]);
          if (pop.length > 0) {
            result.$pop || (result.$pop = {});
            result.$pop[key] = pop;
          }
          push = _.difference(value[1], value[0]);
          if (push.length > 0) {
            result.$push || (result.$push = {});
            result.$push[key] = push;
          }
        } else if (field.type === "Integer") {
          result.$inc || (result.$inc = {});
          result.$inc[key] = (value[1] || 0) - (value[0] || 0);
        }
      } else {
        result[key];
      }
    }
    return result;
  }
};

module.exports = Tower.Model.Scope.Modifiers;
