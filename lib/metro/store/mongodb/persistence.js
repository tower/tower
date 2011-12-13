(function() {
  var __slice = Array.prototype.slice;

  Metro.Store.MongoDB.Persistence = {
    remove: function(query, callback) {},
    removeAll: function(callback) {
      return this.collection().remove(function(error) {
        if (callback) return callback.call(this, error);
      });
    },
    update: function(query, attributes, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (!options) {
        options = {};
      }
      options.safe = false;
      options.upsert = false;
      this.collection().update(this._translateQuery(query), {
        "$set": attributes
      }, options, function(error, docs) {
        if (error) throw error;
        if (callback) return callback.call(this, error, docs);
      });
      return this;
    },
    destroy: function(query, callback) {
      this.collection().remove(this._translateQuery(query), function(error) {
        if (callback) return callback.call(this, error);
      });
      return this;
    },
    create: function(attributes, query, options, callback) {
      var record, self;
      self = this;
      record = this.serializeAttributes(attributes);
      this.collection().insert(attributes, function(error, docs) {
        var doc;
        doc = docs[0];
        record.id = doc["_id"];
        if (callback) return callback.call(this, error, record);
      });
      record.id = attributes["_id"];
      delete attributes["_id"];
      return record;
    },
    update: function() {
      var callback, ids, options, query, updates, _i, _ref;
      ids = 5 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 4) : (_i = 0, []), updates = arguments[_i++], query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      return (_ref = this.store()).update.apply(_ref, __slice.call(ids).concat([updates], [callback]));
    },
    updateAll: function(updates, query, options, callback) {
      return this.store().updateAll(updates, callback);
    },
    "delete": function() {
      var callback, ids, options, query, _i, _ref;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      return (_ref = this.store())["delete"].apply(_ref, __slice.call(ids).concat([callback]));
    },
    deleteAll: function(query, options, callback) {
      var _ref;
      return (_ref = this.store()).deleteAll.apply(_ref, __slice.call(ids).concat([callback]));
    },
    destroy: function() {
      var callback, ids, options, query, _i, _ref;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      return (_ref = this.store()).destroy.apply(_ref, __slice.call(ids).concat([callback]));
    },
    destroyAll: function(query, options, callback) {
      var _ref;
      return (_ref = this.store()).destroy.apply(_ref, __slice.call(ids).concat([callback]));
    }
  };

  module.exports = Metro.Store.MongoDB.Persistence;

}).call(this);
