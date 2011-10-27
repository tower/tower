(function() {
  var Persistence;
  Persistence = (function() {
    function Persistence() {}
    Persistence.create = function(attrs) {
      var record;
      record = new this(attrs);
      this.store().create(record);
      return record;
    };
    Persistence.prototype.save = function(options) {};
    Persistence.prototype.update = function(options) {};
    return Persistence;
  })();
  module.exports = Persistence;
}).call(this);
