
  Metro.Store.MongoDB.Persistence = {
    create: function(attributes, options, callback) {
      var record, self;
      self = this;
      record = this.serialize(attributes);
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
    updateAll: function(updates, query, options, callback) {
      updates = this.serializeAttributesForUpdate(updates);
      query = this.serializeQuery(query);
      options = this.serializeOptions(options);
      if (!options.hasOwnProperty("safe")) options.safe = false;
      if (!options.hasOwnProperty("upsert")) options.upsert = false;
      this.collection().update(query, updates, options, function(error, docs) {
        if (error) throw error;
        if (callback) return callback.call(this, error, docs);
      });
      return this;
    },
    deleteAll: function(query, options, callback) {
      query = this.serializeQuery(query);
      options = this.serializeOptions(options);
      this.collection().remove(query, options, function(error) {
        if (callback) return callback.call(this, error);
      });
      return this;
    }
  };

  module.exports = Metro.Store.MongoDB.Persistence;
