var _,
  __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

_ = Tower._;

Tower.Generator = (function() {

  __defineStaticProperty(Generator,  "include", function(mixin) {
    return _.extend(this.prototype, mixin);
  });

  __defineStaticProperty(Generator,  "run", function(type, options) {
    var klass;
    klass = this.buildGenerator(type);
    return new klass(options);
  });

  __defineStaticProperty(Generator,  "buildGenerator", function(type) {
    var i, klass, node, nodes, _i, _len;
    nodes = type.split(':');
    nodes[nodes.length - 1] += 'Generator';
    for (i = _i = 0, _len = nodes.length; _i < _len; i = ++_i) {
      node = nodes[i];
      nodes[i] = _.camelize(node);
    }
    klass = Tower['Generator' + nodes.join('')];
    return klass;
  });

  __defineProperty(Generator,  "sourceRoot", __dirname);

  function Generator(options) {
    var name,
      _this = this;
    if (options == null) {
      options = {};
    }
    options.program || (options.program = {});
    _.extend(this, options);
    if (!this.hasOwnProperty('silent')) {
      this.silent = !!options.program.quiet;
    }
    if (!this.appName) {
      name = process.cwd().split('/');
      this.appName = name[name.length - 1];
    }
    this.destinationRoot || (this.destinationRoot = process.cwd());
    this.currentSourceDirectory = this.currentDestinationDirectory = '.';
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

  __defineProperty(Generator,  "run", function() {});

  return Generator;

})();
