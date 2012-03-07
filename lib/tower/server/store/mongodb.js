var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.MongoDB = (function() {

  __extends(MongoDB, Tower.Store);

  function MongoDB() {
    MongoDB.__super__.constructor.apply(this, arguments);
  }

  return MongoDB;

})();

require('./mongodb/configuration');

require('./mongodb/database');

require('./mongodb/finders');

require('./mongodb/graph');

require('./mongodb/inheritance');

require('./mongodb/persistence');

require('./mongodb/serialization');

Tower.Store.MongoDB.include(Tower.Store.Memory.Serialization);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Configuration);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Database);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Finders);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Graph);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Inheritance);

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
