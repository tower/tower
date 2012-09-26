var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.StoreMongodb = (function(_super) {
  var StoreMongodb;

  function StoreMongodb() {
    return StoreMongodb.__super__.constructor.apply(this, arguments);
  }

  StoreMongodb = __extends(StoreMongodb, _super);

  return StoreMongodb;

})(Tower.Store);

require('./mongodb/configuration');

require('./mongodb/database');

require('./mongodb/finders');

require('./mongodb/persistence');

require('./mongodb/serialization');

Tower.StoreMongodb.include(Tower.StoreMongodbConfiguration);

Tower.StoreMongodb.include(Tower.StoreMongodbDatabase);

Tower.StoreMongodb.include(Tower.StoreMongodbFinders);

Tower.StoreMongodb.include(Tower.StoreMongodbPersistence);

Tower.StoreMongodb.include(Tower.StoreMongodbSerialization);

module.exports = Tower.StoreMongodb;
