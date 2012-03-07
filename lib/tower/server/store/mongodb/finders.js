
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
  find: function(conditions, options, callback) {
    var _this = this;
    conditions = this.serializeQuery(conditions);
    options = this.serializeOptions(options);
    this.collection().find(conditions, options).toArray(function(error, docs) {
      var doc, model, _i, _j, _len, _len2;
      if (!error) {
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
      }
      if (callback) return callback.call(_this, error, docs);
    });
    return this;
  },
  findOne: function(conditions, options, callback) {
    var _this = this;
    conditions = this.serializeQuery(conditions);
    options.limit = 1;
    options = this.serializeOptions(options);
    this.collection().findOne(conditions, function(error, doc) {
      if (!(error || !doc)) {
        doc = _this.serializeModel(doc);
        doc.persistent = true;
      }
      if (callback) return callback.call(_this, error, doc);
    });
    return this;
  },
  count: function(conditions, options, callback) {
    var result;
    var _this = this;
    result = void 0;
    conditions = this.serializeQuery(conditions);
    this.collection().count(conditions, function(error, count) {
      result = count;
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
  }
};

module.exports = Tower.Store.MongoDB.Finders;
