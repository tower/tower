(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Store.MongoDB = (function() {

    __extends(MongoDB, Coach.Store);

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

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Configuration);

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Database);

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Finders);

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Graph);

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Inheritance);

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Persistence);

  Coach.Store.MongoDB.include(Coach.Store.MongoDB.Serialization);

  module.exports = Coach.Store.MongoDB;

}).call(this);
