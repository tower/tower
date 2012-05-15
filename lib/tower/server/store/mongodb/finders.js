
Tower.Store.Mongodb.Finders = {
  find: function(criteria, callback) {
    var conditions, options,
      _this = this;
    conditions = this.serializeConditions(criteria);
    options = this.serializeOptions(criteria);
    this.collection().find(conditions, options).toArray(function(error, docs) {
      var doc, model, _i, _j, _len, _len1;
      if (!error) {
        if (!criteria.raw) {
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            doc = docs[_i];
            doc.id = doc["_id"];
            delete doc["_id"];
          }
          docs = _this.serialize(docs, true);
          for (_j = 0, _len1 = docs.length; _j < _len1; _j++) {
            model = docs[_j];
            model.set('isNew', false);
          }
        }
      }
      if (callback) {
        return callback.call(_this, error, docs);
      }
    });
    return void 0;
  },
  findOne: function(criteria, callback) {
    var conditions,
      _this = this;
    criteria.limit(1);
    conditions = this.serializeConditions(criteria);
    this.collection().findOne(conditions, function(error, doc) {
      if (!(criteria.raw || error || !doc)) {
        doc = _this.serializeModel(doc);
        doc.persistent = true;
      }
      if (callback) {
        return callback.call(_this, error, doc);
      }
    });
    return void 0;
  },
  count: function(criteria, callback) {
    var conditions,
      _this = this;
    conditions = this.serializeConditions(criteria);
    this.collection().count(conditions, function(error, count) {
      if (callback) {
        return callback.call(_this, error, count || 0);
      }
    });
    return void 0;
  },
  exists: function(criteria, callback) {
    var conditions,
      _this = this;
    conditions = this.serializeConditions(criteria);
    this.collection().count(conditions, function(error, count) {
      if (callback) {
        return callback.call(_this, error, count > 0);
      }
    });
    return void 0;
  }
};

module.exports = Tower.Store.Mongodb.Finders;
