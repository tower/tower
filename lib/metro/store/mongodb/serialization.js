
  Metro.Store.MongoDB.Serialization = {
    _serializeAttributes: function(attributes) {
      var key, set, value;
      set = {};
      for (key in attributes) {
        value = attributes[key];
        if (this._atomicOperator(key)) {
          attributes[key] = this._serializeAttributes(value);
        } else {
          set[key] = this._serializeAttribute(key, value);
        }
      }
      attributes["$set"] = Metro.Support.Object.extend(attributes["$set"], set);
      return attributes;
    },
    _serializeAttribute: function(key, value) {
      switch (this.owner.attributeType(key)) {
        case "string":
          return value.toString();
        case "integer":
          return parseInt(value);
        case "float":
          return parseFloat(value);
        case "date":
        case "time":
          return value;
        case "array":
          return value;
        case "id":
          return this.serializeId(value);
        default:
          return value;
      }
    },
    _serializeAssociation: function() {},
    serializeId: function(value) {
      return this.constructor.database.bson_serializer.ObjectID(value.toString());
    },
    deserializeId: function(value) {
      return value.toString();
    },
    serializeDate: function(value) {
      return value;
    },
    deserializeDate: function(value) {
      return value;
    },
    serializeArray: function(value) {},
    deserializeArray: function(value) {},
    serializeQueryAttributes: function(query) {
      var key, result, schema, value;
      result = {};
      schema = this.schema();
      for (key in query) {
        value = query[key];
        result[key] = this.serializeQueryAttribute(key, value, schema);
      }
      return result;
    },
    serializeQueryAttribute: function(key, value, schema) {
      var encoder, item, _key, _results, _value;
      if (schema[key]) encoder = this["encode" + schema[key].type];
      if (encoder) {
        if (typeof value === "object") {
          _results = [];
          for (_key in value) {
            _value = value[_key];
            if (this.arrayOperator(_key)) {
              _results.push((function() {
                var _i, _len, _results2;
                _results2 = [];
                for (_i = 0, _len = _value.length; _i < _len; _i++) {
                  item = _value[_i];
                  _results2.push(encoder);
                }
                return _results2;
              })());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      } else {
        return value;
      }
    },
    encodeString: function(value) {},
    decodeString: function(value) {},
    encodeOrder: function(value) {},
    decodeOrder: function(value) {},
    encodeDate: function(value) {},
    decodeDate: function(value) {}
  };

  module.exports = Metro.Store.MongoDB.Serialization;
