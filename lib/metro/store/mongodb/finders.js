
  Metro.Store.MongoDB.Finders = {
    findOne: function(query, options, callback) {
      var self;
      self = this;
      query = this.serializeQuery(query);
      options.limit = 1;
      options = this.serializeOptions(options);
      this.collection().findOne(query, function(error, doc) {
        if (!(error || !doc)) doc = self.serializeModel(doc);
        if (callback) return callback.call(this, error, doc);
      });
      return this;
    },
    serializeModel: function(attributes) {
      var klass;
      klass = Metro.constant(this.className);
      attributes.id || (attributes.id = attributes._id);
      delete attributes._id;
      return new klass(attributes);
    },
    all: function(query, options, callback) {
      var self;
      self = this;
      query = this.serializeQuery(query);
      options = this.serializeOptions(options);
      this.collection().find(query, options).toArray(function(error, docs) {
        var doc, _i, _len;
        if (!error) {
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            doc = docs[_i];
            doc.id = doc["_id"];
            delete doc["_id"];
          }
          docs = self.serialize(docs);
        }
        if (callback) return callback.call(this, error, docs);
      });
      return this;
    },
    count: function(query, options, callback) {
      this.collection().count(query, options, function(error, result) {
        if (callback) return callback.call(this, error, result);
      });
      return this;
    }
  };

  module.exports = Metro.Store.MongoDB.Finders;
