var _;

_ = Tower._;

Tower.StoreMemorySerialization = {
  generateId: function() {
    return _.uuid();
  }
};

module.exports = Tower.StoreMemorySerialization;
