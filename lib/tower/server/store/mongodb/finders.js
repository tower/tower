
Tower.Store.MongoDB.Finders = {
  find: function(scope, callback) {
    var _this = this;
    scope = this.serializeScope(scope);
    this.transaction(function() {
      return _this.joins(scope, function() {
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
              _this.eagerLoad(scope, docs, callback);
            }
          }
          if (callback) return callback.call(_this, error, docs);
        });
      });
    });
    return;
  },
  findOne: function(scope, callback) {
    var _this = this;
    scope = this.serializeScope(scope);
    scope.criteria.limit(1);
    this.transaction(function() {
      return _this.joins(scope, function() {
        return _this.collection().findOne(scope.criteria.compileConditions(), function(error, doc) {
          if (!(raw || error || !doc)) {
            doc = _this.serializeModel(doc);
            doc.persistent = true;
          }
          if (callback) return callback.call(_this, error, doc);
        });
      });
    });
    return;
  },
  count: function(scope, callback) {
    var _this = this;
    scope = this.serializeScope(scope);
    this.transaction(function() {
      return _this.joins(scope, function() {
        return _this.collection().count(scope.criteria.compileConditions(), function(error, count) {
          if (callback) return callback.call(_this, error, count || 0);
        });
      });
    });
    return;
  },
  exists: function(conditions, options, callback) {
    var _this = this;
    conditions = this.serializeQuery(conditions);
    this.joins(scope, function() {
      return _this.collection().count(scope.criteria.compileConditions(), function(error, exists) {
        if (callback) return callback.call(_this, error, exists);
      });
    });
    return;
  },
  joins: function(scope, callback) {
    var conditions, eagerLoad, options, raw, throughKey, throughScope,
      _this = this;
    if (scope.throughScope) throughScope = scope.throughScope();
    if (!throughScope) return callback.call(this, null);
    throughKey = scope.throughKey;
    eagerLoad = options.eagerLoad;
    raw = options.raw;
    conditions = this.serializeQuery(conditions);
    options = this.serializeOptions(options);
    throughScope.select(throughKey).all(function(error, records) {
      conditions = {};
      conditions._id = {
        $in: _this._mapKey(throughKey, records)
      };
      scope.criteria.where(conditions);
      return callback.call(_this, null);
    });
    return;
  },
  eagerLoad: function(scope, records, callback) {
    var eagerLoad, ids,
      _this = this;
    ids = this._mapKeys('id', records);
    eagerLoad = function(eagerLoadScope, next) {
      var query;
      query = {};
      query[eagerLoadScope.foreignKey] = {
        $in: ids
      };
      return eagerLoadScope.where(query).all(function(error, children) {});
    };
    return Tower.parallel(scope.eagerLoadScopes, eagerLoad, callback);
  }
};

module.exports = Tower.Store.MongoDB.Finders;
