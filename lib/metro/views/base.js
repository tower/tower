(function() {
  var Base;
  Base = (function() {
    function Base(name, options) {
      this.path = name;
    }
    Base.prototype.render = function(options, callback) {
      return this.template.render(this.read(), options, callback);
    };
    Base.prototype.read = function() {
      return fs.readFileSync(this.path, "utf-8");
    };
    return Base;
  })();
  module.exports = Base;
}).call(this);
