
Tower.Store.MongoDB.Serialization = {
  serializeAttributesForUpdate: function(attributes) {
    var key, operator, result, schema, value, _key, _value;
    result = {};
    schema = this.schema();
    for (key in attributes) {
      value = attributes[key];
      operator = this.constructor.atomicModifiers[key];
      if (operator) {
        key = operator;
        result[key] || (result[key] = {});
        for (_key in value) {
          _value = value[_key];
          result[key][_key] = this.encode(schema[_key], _value);
        }
      } else {
        result["$set"] || (result["$set"] = {});
        result["$set"][key] = this.encode(schema[key], value);
      }
    }
    return result;
  },
  serializeAttributesForCreate: function(attributes) {
    var key, operator, result, schema, value;
    result = {};
    schema = this.schema();
    for (key in attributes) {
      value = attributes[key];
      operator = this.constructor.atomicModifiers[key];
      if (!operator) result[key] = this.encode(schema[key], value);
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
  serializeQuery: function(query) {
    var field, key, operator, result, schema, value, _key, _value;
    schema = this.schema();
    result = {};
    for (key in query) {
      value = query[key];
      field = schema[key];
      if (key === "id") key = "_id";
      if (Tower.Support.Object.isHash(value)) {
        result[key] = {};
        for (_key in value) {
          _value = value[_key];
          operator = this.constructor.queryOperators[_key];
          if (operator) _key = operator;
          result[key][_key] = this.encode(field, _value, _key);
        }
      } else {
        result[key] = this.encode(field, value);
      }
    }
    return result;
  },
  serializeOptions: function(options) {
    if (options == null) options = {};
    return options;
  },
  encode: function(field, value, operation) {
    var method;
    if (!field) return value;
    method = this["encode" + field.type];
    if (method) value = method.call(this, value);
    if (operation === "$in" && !Tower.Support.Object.isArray(value)) {
      value = [value];
    }
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
    return value.toString();
  },
  encodeOrder: function(value) {},
  encodeDate: function(value) {
    var time;
    time = require('moment');
    switch (typeof value) {
      case "string":
        return time.parse(value);
      case DateTime:
        return time.local(value.year, value.month, value.day, value.hour, value.min, value.sec);
      case Date:
        return time.local(value.year, value.month, value.day);
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
  encodeArray: function(value) {
    if (!(value === null || Tower.Support.Object.isArray(value))) {
      throw new Error("Value is not Array");
    }
    return value;
  },
  encodeFloat: function(value) {
    if (Tower.Support.Object.isBlank(value)) return null;
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
          id = this.constructor.database.bson_serializer.ObjectID(value.toString());
          result[i] = id;
        } catch (error) {
          id;
        }
      }
      return result;
    } else {
      return this.constructor.database.bson_serializer.ObjectID(value.toString());
    }
  },
  decodeId: function(value) {
    return value.toString();
  }
};

module.exports = Tower.Store.MongoDB.Serialization;
