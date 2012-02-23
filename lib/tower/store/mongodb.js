var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.MongoDB = (function(_super) {

  __extends(MongoDB, _super);

  function MongoDB() {
    MongoDB.__super__.constructor.apply(this, arguments);
  }

  return MongoDB;

})(Tower.Store);

require('./mongodb/configuration');

require('./mongodb/database');

require('./mongodb/finders');

require('./mongodb/graph');

require('./mongodb/inheritance');

require('./mongodb/persistence');

require('./mongodb/serialization');

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Configuration);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Database);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Finders);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Graph);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Inheritance);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Persistence);

Tower.Store.MongoDB.include(Tower.Store.MongoDB.Serialization);

module.exports = Tower.Store.MongoDB;
