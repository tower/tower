
  Metro.Model.Finders = {
    ClassMethods: {
      all: function(query, callback) {
        return this.store().all(query, callback);
      },
      first: function(query, callback) {
        return this.store().first(query, callback);
      },
      last: function(query, callback) {
        return this.store().last(query, callback);
      },
      find: function(id, callback) {
        return this.store().find(id, callback);
      },
      count: function(query, callback) {
        return this.store().count(query, callback);
      },
      exists: function(callback) {
        return this.store().exists(callback);
      }
    }
  };

  module.exports = Metro.Model.Finders;
