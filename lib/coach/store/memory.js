(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Store.Memory = (function() {

    __extends(Memory, Coach.Store);

    function Memory(options) {
      Memory.__super__.constructor.call(this, options);
      this.records = {};
      this.lastId = 0;
    }

    return Memory;

  })();

  require('./memory/finders');

  require('./memory/persistence');

  require('./memory/serialization');

  Coach.Store.Memory.include(Coach.Store.Memory.Finders);

  Coach.Store.Memory.include(Coach.Store.Memory.Persistence);

  Coach.Store.Memory.include(Coach.Store.Memory.Serialization);

  module.exports = Coach.Store.Memory;

}).call(this);
