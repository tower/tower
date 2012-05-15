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

Tower.Store.Mongodb = (function(_super) {
  var Mongodb;

  function Mongodb() {
    return Mongodb.__super__.constructor.apply(this, arguments);
  }

  Mongodb = __extends(Mongodb, _super);

  return Mongodb;

})(Tower.Store);

require('./mongodb/configuration');

require('./mongodb/database');

require('./mongodb/finders');

require('./mongodb/persistence');

require('./mongodb/serialization');

Tower.Store.Mongodb.include(Tower.Store.Mongodb.Configuration);

Tower.Store.Mongodb.include(Tower.Store.Mongodb.Database);

Tower.Store.Mongodb.include(Tower.Store.Mongodb.Finders);

Tower.Store.Mongodb.include(Tower.Store.Mongodb.Persistence);

Tower.Store.Mongodb.include(Tower.Store.Mongodb.Serialization);

module.exports = Tower.Store.Mongodb;
