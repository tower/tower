var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator = (function(_super) {

  __extends(Generator, _super);

  Generator.prototype.sourceRoot = __dirname;

  Generator.run = function(type, options) {
    var klass;
    klass = this.buildGenerator(type);
    return new klass(options);
  };

  Generator.buildGenerator = function(type) {
    var i, klass, node, nodes, _len;
    klass = Tower.Generator;
    nodes = type.split(":");
    nodes[nodes.length - 1] += "Generator";
    for (i = 0, _len = nodes.length; i < _len; i++) {
      node = nodes[i];
      klass = klass[Tower.Support.String.camelize(node)];
    }
    return klass;
  };

  function Generator(options) {
    var name,
      _this = this;
    if (options == null) options = {};
    _.extend(this, options);
    if (!this.appName) {
      name = process.cwd().split("/");
      this.appName = name[name.length - 1];
    }
    this.destinationRoot || (this.destinationRoot = process.cwd());
    this.currentSourceDirectory = this.currentDestinationDirectory = ".";
    if (!this.app) {
      this.app = this.buildApp();
      this.user = {};
      this.buildUser(function(user) {
        _this.user = user;
        if (_this.modelName) {
          _this.model = _this.buildModel(_this.modelName, _this.app.className, _this.program.args);
        }
        if (_this.model) {
          _this.view = _this.buildView(_this.modelName);
          _this.controller = _this.buildController(_this.modelName);
        }
        return _this.run();
      });
    }
  }

  return Generator;

})(Tower.Class);

require('./generator/actions');

require('./generator/configuration');

require('./generator/resources');

require('./generator/shell');

Tower.Generator.include(Tower.Generator.Actions);

Tower.Generator.include(Tower.Generator.Configuration);

Tower.Generator.include(Tower.Generator.Resources);

Tower.Generator.include(Tower.Generator.Shell);

Tower.Generator.Mocha = {};

require('./generator/generators/tower/app/appGenerator');

require('./generator/generators/tower/model/modelGenerator');

require('./generator/generators/tower/view/viewGenerator');

require('./generator/generators/tower/controller/controllerGenerator');

require('./generator/generators/tower/helper/helperGenerator');

require('./generator/generators/tower/assets/assetsGenerator');

require('./generator/generators/tower/mailer/mailerGenerator');

require('./generator/generators/tower/scaffold/scaffoldGenerator');

require('./generator/generators/mocha/model/modelGenerator');

module.exports = Tower.Generator;
