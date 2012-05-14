
Tower.Store.Neo4j.Persistence = {
  create: function(criteria, callback) {
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
      if (!error) {
        node = _this.serializeModel(node);
      }
      if (callback) {
        callback.call(_this, error, node);
      }
      return node;
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

module.exports = Tower.Store.Neo4j.Persistence;
