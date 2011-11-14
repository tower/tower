(function() {
  Metro.Model.Persistence = (function() {
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
    Persistence.prototype.isNew = function() {
      return !!!attributes.id;
    };
    Persistence.prototype.save = function(options) {
      return runCallbacks(function() {});
    };
    Persistence.prototype.update = function(options) {};
    Persistence.prototype.reset = function() {};
    Persistence.alias("reload", "reset");
    Persistence.prototype.updateAttribute = function(name, value) {};
    Persistence.prototype.updateAttributes = function(attributes) {};
    Persistence.prototype.increment = function(attribute, amount) {
      if (amount == null) {
        amount = 1;
      }
    };
    Persistence.prototype.decrement = function(attribute, amount) {
      if (amount == null) {
        amount = 1;
      }
    };
    Persistence.prototype.reload = function() {};
    Persistence.prototype["delete"] = function() {};
    Persistence.prototype.destroy = function() {};
    Persistence.prototype.createOrUpdate = function() {};
    Persistence.prototype.isDestroyed = function() {};
    Persistence.prototype.isPersisted = function() {};
    return Persistence;
  })();
  module.exports = Metro.Model.Persistence;
}).call(this);
