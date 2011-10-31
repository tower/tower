var Persistence;
Persistence = (function() {
  function Persistence() {}
  Persistence.create = function(attrs) {
    var record;
    record = new this(attrs);
    this.store().create(record);
    return record;
  };
  Persistence.update = function() {};
  Persistence.deleteAll = function() {
    return this.store().clear();
  };
  Persistence.prototype.isNew = function() {};
  Persistence.prototype.save = function(options) {};
  Persistence.prototype.update = function(options) {};
  Persistence.prototype.reset = function() {};
  Persistence.alias("reload", "reset");
  return Persistence;
})();
module.exports = Persistence;