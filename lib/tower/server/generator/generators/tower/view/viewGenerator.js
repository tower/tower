var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Generator.ViewGenerator = (function(_super) {
  var ViewGenerator;

  function ViewGenerator() {
    return ViewGenerator.__super__.constructor.apply(this, arguments);
  }

  ViewGenerator = __extends(ViewGenerator, _super);

  __defineProperty(ViewGenerator,  "sourceRoot", __dirname);

  __defineProperty(ViewGenerator,  "run", function() {
    var view, views, _i, _len, _results;
    this.directory("app/views/" + this.view.directory);
    views = ["_form", "_item", "_list", "_table", "edit", "index", "new", "show"];
    _results = [];
    for (_i = 0, _len = views.length; _i < _len; _i++) {
      view = views[_i];
      _results.push(this.template("" + view + ".coffee", "app/views/" + this.view.directory + "/" + view + ".coffee"));
    }
    return _results;
  });

  return ViewGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ViewGenerator;
