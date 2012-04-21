var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Store.MongoDB = (function(_super) {
  var MongoDB;

  function MongoDB() {
    return MongoDB.__super__.constructor.apply(this, arguments);
  }

  MongoDB = __extends(MongoDB, _super);

  return MongoDB;

})(Tower.Store);

require('./mongodb/configuration');

require('./mongodb/database');

require('./mongodb/finders');

require('./mongodb/persistence');

require('./mongodb/serialization');

Tower.Store.MongoDB.include(Tower.Store.Memory.Serialization);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Configuration);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Database);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Finders);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Persistence);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Serialization);

Tower.callback("initialize", {
  name: "Tower.Store.MongoDB.initialize"
}, function(done) {
  try {
    Tower.Store.MongoDB.configure(Tower.config.databases.mongodb);
  } catch (_error) {}
  return Tower.Store.MongoDB.initialize(done);
});

module.exports = Tower.Store.MongoDB;
