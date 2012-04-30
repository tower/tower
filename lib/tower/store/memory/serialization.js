
Tower.Store.Memory.Serialization = {
  generateId: function() {
    return (this.lastId++).toString();
  }
};

module.exports = Tower.Store.Memory.Serialization;
