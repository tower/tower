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

Tower.Generator = (function(_super) {
  var Generator;

  function Generator() {
    return Generator.__super__.constructor.apply(this, arguments);
  }

  Generator = __extends(Generator, _super);

  Generator.reopenClass({
    run: function(type, options) {
      var klass;
      klass = this.buildGenerator(type);
      return new klass(options);
    },
    buildGenerator: function(type) {
      var i, klass, node, nodes, _i, _len;
      nodes = type.split(':');
      nodes[nodes.length - 1] += 'Generator';
      for (i = _i = 0, _len = nodes.length; _i < _len; i = ++_i) {
        node = nodes[i];
        nodes[i] = _.camelize(node);
      }
      klass = Tower['Generator' + nodes.join('')];
      return klass;
    }
  });

  Generator.reopen({
    sourceRoot: __dirname,
    init: function(options) {
      var name,
        _this = this;
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      options.program || (options.program = {});
      _.extend(this, options);
      if (!this.appName) {
        name = process.cwd().split('/');
        this.appName = name[name.length - 1];
      }
      this.destinationRoot || (this.destinationRoot = process.cwd());
      this.currentSourceDirectory = this.currentDestinationDirectory = '.';
      if (!this.app) {
        this.app = this.buildApp();
        this.user = {};
        return this.buildUser(function(user) {
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
    },
    run: function() {}
  });

  return Generator;

})(Tower.Class);

module.exports = Tower.Generator;
