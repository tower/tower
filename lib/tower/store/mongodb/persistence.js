
Tower.Store.MongoDB.Persistence = {
  create: function(attributes, options, callback) {
    var record, self;
    self = this;
    record = this.serializeModel(attributes);
    attributes = this.serializeAttributesForCreate(attributes);
    options = this.serializeOptions(options);
    this.collection().insert(attributes, options, function(error, docs) {
      var doc;
      doc = docs[0];
      record.id = doc["_id"];
      if (callback) return callback.call(this, error, record);
    });
    record.id = attributes["_id"];
    return record;
  },
  update: function(updates, query, options, callback) {
    updates = this.serializeAttributesForUpdate(updates);
    query = this.serializeQuery(query);
    options = this.serializeOptions(options);
    if (!options.hasOwnProperty("safe")) options.safe = true;
    if (!options.hasOwnProperty("upsert")) options.upsert = false;
    this.collection().update(query, updates, options, function(error) {
      if (callback) return callback.call(this, error);
    });
    return this;
  },
  "delete": function(query, options, callback) {
    query = this.serializeQuery(query);
    options = this.serializeOptions(options);
    this.collection().remove(query, options, function(error) {
      if (callback) return callback.call(this, error);
    });
    return this;
  },
  load: function(array) {
    var record, records, _i, _len;
    array = Tower.Support.Object.toArray(array);
    records = this.records;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      record = array[_i];
      record = record instanceof Tower.Model ? record : this.build(record);
      records[record.id] = record;
    }
    return records;
  }
};

module.exports = Tower.Store.MongoDB.Persistence;
