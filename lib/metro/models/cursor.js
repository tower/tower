(function() {
  var Cursor, exports;
  var __slice = Array.prototype.slice;
  Cursor = (function() {
    function Cursor() {}
    Cursor.prototype.clauses = [];
    Cursor.prototype.where = function() {
      this.clauses.push(this.clause.apply(this, ["where"].concat(__slice.call(arguments))));
      return this;
    };
    Cursor.prototype.order = function() {
      return this;
    };
    Cursor.prototype.limit = function() {
      return this;
    };
    Cursor.prototype.select = function() {
      return this;
    };
    Cursor.prototype.joins = function() {
      return this;
    };
    Cursor.prototype.includes = function() {
      return this;
    };
    Cursor.prototype.clause = function(name) {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Clause, [name].concat(__slice.call(arguments)), function() {});
    };
    return Cursor;
  })();
  exports = module.exports = Cursor;
}).call(this);
