(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Store.MongoDB = (function() {

    __extends(MongoDB, Metro.Store);

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

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Configuration);

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Database);

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Finders);

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Graph);

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Inheritance);

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Persistence);

  Metro.Store.MongoDB.include(Metro.Store.MongoDB.Serialization);

  module.exports = Metro.Store.MongoDB;

}).call(this);
