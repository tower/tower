
Tower.Store.MongoDB.Finders = {
  serializeModel: function(attributes) {
    var klass, model;
    if (attributes instanceof Tower.Model) return attributes;
    klass = Tower.constant(this.className);
    attributes.id || (attributes.id = attributes._id);
    delete attributes._id;
    model = new klass(attributes);
    return model;
  },
  find: function(criteria, callback) {
    var _this = this;
    this.serializeCriteria(criteria);
    this.joins(criteria, function(error, joinConditions) {
      return _this.collection().find(conditions, options).toArray(function(error, docs) {
        var doc, model, _i, _j, _len, _len2;
        if (!error) {
          if (!raw) {
            for (_i = 0, _len = docs.length; _i < _len; _i++) {
              doc = docs[_i];
              doc.id = doc["_id"];
              delete doc["_id"];
            }
            docs = _this.serialize(docs);
            for (_j = 0, _len2 = docs.length; _j < _len2; _j++) {
              model = docs[_j];
              model.persistent = true;
            }
            _this.eagerLoad(docs, eagerLoad, callback);
          }
        }
        if (callback) return callback.call(_this, error, docs);
      });
    });
    return this;
  },
  joins: function(criteria, callback) {
    var conditions, eagerLoad, options, raw, through,
      _this = this;
    through = options.through;
    eagerLoad = options.eagerLoad;
    raw = options.raw;
    conditions = this.serializeQuery(conditions);
    options = this.serializeOptions(options);
    if (!through) return callback.call(this, null, {});
    through.scope.select(through.key).all(function(error, records) {
      conditions = {};
      conditions._id = {
        $in: _.map(records, function(record) {
          return record.get(through.key);
        })
      };
      return callback.call(_this, null, conditions);
    });
    return this;
  },
  eagerLoad: function(records, eagerLoadScopes, callback) {
    var eagerLoad, ids,
      _this = this;
    ids = _.map(records, function(record) {
      return record.get('id');
    });
    eagerLoad = function(eagerLoadScope, next) {
      var query;
      query = {};
      query[eagerLoadScope.foreignKey] = {
        $in: ids
      };
      return eagerLoadScope.where(query).all(function(error, children) {});
    };
    return Tower.parallel(eagerLoadScopes, eagerLoad, callback);
  },
  findOne: function(conditions, options, callback) {
    var raw,
      _this = this;
    conditions = this.serializeQuery(conditions);
    options.limit = 1;
    raw = options.raw === true;
    options = this.serializeOptions(options);
    this.collection().findOne(conditions, function(error, doc) {
      if (!(raw || error || !doc)) {
        doc = _this.serializeModel(doc);
        doc.persistent = true;
      }
      if (callback) return callback.call(_this, error, doc);
    });
    return this;
  },
  count: function(conditions, options, callback) {
    var result,
      _this = this;
    result = 0;
    conditions = this.serializeQuery(conditions);
    options = this.serializeOptions(options);
    this.collection().count(conditions, function(error, count) {
      result = count || 0;
      if (callback) return callback.call(_this, error, result);
    });
    return result;
  },
  exists: function(conditions, options, callback) {
    var result;
    result = void 0;
    conditions = this.serializeQuery(conditions);
    this.collection().count(conditions, function(error, exists) {
      result = exists;
      if (callback) return callback.call(this, error, result);
    });
    return result;
  },
  through: function(through, callback) {
    var _this = this;
    if (!through) return callback.call(this, null, {});
    return through.scope.select(through.key).all(function(error, records) {
      var conditions;
      conditions = {};
      conditions._id = {
        $in: _.map(records, function(record) {
          return record.get(through.key);
        })
      };
      return callback.call(_this, null, conditions);
    });
  }
};

module.exports = Tower.Store.MongoDB.Finders;
