(function() {
  Metro.Model.Reflection = (function() {
    function Reflection(type, sourceClassName, name, options) {
      if (options == null) {
        options = {};
      }
      this.type = type;
      this.sourceClassName = sourceClassName;
      this.targetClassName = options.className || Metro.Support.String.camelize(Metro.Support.String.singularize(name));
      this.foreignKey = options.foreignKey;
    }
    Reflection.prototype.targetClass = function() {
      return global[this.targetClassName];
    };
    Reflection.prototype.association = function(owner) {
      return new Metro.Model.Association(owner, this);
    };
    return Reflection;
  })();
  module.exports = Metro.Model.Reflection;
}).call(this);
