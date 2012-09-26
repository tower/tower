var _,
  __slice = [].slice;

_ = Tower._;

Tower.ModelSharding = {
  ClassMethods: {
    shard: function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    }
  }
};

module.exports = Tower.ModelSharding;
