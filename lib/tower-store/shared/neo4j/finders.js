
Tower.StoreNeo4jFinders = {
  find: function(criteria, callback) {
    var conditions,
      _this = this;
    conditions = criteria.conditions();
    this.database().getReferenceNode(function(error, node) {
      return node.traverse({}, function(error, nodes) {
        if (callback) {
          return callback.call(_this, error, nodes);
        }
      });
    });
    return void 0;
  },
  findOne: function(criteria, callback) {},
  count: function(criteria, callback) {},
  exists: function(criteria, callback) {}
};

module.exports = Tower.StoreNeo4jFinders;
