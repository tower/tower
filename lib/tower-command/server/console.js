var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.CommandConsole = (function() {

  function CommandConsole(argv) {
    var program;
    this.program = program = require('commander');
    program.version(Tower.version).option('-e, --environment [value]').option('-c, --coffee').option('-s --synchronous').option('-h, --help', '\ \ Usage:\n\ \   tower console [options]\n\ \ \n\ \ Options:\n\ \   -e, --environment [value]         sets Tower.env (development, production, test, etc., default: development)\n\ \   -c, --coffee                      run in coffeescript mode!\n\ \   -s, --synchronous                 allows for database operations to run synchronously\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \ ');
    program.parse(argv);
    program.environment || (program.environment = "development");
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
    Tower.env = this.program.environment;
  }

  __defineProperty(CommandConsole,  "run", function() {
    var client, repl,
      _this = this;
    if (this.program.coffee) {
      return this.runCoffee();
    }
    repl = require("repl");
    repl = repl.start({
      prompt: "tower> ",
      context: this,
      "eval": function(cmd, context, filename, callback) {
        return Fiber(function() {
          try {
            return callback(null, eval.call(context, cmd));
          } catch (error) {
            return callback(error);
          }
        }).run();
      }
    });
    client = repl.context;
    client.reload = function() {
      var app;
      if (_this.program.synchronous) {
        Tower.ModelCursor.include(Tower.ModelCursorSync);
      }
      app = Tower.Application.instance();
      app.isConsole = true;
      app.initialize();
      app.stack();
      if (Tower.watch) {
        app.watch();
      }
      client.Tower = Tower;
      client.Future = require('fibers/future');
      client.Fiber = Fiber;
      client[Tower.namespace()] = app;
      return client._r = function(name) {
        return function(error, value) {
          if (error) {
            return console.log(error);
          } else {
            client[name] = value;
            return process.stdout.write(value);
          }
        };
      };
    };
    client._c = function() {
      var i, l, message;
      l = arguments.length;
      message = "Callback called with " + l + " argument" + (l === 1 ? "" : "s") + (l > 0 ? ":\n" : "");
      i = 0;
      while (i < 10) {
        if (i < arguments.length) {
          client["_" + i] = arguments[i];
          message += "_" + i + " = " + arguments[i] + "\n";
        } else {
          if (client.hasOwnProperty("_" + i)) {
            delete client["_" + i];
          }
        }
        i++;
      }
      return console.log(message);
    };
    client.exit = function() {
      return process.exit(0);
    };
    return process.nextTick(client.reload);
  });

  __defineProperty(CommandConsole,  "runCoffee", function() {
    var ACCESSOR, CoffeeScript, Module, REPL_PROMPT, REPL_PROMPT_CONTINUATION, SIMPLEVAR, Script, app, autocomplete, backlog, completeAttribute, completeVariable, enableColours, error, getCompletions, inspect, readline, repl, run, stdin, stdout;
    if (this.program.synchronous) {
      Tower.ModelCursor.include(Tower.ModelCursorSync);
    }
    app = Tower.Application.instance();
    app.initialize();
    app.stack();
    CoffeeScript = require('coffee-script');
    readline = require('readline');
    inspect = require('util').inspect;
    Script = require('vm').Script;
    Module = require('module');
    REPL_PROMPT = 'tower> ';
    REPL_PROMPT_CONTINUATION = '......> ';
    enableColours = false;
    if (process.platform !== 'win32') {
      enableColours = !process.env.NODE_DISABLE_COLORS;
    }
    stdin = process.openStdin();
    stdout = process.stdout;
    error = function(err) {
      return stdout.write((err.stack || err.toString()) + '\n');
    };
    backlog = '';
    run = function(buffer) {
      var code;
      require('fibers/future');
      if (!buffer.toString().trim() && !backlog) {
        repl.prompt();
        return;
      }
      code = backlog += buffer;
      if (code[code.length - 1] === '\\') {
        backlog = "" + backlog.slice(0, -1) + "\n";
        repl.setPrompt(REPL_PROMPT_CONTINUATION);
        repl.prompt();
        return;
      }
      repl.setPrompt(REPL_PROMPT);
      backlog = '';
      Fiber(function() {
        var $_, returnValue, _;
        try {
          $_ = global.$_;
          _ = Tower._;
          returnValue = CoffeeScript["eval"]("$_=(" + code + "\n)", {
            filename: 'repl',
            modulename: 'repl'
          });
          if (returnValue === void 0) {
            global.$_ = $_;
          }
          return process.stdout.write(inspect(returnValue, false, 2, enableColours) + '\n');
        } catch (err) {
          return error(err);
        }
      }).run();
      return repl.prompt();
    };
    ACCESSOR = /\s*([\w\.]+)(?:\.(\w*))$/;
    SIMPLEVAR = /\s*(\w*)$/i;
    autocomplete = function(text) {
      return completeAttribute(text) || completeVariable(text) || [[], text];
    };
    completeAttribute = function(text) {
      var all, completions, match, obj, prefix, val;
      if (match = text.match(ACCESSOR)) {
        all = match[0], obj = match[1], prefix = match[2];
        try {
          val = Script.runInThisContext(obj);
        } catch (error) {
          return;
        }
        completions = getCompletions(prefix, Object.getOwnPropertyNames(val));
        return [completions, prefix];
      }
    };
    completeVariable = function(text) {
      var completions, free, keywords, possibilities, r, vars, _ref;
      free = (_ref = text.match(SIMPLEVAR)) != null ? _ref[1] : void 0;
      if (free != null) {
        vars = Script.runInThisContext('Object.getOwnPropertyNames(this)');
        keywords = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = CoffeeScript.RESERVED;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            r = _ref1[_i];
            if (r.slice(0, 2) !== '__') {
              _results.push(r);
            }
          }
          return _results;
        })();
        possibilities = vars.concat(keywords);
        completions = getCompletions(free, possibilities);
        return [completions, free];
      }
    };
    getCompletions = function(prefix, candidates) {
      var el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = candidates.length; _i < _len; _i++) {
        el = candidates[_i];
        if (el.indexOf(prefix) === 0) {
          _results.push(el);
        }
      }
      return _results;
    };
    process.on('uncaughtException', error);
    if (readline.createInterface.length < 3) {
      repl = readline.createInterface(stdin, autocomplete);
      stdin.on('data', function(buffer) {
        return repl.write(buffer);
      });
    } else {
      repl = readline.createInterface(stdin, stdout, autocomplete);
    }
    repl.on('attemptClose', function() {
      if (backlog) {
        backlog = '';
        process.stdout.write('\n');
        repl.setPrompt(REPL_PROMPT);
        return repl.prompt();
      } else {
        return repl.close();
      }
    });
    repl.on('close', function() {
      process.stdout.write('\n');
      return stdin.destroy();
    });
    repl.on('line', run);
    repl.setPrompt(REPL_PROMPT);
    return repl.prompt();
  });

  return CommandConsole;

})();

module.exports = Tower.CommandConsole;
