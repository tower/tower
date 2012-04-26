
Tower.Model.Serialization = {
  ClassMethods: {
    fromJSON: function(data) {
      var i, record, records, _i, _len;
      records = JSON.parse(data);
      if (!(records instanceof Array)) {
        records = [records];
      }
      for (i = _i = 0, _len = records.length; _i < _len; i = ++_i) {
        record = records[i];
        records[i] = new this(record);
      }
      return records;
    },
    toJSON: function(records, options) {
      var record, result, _i, _len;
      if (options == null) {
        options = {};
      }
      result = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        result.push(record.toJSON());
      }
      return result;
    }
  },
  toJSON: function(options) {
    return this._serializableHash(options);
  },
  clone: function() {
    var attributes;
    attributes = Tower.clone(this.attributes);
    delete attributes.id;
    return new this.constructor(attributes);
  },
  _serializableHash: function(options) {
    var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    if (options == null) {
      options = {};
    }
    result = {};
    attributeNames = _.keys(this.attributes);
    if (only = options.only) {
      attributeNames = _.union(_.toArray(only), attributeNames);
    } else if (except = options.except) {
      attributeNames = _.difference(_.toArray(except), attributeNames);
    }
    for (_i = 0, _len = attributeNames.length; _i < _len; _i++) {
      name = attributeNames[_i];
      result[name] = this._readAttributeForSerialization(name);
    }
    if (methods = options.methods) {
      methodNames = _.toArray(methods);
      for (_j = 0, _len1 = methods.length; _j < _len1; _j++) {
        name = methods[_j];
        result[name] = this[name]();
      }
    }
    if (includes = options.include) {
      includes = _.toArray(includes);
      for (_k = 0, _len2 = includes.length; _k < _len2; _k++) {
        include = includes[_k];
        if (!_.isHash(include)) {
          tmp = {};
          tmp[include] = {};
          include = tmp;
          tmp = void 0;
        }
        for (name in include) {
          opts = include[name];
          records = this[name]().all();
          for (i = _l = 0, _len3 = records.length; _l < _len3; i = ++_l) {
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
    if (type == null) {
      type = "json";
    }
    return this.attributes[name];
  }
};

module.exports = Tower.Model.Serialization;
