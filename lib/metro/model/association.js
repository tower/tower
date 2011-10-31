Metro.Model.Association = (function() {
  Association.include(Metro.Model.Scope);
  function Association(owner, reflection) {
    this.owner = owner;
    this.reflection = reflection;
  }
  Association.prototype.targetClass = function() {
    return global[this.reflection.targetClassName];
  };
  Association.prototype.scoped = function() {
    return (new Metro.Model.Scope(this.reflection.targetClassName)).where(this.conditions());
  };
  Association.prototype.conditions = function() {
    var result;
    result = {};
    if (this.owner.id && this.reflection.foreignKey) {
      result[this.reflection.foreignKey] = this.owner.id;
    }
    return result;
  };
  Association.delegates("where", "find", "all", "first", "last", "store", {
    to: "scoped"
  });
  return Association;
})();
module.exports = Metro.Model.Association;