var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.GeneratorViewGenerator = (function(_super) {
  var GeneratorViewGenerator;

  function GeneratorViewGenerator() {
    return GeneratorViewGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorViewGenerator = __extends(GeneratorViewGenerator, _super);

  GeneratorViewGenerator.reopen({
    sourceRoot: __dirname,
    run: function() {
      var scriptType, view, views, _i, _len, _results;
      scriptType = 'coffee';
      views = ['form', 'index', 'show'];
      _results = [];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.template("" + view + "." + scriptType, "app/views/client/" + this.view.directory + "/" + view + "." + scriptType);
        _results.push(this.asset("/app/views/client/" + this.view.directory + "/" + view));
      }
      return _results;
    }
  });

  return GeneratorViewGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorViewGenerator;
