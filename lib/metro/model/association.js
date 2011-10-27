(function() {
  var Association;
  Association = (function() {
    function Association(sourceClassName, name, options) {
      if (options == null) {
        options = {};
      }
      this.sourceClassName = sourceClassName;
      this.targetClassName = options.className || name;
      this.foreignKey = options.foreignKey;
    }
    Association.prototype.targetClass = function() {
      return global[this.targetClassName];
    };
    Association.prototype.scoped = function(id) {
      return (new Metro.Model.Scope(this.targetClassName)).where(this.conditions(id));
    };
    Association.prototype.conditions = function(id) {
      var result;
      result = {};
      if (id && this.foreignKey) {
        result[this.foreignKey] = id;
      }
      return result;
    };
    return Association;
  })();
  module.exports = Association;
}).call(this);
