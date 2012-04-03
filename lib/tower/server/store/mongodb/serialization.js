
Tower.Store.MongoDB.Serialization = {
  serializeModel: function(attributes) {
    var klass, model;
    if (attributes instanceof Tower.Model) return attributes;
    klass = Tower.constant(this.className);
    attributes.id || (attributes.id = attributes._id);
    delete attributes._id;
    model = new klass(attributes);
    return model;
  },
  generateId: function() {
    return new this.constructor.database.bson_serializer.ObjectID();
  },
  serializeAttributesForUpdate: function(attributes) {
    var key, operator, result, schema, value, _key, _value;
    result = {};
    schema = this.schema();
    for (key in attributes) {
      value = attributes[key];
      if (key === "id" && value === void 0 || value === null) continue;
      operator = this.constructor.atomicModifiers[key];
      if (operator) {
        key = operator;
        result[key] || (result[key] = {});
        for (_key in value) {
          _value = value[_key];
          result[key][_key] = this.encode(schema[_key], _value, operator);
        }
      } else {
        result["$set"] || (result["$set"] = {});
        result["$set"][key] = this.encode(schema[key], value);
      }
    }
    return result;
  },
  serializeAttributesForCreate: function(record) {
    var attributes, key, operator, realKey, result, schema, value;
    result = {};
    schema = this.schema();
    attributes = this.deserializeModel(record);
    for (key in attributes) {
      value = attributes[key];
      if (key === "id" && value === void 0 || value === null) continue;
      realKey = key === "id" ? "_id" : key;
      operator = this.constructor.atomicModifiers[key];
      if (!operator) result[realKey] = this.encode(schema[key], value);
    }
    return result;
  },
  deserializeAttributes: function(attributes) {
    var field, key, schema, value;
    schema = this.schema();
    for (key in attributes) {
      value = attributes[key];
      field = schema[key];
      if (field) attributes[key] = this.decode(field, value);
    }
    return attributes;
  },
  serializeConditions: function(criteria) {
    var field, key, operator, query, result, schema, value, _key, _value;
    schema = this.schema();
    result = {};
    query = this.deserializeModel(criteria.conditions());
    for (key in query) {
      value = query[key];
      field = schema[key];
      if (key === "id") key = "_id";
      if (_.isRegExp(value)) {
        result[key] = value;
      } else if (_.isHash(value)) {
        result[key] = {};
        for (_key in value) {
          _value = value[_key];
          operator = this.constructor.queryOperators[_key];
          if (operator === "$eq") {
            result[key] = this.encode(field, _value, _key);
          } else {
            if (operator) _key = operator;
            if (_key === "$in") _value = _.castArray(_value);
            result[key][_key] = this.encode(field, _value, _key);
          }
        }
      } else {
        result[key] = this.encode(field, value);
      }
    }
    return result;
  },
  serializeOptions: function(criteria) {
    var limit, offset, options, sort;
    limit = criteria.get('limit');
    sort = criteria.get('order');
    offset = criteria.get('offset');
    options = {};
    if (limit) options.limit = limit;
    if (sort.length) options.sort = sort;
    if (offset) options.skip = offset;
    return options;
  },
  encode: function(field, value, operation) {
    var method;
    if (!field) return value;
    method = this["encode" + field.encodingType];
    if (method) value = method.call(this, value, operation);
    if (operation === "$in" && !_.isArray(value)) value = [value];
    return value;
  },
  decode: function(field, value, operation) {
    var method;
    if (!field) return value;
    method = this["decode" + field.type];
    if (method) value = method.call(this, value);
    return value;
  },
  encodeString: function(value) {
    if (value) {
      return value.toString();
    } else {
      return value;
    }
  },
  encodeOrder: function(value) {},
  encodeDate: function(value) {
    var time;
    time = require('moment');
    switch (typeof value) {
      case "string":
        return time.parse(value);
      case Date:
        return time.local(value.year, value.month, value.day, value.hour, value.min, value.sec);
      case Array:
        return time.local(value);
      default:
        return value;
    }
  },
  decodeDate: function(value) {
    return value;
  },
  encodeBoolean: function(value) {
    if (this.constructor.booleans.hasOwnProperty(value)) {
      return this.constructor.booleans[value];
    } else {
      throw new Error("" + (value.toString()) + " is not a boolean");
    }
  },
  encodeArray: function(value, operation) {
    if (!(operation || value === null || _.isArray(value))) {
      throw new Error("Value is not Array");
    }
    return value;
  },
  encodeFloat: function(value) {
    if (_.isBlank(value)) return null;
    try {
      return parseFloat(value);
    } catch (error) {
      return value;
    }
  },
  encodeInteger: function(value) {
    if (!value && value !== 0) return null;
    if (value.toString().match(/(^[-+]?[0-9]+$)|(\.0+)$/)) {
      return parseInt(value);
    } else {
      return parseFloat(value);
    }
  },
  encodeLocalized: function(value) {
    var object;
    object = {};
    return object[I18n.locale] = value.toString();
  },
  decodeLocalized: function(value) {
    return value[I18n.locale];
  },
  encodeNilClass: function(value) {
    return null;
  },
  decodeNilClass: function(value) {
    return null;
  },
  encodeId: function(value) {
    var i, id, item, result, _len;
    if (!value) return value;
    if (_.isArray(value)) {
      result = [];
      for (i = 0, _len = value.length; i < _len; i++) {
        item = value[i];
        try {
          id = this._encodeId(item);
          result[i] = id;
        } catch (error) {
          id;
        }
      }
      return result;
    } else {
      return this._encodeId(value);
    }
  },
  _encodeId: function(value) {
    try {
      return this.constructor.database.bson_serializer.ObjectID(value.toString());
    } catch (error) {
      return value;
    }
  },
  decodeId: function(value) {
    return value.toString();
  }
};

module.exports = Tower.Store.MongoDB.Serialization;
