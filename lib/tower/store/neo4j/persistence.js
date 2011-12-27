
Tower.Store.Neo4j.Persistence = {
  create: function(attributes, options, callback) {
    return this._createNode(attributes, callback);
  },
  updateAll: function(updates, query, options, callback) {
    return this;
  },
  deleteAll: function(query, options, callback) {
    return this;
  },
  _createNode: function(attributes, options, callback) {
    var promise;
    promise = this.database.node(attributes);
    if (callback) {
      promise.then(function(node) {
        return callback.call(this, node);
      });
    }
    return promise;
  },
  _createRelationship: function(from, to, name, attributes, options, callback) {
    var promise;
    promise = this.database.rel(from, name, to, attributes);
    if (callback) {
      promise.then(function(node) {
        return callback.call(this, node);
      });
    }
    return promise;
  }
};

module.exports = Tower.Store.Neo4j.Persistence;
