
Tower.Store.Mongodb.Persistence = {
  insert: function(criteria, callback) {
    var attributes, options, record,
      _this = this;
    record = this.serializeModel(criteria.data[0], false);
    attributes = this.serializeAttributesForInsert(record);
    options = this.serializeOptions(criteria);
    this.collection().insert(attributes, options, function(error, docs) {
      var doc;
      doc = docs[0];
      record.set('isNew', !!error);
      record.set('id', doc["_id"]);
      if (callback) {
        return callback.call(_this, error, record.attributes);
      }
    });
    return void 0;
  },
  update: function(updates, criteria, callback) {
    var conditions, options,
      _this = this;
    updates = this.serializeAttributesForUpdate(updates.get('changes'));
    conditions = this.serializeConditions(criteria);
    options = this.serializeOptions(criteria);
    if (!options.hasOwnProperty("safe")) {
      options.safe = true;
    }
    if (!options.hasOwnProperty("upsert")) {
      options.upsert = false;
    }
    if (!options.hasOwnProperty("multi")) {
      options.multi = true;
    }
    this.collection().update(conditions, updates, options, function(error) {
      if (callback) {
        return callback.call(_this, error);
      }
    });
    return void 0;
  },
  destroy: function(criteria, callback) {
    var conditions, options,
      _this = this;
    conditions = this.serializeConditions(criteria);
    options = this.serializeOptions(criteria);
    this.collection().remove(conditions, options, function(error) {
      if (callback) {
        return callback.call(_this, error);
      }
    });
    return void 0;
  }
};

module.exports = Tower.Store.Mongodb.Persistence;
