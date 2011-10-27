(function() {
  var Association;
  Association = (function() {
    function Association(sourceClassName, name, options) {
      if (options == null) {
        options = {};
      }
      this.sourceClassName = sourceClassName;
      this.targetClassName = options.className || name;
    }
    Association.prototype.targetClass = function() {
      return global[this.targetClassName];
    };
    Association.prototype.scoped = function() {
      return (new Metro.Model.Scope()).where(conditions());
    };
    Association.prototype.conditions = function() {
      var _ref;
      return (_ref = this._conditions) != null ? _ref : this._conditions = {};
    };
    return Association;
  })();
  module.exports = Association;
}).call(this);
