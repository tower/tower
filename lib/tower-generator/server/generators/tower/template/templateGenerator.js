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

Tower.GeneratorTemplateGenerator = (function(_super) {
  var GeneratorTemplateGenerator;

  function GeneratorTemplateGenerator() {
    return GeneratorTemplateGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorTemplateGenerator = __extends(GeneratorTemplateGenerator, _super);

  GeneratorTemplateGenerator.reopen({
    sourceRoot: __dirname,
    run: function() {
      var scriptType, template, templates, _i, _len, _results;
      scriptType = 'coffee';
      this.directory("app/templates/shared/" + this.view.directory);
      templates = ['_flash', '_form', '_item', '_list', '_table', 'edit', 'index', 'new', 'show'];
      _results = [];
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        _results.push(this.template("" + template + "." + scriptType, "app/templates/shared/" + this.view.directory + "/" + template + "." + scriptType));
      }
      return _results;
    }
  });

  return GeneratorTemplateGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorViewGenerator;
