
Tower.Model.Serialization = {
  ClassMethods: {
    fromJSON: function(data) {
      var i, record, records, _len;
      records = JSON.parse(data);
      if (!(records instanceof Array)) records = [records];
      for (i = 0, _len = records.length; i < _len; i++) {
        record = records[i];
        records[i] = new this(record);
      }
      return records;
    },
    fromForm: function(data) {},
    fromXML: function(data) {},
    toJSON: function(records, options) {
      if (options == null) options = {};
      return JSON.stringify(records);
    }
  },
  toXML: function() {},
  toJSON: function(options) {
    return this._serializableHash(options);
  },
  toObject: function() {
    return this.attributes;
  },
  clone: function() {
    return new this.constructor(Tower.Support.Object.clone(this.attributes));
  },
  _serializableHash: function(options) {
    var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _i, _j, _k, _len, _len2, _len3, _len4;
    if (options == null) options = {};
    result = {};
    attributeNames = Tower.Support.Object.keys(this.attributes);
    if (only = options.only) {
      attributeNames = _.union(Tower.Support.Object.toArray(only), attributeNames);
    } else if (except = options.except) {
      attributeNames = _.difference(Tower.Support.Object.toArray(except), attributeNames);
    }
    for (_i = 0, _len = attributeNames.length; _i < _len; _i++) {
      name = attributeNames[_i];
      result[name] = this._readAttributeForSerialization(name);
    }
    if (methods = options.methods) {
      methodNames = Tower.Support.Object.toArray(methods);
      for (_j = 0, _len2 = methods.length; _j < _len2; _j++) {
        name = methods[_j];
        result[name] = this[name]();
      }
    }
    if (includes = options.include) {
      includes = Tower.Support.Object.toArray(includes);
      for (_k = 0, _len3 = includes.length; _k < _len3; _k++) {
        include = includes[_k];
        if (!Tower.Support.Object.isHash(include)) {
          tmp = {};
          tmp[include] = {};
          include = tmp;
          tmp = void 0;
        }
        for (name in include) {
          opts = include[name];
          records = this[name]().all();
          for (i = 0, _len4 = records.length; i < _len4; i++) {
            record = records[i];
            records[i] = record._serializableHash(opts);
          }
          result[name] = records;
        }
      }
    }
    return result;
  },
  _readAttributeForSerialization: function(name, type) {
    if (type == null) type = "json";
    return this.attributes[name];
  }
};

module.exports = Tower.Model.Serialization;
