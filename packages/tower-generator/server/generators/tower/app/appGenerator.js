var IMAGES, JAVASCRIPTS, STYLESHEETS, SWFS, fs, javascript, stylesheet, twitterBootstrapCommit, _i, _j, _len, _len1, _path, _ref, _ref1,
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
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

twitterBootstrapCommit = 'aaabe2a46c64e7d9ffd5735dba2db4f3cf9906f5';

fs = require('fs');

_path = require('path');

Tower.GeneratorAppGenerator = (function(_super) {
  var GeneratorAppGenerator;

  function GeneratorAppGenerator() {
    return GeneratorAppGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorAppGenerator = __extends(GeneratorAppGenerator, _super);

  __defineProperty(GeneratorAppGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorAppGenerator,  "buildApp", function(name) {
    var app;
    if (name == null) {
      name = this.appName;
    }
    app = GeneratorAppGenerator.__super__[ "buildApp"].call(this, name);
    app.title = this.program.title || _.titleize(_.humanize(app.name));
    app.description = this.program.description;
    app.keywords = this.program.keywords;
    app.stylesheetEngine = this.program.stylesheetEngine;
    app.scriptType = this.program.scriptType;
    app.templateEngine = this.program.templateEngine;
    return app;
  });

  __defineProperty(GeneratorAppGenerator,  "run", function() {
    var IMAGES, JAVASCRIPTS, STYLESHEETS, SWFS, isCoffee, scriptType, stylesheetEngine, templateEngine, _ref;
    _ref = Tower.GeneratorAppGenerator, JAVASCRIPTS = _ref.JAVASCRIPTS, STYLESHEETS = _ref.STYLESHEETS, IMAGES = _ref.IMAGES, SWFS = _ref.SWFS;
    scriptType = this.program.scriptType;
    isCoffee = scriptType === 'coffee';
    templateEngine = this.program.templateEngine;
    stylesheetEngine = this.program.stylesheetEngine || 'styl';
    return this.inside(this.app.name, '.', function() {
      var copyVendor, vendorPath, vendorPathExists,
        _this = this;
      if (!this.program.skipGitfile) {
        this.template('gitignore', '.gitignore');
      }
      this.template('npmignore', '.npmignore');
      if (!this.program.skipProcfile) {
        this.template('slugignore', '.slugignore');
      }
      if (isCoffee) {
        this.template('cake', 'Cakefile');
      }
      this.inside('app', function() {
        this.inside('config', function() {
          this.inside('client', function() {
            this.template("bootstrap." + scriptType);
            return this.template("watch." + scriptType);
          });
          this.inside('server', function() {
            this.template("assets." + scriptType);
            this.template("bootstrap." + scriptType);
            this.template("credentials." + scriptType);
            this.template("databases." + scriptType);
            this.template("session." + scriptType);
            this.inside('environments', function() {
              if (isCoffee) {
                this.template("development." + scriptType);
                this.template("production." + scriptType);
                return this.template("test." + scriptType);
              }
            });
            return this.directory('initializers');
          });
          return this.inside('shared', function() {
            this.template("application." + scriptType);
            this.inside('locales', function() {
              return this.template("en." + scriptType);
            });
            return this.template("routes." + scriptType);
          });
        });
        this.inside('controllers', function() {
          this.inside('client', function() {
            return this.template("applicationController." + scriptType);
          });
          return this.inside('server', function() {
            return this.template("applicationController." + scriptType);
          });
        });
        this.inside('models', function() {
          this.directory('client');
          this.directory('server');
          return this.directory('shared');
        });
        this.inside('stylesheets', function() {
          this.inside('client', function() {
            return this.template("application." + stylesheetEngine);
          });
          return this.inside('server', function() {
            return this.template("email." + stylesheetEngine);
          });
        });
        this.inside('templates', function() {
          this.inside('server', function() {
            return this.inside('layout', function() {
              this.template("application." + templateEngine);
              return this.template("_meta." + templateEngine);
            });
          });
          return this.inside('shared', function() {
            this.template("welcome." + templateEngine);
            return this.inside('layout', function() {
              this.template("_body." + templateEngine);
              this.template("_flash." + templateEngine);
              this.template("_footer." + templateEngine);
              this.template("_header." + templateEngine);
              this.template("_navigation." + templateEngine);
              return this.template("_sidebar." + templateEngine);
            });
          });
        });
        return this.inside('views', function() {
          return this.inside('client', function() {
            return this.inside('layout', function() {
              return this.template("application." + scriptType);
            });
          });
        });
      });
      this.inside('data', function() {
        return this.template("seeds." + scriptType);
      });
      this.directory('lib');
      this.directory('log');
      this.template('pack', 'package.json');
      if (!this.program.skipProcfile) {
        this.template('Procfile');
      }
      this.inside('public', function() {
        this.template('404.html');
        this.template('500.html');
        this.template('fav.png', 'favicon.png');
        this.template('crossdomain.xml');
        this.template('humans.txt');
        this.template('robots.txt');
        this.directory('fonts');
        this.directory('images');
        this.directory('javascripts');
        this.directory('stylesheets');
        this.directory('swfs');
        return this.directory('uploads');
      });
      this.template('README.md');
      this.inside('scripts', function() {
        return this.template('tower');
      });
      this.template('server.js');
      this.inside('test', '.', function() {
        this.inside('cases', '.', function() {
          this.inside('controllers', function() {
            this.directory('client');
            return this.directory('server');
          });
          this.inside('features', '.', function() {
            this.directory('client');
            return this.directory('server');
          });
          return this.inside('models', function() {
            this.directory('client');
            this.directory('server');
            return this.directory('shared');
          });
        });
        return this.directory('factories');
      });
      this.inside('test', function() {
        this.template("client." + scriptType);
        this.template('mocha.opts');
        return this.template("server." + scriptType);
      });
      this.directory('tmp');
      vendorPath = _path.join(Tower.srcRoot, 'vendor');
      vendorPathExists = fs.existsSync(vendorPath);
      copyVendor = function(source, destination) {
        return Tower.module('wrench').copyDirSyncRecursive(_path.join(vendorPath, source), _this.destinationPath(destination));
      };
      if (!vendorPathExists) {
        this.inside('vendor', function() {
          this.inside('javascripts', function() {
            var local, remote, _results;
            this.directory('bootstrap');
            _results = [];
            for (remote in JAVASCRIPTS) {
              local = JAVASCRIPTS[remote];
              _results.push(this.get(remote, local));
            }
            return _results;
          });
          return this.inside('stylesheets', function() {
            var local, remote, _results;
            this.directory('bootstrap');
            _results = [];
            for (remote in STYLESHEETS) {
              local = STYLESHEETS[remote];
              _results.push(this.get(remote, local));
            }
            return _results;
          });
        });
        this.inside('public/images', function() {
          var local, remote, _results;
          _results = [];
          for (remote in IMAGES) {
            local = IMAGES[remote];
            _results.push(this.get(remote, local));
          }
          return _results;
        });
      } else {
        this.directory('vendor/javascripts');
        this.directory('vendor/stylesheets');
        copyVendor('javascripts', 'vendor/javascripts');
        copyVendor('stylesheets', 'vendor/stylesheets');
        copyVendor('images', 'public/images');
      }
      this.template("grunt." + scriptType, "grunt." + scriptType);
      return this.inside('wiki', function() {
        this.template('home.md');
        return this.template('_sidebar.md');
      });
    });
  });

  return GeneratorAppGenerator;

})(Tower.Generator);

JAVASCRIPTS = {
  'https://raw.github.com/documentcloud/underscore/master/underscore.js': 'underscore.js',
  'https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js': 'underscore.string.js',
  'https://raw.github.com/caolan/async/master/lib/async.js': 'async.js',
  'https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js': 'socket.io.js',
  'https://raw.github.com/timrwood/moment/master/moment.js': 'moment.js',
  'https://raw.github.com/andris9/jStorage/72c44323d33bb6a4c3610bdb774184e3a43a230f/jstorage.min.js': 'jstorage.js',
  'https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js': 'uri.js',
  'https://raw.github.com/visionmedia/mocha/master/mocha.js': 'mocha.js',
  'https://raw.github.com/manuelbieh/Geolib/390e9d4e26c05bfdba86fe1a28a8548c58a9b841/geolib.js': 'geolib.js',
  'https://raw.github.com/chriso/node-validator/master/validator.js': 'validator.js',
  'https://raw.github.com/viatropos/node.inflection/master/lib/inflection.js': 'inflection.js',
  'https://raw.github.com/josscrowcroft/accounting.js/9ff4a4022e5c08f028d652d2b0ba1d4b65588bde/accounting.js': 'accounting.js',
  'https://raw.github.com/edubkendo/sinon.js/2c6518de91c793344c7ead01a34556585f1b4d2c/sinon.js': 'sinon.js',
  'https://raw.github.com/chaijs/chai/efc77596338556cca5fb4eade95c3838a743a186/chai.js': 'chai.js',
  'https://raw.github.com/gradus/coffeecup/2d76a48c1292629dbe961088f756f00b034f0060/lib/coffeecup.js': 'coffeekup.js',
  'https://raw.github.com/emberjs/starter-kit/1e6ee1418c694206a49bd7b021fe5996e7fdb14c/js/libs/ember-1.0.pre.js': 'ember.js',
  'https://raw.github.com/emberjs/starter-kit/1e6ee1418c694206a49bd7b021fe5996e7fdb14c/js/libs/handlebars-1.0.0.beta.6.js': 'handlebars.js',
  'https://raw.github.com/edubkendo/prettify.js/544c6cdf16594c85d3698dd0cbe07a9f232d02d9/prettify.js': 'prettify.js',
  'https://raw.github.com/Marak/Faker.js/master/Faker.js': 'faker.js',
  'https://raw.github.com/madrobby/keymaster/c61b3fef9767d4899a1732b089ca70512c9d4261/keymaster.js': 'keymaster.js',
  'https://raw.github.com/mrdoob/stats.js/master/src/Stats.js': 'stats.js',
  'http://html5shiv.googlecode.com/svn/trunk/html5.js': 'html5.js'
};

JAVASCRIPTS["http://cloud.github.com/downloads/viatropos/tower/tower-" + Tower.version + ".js"] = 'tower.js';

_ref = ['bootstrap-alert', 'bootstrap-button', 'bootstrap-carousel', 'bootstrap-collapse', 'bootstrap-dropdown', 'bootstrap-modal', 'bootstrap-popover', 'bootstrap-scrollspy', 'bootstrap-tab', 'bootstrap-tooltip', 'bootstrap-transition', 'bootstrap-typeahead'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  javascript = _ref[_i];
  JAVASCRIPTS["https://raw.github.com/twitter/bootstrap/" + twitterBootstrapCommit + "/js/" + javascript + ".js"] = "bootstrap/" + javascript + ".js";
}

STYLESHEETS = {
  'http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css': 'prettify.css',
  'https://raw.github.com/visionmedia/mocha/master/mocha.css': 'mocha.css'
};

_ref1 = ['accordion', 'alerts', 'bootstrap', 'breadcrumbs', 'button-groups', 'buttons', 'carousel', 'close', 'code', 'component-animations', 'dropdowns', 'forms', 'grid', 'hero-unit', 'labels-badges', 'layouts', 'mixins', 'modals', 'navbar', 'navs', 'pager', 'pagination', 'popovers', 'progress-bars', 'reset', 'responsive-1200px-min', 'responsive-767px-max', 'responsive-768px-979px', 'responsive-navbar', 'responsive-utilities', 'responsive', 'scaffolding', 'sprites', 'tables', 'thumbnails', 'tooltip', 'type', 'utilities', 'variables', 'wells'];
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  stylesheet = _ref1[_j];
  STYLESHEETS["https://raw.github.com/twitter/bootstrap/" + twitterBootstrapCommit + "/less/" + stylesheet + ".less"] = "bootstrap/" + stylesheet + ".less";
}

IMAGES = {};

IMAGES["https://raw.github.com/twitter/bootstrap/" + twitterBootstrapCommit + "/img/glyphicons-halflings.png"] = 'glyphicons-halflings.png';

IMAGES["https://raw.github.com/twitter/bootstrap/" + twitterBootstrapCommit + "/img/glyphicons-halflings-white.png"] = 'glyphicons-halflings-white.png';

SWFS = {
  'https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf': 'WebSocketMain.swf',
  'https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf': 'WebSocketMainInsecure.swf'
};

Tower.GeneratorAppGenerator.JAVASCRIPTS = JAVASCRIPTS;

Tower.GeneratorAppGenerator.STYLESHEETS = STYLESHEETS;

Tower.GeneratorAppGenerator.IMAGES = IMAGES;

Tower.GeneratorAppGenerator.SWFS = SWFS;

module.exports = Tower.GeneratorAppGenerator;
