var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.AppGenerator = (function(_super) {

  __extends(AppGenerator, _super);

  AppGenerator.name = 'AppGenerator';

  function AppGenerator() {
    return AppGenerator.__super__.constructor.apply(this, arguments);
  }

  AppGenerator.prototype.sourceRoot = __dirname;

  AppGenerator.prototype.buildApp = function(name) {
    var app;
    if (name == null) {
      name = this.appName;
    }
    app = AppGenerator.__super__.buildApp.call(this, name);
    app.title = this.program.title || _.titleize(app.name);
    app.description = this.program.description;
    app.keywords = this.program.keywords;
    return app;
  };

  AppGenerator.prototype.run = function() {
    return this.inside(this.app.name, '.', function() {
      if (!this.program.skipGitfile) {
        this.template("gitignore", ".gitignore");
      }
      this.template("npmignore", ".npmignore");
      if (!this.program.skipProcfile) {
        this.template("slugignore", ".slugignore");
      }
      this.template("cake", "Cakefile");
      this.inside("app", function() {
        this.inside("client", function() {
          this.inside("config", function() {
            return this.template("application.coffee");
          });
          this.directory("helpers");
          this.inside("stylesheets", function() {
            return this.template("application.styl");
          });
          return this.inside("controllers", function() {
            return this.template("applicationController.coffee");
          });
        });
        this.inside("controllers", function() {
          return this.template("applicationController.coffee");
        });
        this.inside("helpers", function() {
          return this.template("applicationHelper.coffee");
        });
        this.directory("mailers");
        this.directory("models");
        return this.inside("views", function() {
          this.template("welcome.coffee");
          this.inside("layouts", function() {
            return this.template("application.coffee");
          });
          return this.inside("shared", function() {
            this.template("_footer.coffee");
            this.template("_header.coffee");
            this.template("_meta.coffee");
            this.template("_navigation.coffee");
            return this.template("_sidebar.coffee");
          });
        });
      });
      this.inside("config", function() {
        this.template("application.coffee");
        this.template("assets.coffee");
        this.template("credentials.coffee");
        this.template("databases.coffee");
        this.template("routes.coffee");
        this.template("session.coffee");
        this.inside("environments", function() {
          this.template("development.coffee");
          this.template("production.coffee");
          return this.template("test.coffee");
        });
        this.directory("initializers");
        return this.inside("locales", function() {
          return this.template("en.coffee");
        });
      });
      this.inside("db", function() {
        return this.template("seeds.coffee");
      });
      this.inside("lib", function() {
        return this.directory("tasks");
      });
      this.directory("log");
      this.template("pack", "package.json");
      if (!this.program.skipProcfile) {
        this.template("Procfile");
      }
      this.inside("public", function() {
        this.template("404.html");
        this.template("500.html");
        this.template("fav.png", "favicon.png");
        this.template("crossdomain.xml");
        this.template("humans.txt");
        this.template("robots.txt");
        this.directory("images");
        this.inside("javascripts", function() {
          return this.inside("app", function() {
            return this.inside("views", function() {
              return this.createFile("templates.js", "");
            });
          });
        });
        this.directory("stylesheets");
        return this.directory("swfs");
      });
      this.template("README.md");
      this.template("server.js");
      this.inside("test", function() {
        this.directory("controllers");
        this.directory("factories");
        this.directory("features");
        this.directory("models");
        this.template("server.coffee");
        this.template("client.coffee");
        return this.template("mocha.opts");
      });
      this.directory("tmp");
      this.inside("vendor", function() {
        this.inside("javascripts", function() {
          var javascript, _i, _len, _ref, _results;
          this.get("https://raw.github.com/documentcloud/underscore/master/underscore.js", "underscore.js");
          this.get("https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js", "underscore.string.js");
          this.get("https://raw.github.com/caolan/async/master/lib/async.js", "async.js");
          this.get("https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js", "socket.io.js");
          this.get("https://raw.github.com/viatropos/design.io/master/design.io.js", "design.io.js");
          this.get("https://raw.github.com/viatropos/tower/master/dist/tower.js", "tower.js");
          this.get("https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.js", "history.js");
          this.get("https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.adapter.jquery.js", "history.adapter.jquery.js");
          this.get("https://raw.github.com/timrwood/moment/master/moment.js", "moment.js");
          this.get("https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js", "uri.js");
          this.get("https://raw.github.com/visionmedia/mocha/master/mocha.js", "mocha.js");
          this.get("https://raw.github.com/manuelbieh/Geolib/master/geolib.js", "geolib.js");
          this.get("https://raw.github.com/chriso/node-validator/master/validator.js", "validator.js");
          this.get("https://raw.github.com/viatropos/node.inflection/master/lib/inflection.js", "inflection.js");
          this.get("https://raw.github.com/josscrowcroft/accounting.js/master/accounting.js", "accounting.js");
          this.get("http://sinonjs.org/releases/sinon-1.3.1.js", "sinon.js");
          this.get("https://raw.github.com/logicalparadox/chai/master/chai.js", "chai.js");
          this.get("http://coffeekup.org/coffeekup.js", "coffeekup.js");
          this.get("https://raw.github.com/emberjs/starter-kit/cf5c6fa7c21c476f9441c220b16a63f37fe2cdc1/js/libs/ember-0.9.6.js", "ember.js");
          this.get("http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.js", "prettify.js");
          this.get("https://raw.github.com/Marak/Faker.js/master/Faker.js", "faker.js");
          this.get("https://raw.github.com/viatropos/factory.js/master/lib/factory.js", "factory.js");
          this.get("http://html5shiv.googlecode.com/svn/trunk/html5.js", "html5.js");
          this.directory("bootstrap");
          _ref = ["bootstrap-alert.js", "bootstrap-button.js", "bootstrap-carousel.js", "bootstrap-collapse.js", "bootstrap-dropdown.js", "bootstrap-modal.js", "bootstrap-popover.js", "bootstrap-scrollspy.js", "bootstrap-tab.js", "bootstrap-tooltip.js", "bootstrap-transition.js", "bootstrap-typeahead.js"];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            javascript = _ref[_i];
            _results.push(this.get("https://raw.github.com/twitter/bootstrap/master/js/" + javascript, "bootstrap/" + javascript));
          }
          return _results;
        });
        return this.inside("stylesheets", function() {
          var stylesheet, _i, _len, _ref, _results;
          this.get("http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css", "prettify.css");
          this.get("https://raw.github.com/visionmedia/mocha/master/mocha.css", "mocha.css");
          this.directory("bootstrap");
          _ref = ["accordion", "alerts", "bootstrap", "breadcrumbs", "button-groups", "buttons", "carousel", "close", "code", "component-animations", "dropdowns", "forms", "grid", "hero-unit", "labels-badges", "layouts", "mixins", "modals", "navbar", "navs", "pager", "pagination", "popovers", "progress-bars", "reset", "responsive", "scaffolding", "sprites", "tables", "thumbnails", "tooltip", "type", "utilities", "variables", "wells"];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            stylesheet = _ref[_i];
            _results.push(this.get("https://raw.github.com/twitter/bootstrap/master/less/" + stylesheet + ".less", "bootstrap/" + stylesheet + ".less"));
          }
          return _results;
        });
      });
      this.inside("public/images", function() {
        this.get("https://github.com/twitter/bootstrap/blob/master/img/glyphicons-halflings.png", "glyphicons-halflings.png");
        return this.get("https://github.com/twitter/bootstrap/blob/master/img/glyphicons-halflings-white.png", "glyphicons-halflings-white.png");
      });
      this.inside("public/swfs", function() {
        this.get("https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf", "WebSocketMain.swf");
        return this.get("https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf", "WebSocketMainInsecure.swf");
      });
      return this.template("watch", "Watchfile");
    });
  };

  return AppGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.AppGenerator;
