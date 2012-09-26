var _;

_ = Tower._;

Tower.ModelSerialization = {
  toJSON: function(options) {
    return this._serializableHash(options);
  },
  clone: function() {
    var attributes, key, value;
    attributes = _.clone(this.toJSON());
    delete attributes.id;
    for (key in attributes) {
      value = attributes[key];
      if (_.isArray(value)) {
        attributes[key] = value.concat();
      }
    }
    return this.constructor.build(attributes);
  },
  _serializableHash: function(options) {
    var attributeNames, cid, except, fields, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    if (options == null) {
      options = {};
    }
    result = {};
    fields = this.get('fields');
    attributeNames = _.keys(this.constructor.fields());
    if (only = options.only) {
      attributeNames = _.union(_.toArray(only), attributeNames);
    } else if (except = options.except) {
      attributeNames = _.difference(_.toArray(except), attributeNames);
    }
    if (fields && fields.length) {
      fields.push('id');
      attributeNames = _.intersection(attributeNames, fields);
    }
    for (_i = 0, _len = attributeNames.length; _i < _len; _i++) {
      name = attributeNames[_i];
      result[name] = this._readAttributeForSerialization(name);
    }
    cid = this._readAttributeForSerialization('_cid');
    if (cid != null) {
      result._cid = cid;
      if (result.id === cid) {
        delete result.id;
      }
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
      type = 'json';
    }
    return this.get(name);
  }
};

module.exports = Tower.ModelSerialization;
