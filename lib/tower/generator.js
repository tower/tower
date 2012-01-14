var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator = (function() {

  __extends(Generator, Tower.Class);

  Generator.run = function(type, argv) {
    var generator;
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](argv);
    return generator.run();
  };

  function Generator(argv, options) {
    if (options == null) options = {};
    _.extend(this, options);
    this.project = new Tower.Generator.Project(argv.shift());
    this.user = {};
    if (argv.length > 0 && argv[0].charAt(0) !== "-") {
      this.model = new Tower.Generator.Model(argv.shift());
    }
    this.destinationRoot || (this.destinationRoot = process.cwd());
    this.cd = ".";
    this.project = {};
    this.user = {};
  }

  return Generator;

})();

require('./generator/actions');

require('./generator/configuration');

require('./generator/resources');

Tower.Generator.include(Tower.Generator.Actions);

Tower.Generator.include(Tower.Generator.Attribute);

Tower.Generator.include(Tower.Generator.Configuration);

Tower.Generator.include(Tower.Generator.Resources);

require('./generator/generators/tower/app/appGenerator');

require('./generator/generators/tower/model/modelGenerator');

require('./generator/generators/tower/view/viewGenerator');

module.exports = Tower.Generator;
