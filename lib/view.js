(function() {
  var View, exports;
  View = (function() {
    View.bootstrap = function() {
      return this;
    };
    function View(name, options) {
      this.path = name;
    }
    View.prototype.render = function(options, callback) {
      return this.template.render(this.read(), options, callback);
    };
    View.prototype.read = function() {
      return fs.readFileSync(this.path, "utf-8");
    };
    return View;
  })();
  exports = module.exports = View;
}).call(this);
