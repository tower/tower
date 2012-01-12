var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator = (function() {

  __extends(Generator, Tower.Class);

  Generator.desc = function(string) {};

  Generator.run = function(type, options) {
    var generator;
    if (options == null) options = {};
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](options);
    return generator.run();
  };

  function Generator(options) {
    if (options == null) options = {};
    _.extend(this, options);
    this.destinationRoot || (this.destinationRoot = process.cwd());
    this.cd = ".";
  }

  return Generator;

})();

require('./generator/actions');

require('./generator/attribute');

require('./generator/configuration');

require('./generator/naming');

require('./generator/resources');

Tower.Generator.include(Tower.Generator.Actions);

Tower.Generator.include(Tower.Generator.Attribute);

Tower.Generator.include(Tower.Generator.Configuration);

Tower.Generator.include(Tower.Generator.Naming);

Tower.Generator.include(Tower.Generator.Resources);

require('./generator/generators/app/appGenerator');

module.exports = Tower.Generator;
