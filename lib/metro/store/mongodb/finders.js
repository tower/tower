
  Metro.Store.MongoDB.Finders = {
    findOne: function(query, options, callback) {
      options.limit = 1;
      this.collection().findOne(this._translateQuery(query), options, function(error, doc) {
        if (!error) doc = self.serializeAttributes(doc);
        return callback.call(this, error, doc);
      });
      return this;
    },
    all: function(query, options, callback) {
      var self;
      self = this;
      this.collection().find(this._translateQuery(query), options).toArray(function(error, docs) {
        var doc, _i, _len;
        if (!error) {
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            doc = docs[_i];
            doc.id = doc["_id"];
            delete doc["_id"];
          }
          docs = self.serialize(docs);
        }
        return callback.call(this, error, docs);
      });
      return this;
    },
    length: function(query, callback) {
      this.collection().count(function(error, result) {
        return callback.call(this, error, result);
      });
      return this;
    },
    count: this.length
  };

  module.exports = Metro.Store.MongoDB.Finders;
