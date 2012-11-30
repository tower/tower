var _;

_ = Tower._;

Tower.StoreMongodbPersistence = {
  insert: function(cursor, callback) {
    var attributes, options, record,
      _this = this;
    record = this.serializeModel(cursor.data[0], false);
    attributes = this.serializeAttributesForInsert(record);
    options = this.serializeOptions(cursor);
    return this.collection().insert(attributes, options, function(error, docs) {
      var doc;
      doc = docs[0];
      record.set('isNew', !!error);
      record.set('id', doc['_id']);
      if (callback) {
        callback.call(_this, error, record);
      }
      return void 0;
    });
  },
  update: function(updates, cursor, callback) {
    var conditions, options,
      _this = this;
    updates = this.serializeAttributesForUpdate(updates.get('dirtyAttributes'));
    if (_.isBlank(updates)) {
      if (callback) {
        callback.call(this);
      }
      return;
    }
    conditions = this.serializeConditions(cursor);
    options = this.serializeOptions(cursor);
    if (!options.hasOwnProperty('safe')) {
      options.safe = true;
    }
    if (!options.hasOwnProperty('upsert')) {
      options.upsert = false;
    }
    if (!options.hasOwnProperty('multi')) {
      options.multi = true;
    }
    this.collection().update(conditions, updates, options, function(error) {
      if (callback) {
        return callback.call(_this, error);
      }
    });
    return void 0;
  },
  destroy: function(cursor, callback) {
    var conditions, options,
      _this = this;
    conditions = this.serializeConditions(cursor);
    options = this.serializeOptions(cursor);
    this.collection().remove(conditions, options, function(error) {
      if (callback) {
        return callback.call(_this, error);
      }
    });
    return void 0;
  }
};

module.exports = Tower.StoreMongodbPersistence;
