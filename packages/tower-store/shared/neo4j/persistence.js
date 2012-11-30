
Tower.StoreNeo4jPersistence = {
  insert: function(criteria, callback) {
    if (criteria.relationship) {
      return this._createRelationship(criteria, callback);
    } else {
      return this._createNode(criteria, callback);
    }
  },
  _createNode: function(criteria, callback) {
    var attributes,
      _this = this;
    attributes = criteria.data[0];
    this.database().node(attributes, function(error, node) {
      var record;
      if (!error) {
        record = _this.serializeModel(node);
        record.set('isNew', !!error);
        console.log(node.getId());
        record.set('id', node.getId());
      }
      if (callback) {
        return callback.call(_this, error, record);
      }
    });
    return void 0;
  },
  _createRelationship: function(criteria, callback) {
    var attributes,
      _this = this;
    attributes = criteria.data[0];
    return this.database().relationship(attributes, function(error, relationship) {
      if (!error) {
        relationship = _this.serializeModel(relationship);
      }
      if (callback) {
        callback.call(_this, error, relationship);
      }
      return relationship;
    });
  },
  update: function(criteria, callback) {},
  destroy: function(criteria, callback) {}
};

module.exports = Tower.StoreNeo4jPersistence;
