var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.CommandDatabase = (function() {

  function CommandDatabase(argv) {
    var array, coffeeValue, order, program;
    this.program = program = require('commander');
    array = function(value) {
      return value.split(/,\s*/);
    };
    coffeeValue = function(value) {
      return eval(require('mint').coffee(value, {
        bare: true
      }));
    };
    order = function(value) {
      return Tower.NetParam.create('sort', {
        type: 'Order'
      }).parse(value);
    };
    program.version(Tower.version).option('-s, --select <fields>', 'Fields to return', array, []).option('-w, --where <conditions>', 'Query conditions', coffeeValue, {}).option('-o, --order <conditions>', 'Array of orderings, e.g. "--order createdAt+,title-"', order, []).option('-l, --limit <n>', 'Limit the records', parseInt, 20).option('-p, --page <n>', 'Paginate', parseInt, 1).option('-v, --version').option('-h, --help', '\ \ Usage:\n\ \   tower select [model] [query]\n\ \   tower database select [model] [query]\n\ \ \n\ \ Options:\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \ \n\ \ Examples:\n\ \   tower select posts --select id,createdAt --where \'createdAt: $gte: _(1).days().ago()\' --order createdAt- --limit 10 --page 2\n\ \ ');
    program.parse(argv);
    program.help || (program.help = program.rawArgs.length === 2);
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
    program.modelClassName = _.camelize(_.singularize(program.args[2]));
  }

  __defineProperty(CommandDatabase,  "run", function() {
    var app, backspace, buffer, cursor, deleteRecord, down, escapeMode, insertMode, keypressListeners, left, listener, oldKeypressListeners, right, rl, stdin, stdout, ttys, up, wasRaw, x,
      _this = this;
    rl = require('readline');
    ttys = require('ttys');
    stdin = ttys.stdin;
    stdout = ttys.stdout;
    wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    buffer = [];
    process.on('exit', function() {
      return stdin.setRawMode(wasRaw);
    });
    cursor = require('ansi')(stdout);
    stdout.on('newline', function() {});
    stdin.resume();
    up = function() {
      return cursor.up();
    };
    down = function() {
      return cursor.down();
    };
    right = function() {
      return cursor.forward();
    };
    left = function() {
      return cursor.back();
    };
    insertMode = function() {
      return cursor.isInsertMode = true;
    };
    escapeMode = function() {
      return cursor.isInsertMode = false;
    };
    backspace = function() {
      return stdout.write(cursor.characters.deleteLeft);
    };
    deleteRecord = function(row, column) {
      cursor.up();
      return console.log("DELETING RECORD: " + buffer[row], row, column, buffer.length);
    };
    _.extend(cursor, {
      characters: {
        backspace: '\b',
        tab: '\t',
        verticalTab: '\v',
        newline: '\n',
        formFeed: '\f',
        carriageReturn: '\r',
        up: 'A',
        down: 'B',
        right: 'C',
        left: 'D',
        clearLine: '\u001b[K',
        deleteRight: '\u001b[1P',
        deleteLeft: '\u001b[1X',
        insertCharacter: '\u001b[1@',
        insertLine: '\u001b[1L',
        deleteLine: '\u001b[1M'
      },
      position: function(callback) {
        process.stdin.once('data', function(b) {
          var column, match, row, _ref;
          match = /\[(\d+)\;(\d+)R$/.exec(b.toString());
          if (match) {
            _ref = match.slice(1, 3).map(Number), row = _ref[0], column = _ref[1];
          }
          return callback(null, row, column);
        });
        return cursor.queryPosition();
      }
    });
    listener = function(chunk, key) {
      var _this = this;
      if (key.ctrl && key.name === 'c') {
        stdin.setRawMode(wasRaw);
        process.nextTick(process.exit);
        return;
      }
      switch (key.name) {
        case 'up':
          return up();
        case 'down':
          return down();
        case 'right':
          return right();
        case 'left':
          return left();
        case 'i':
          return insertMode();
        case 'esc':
          return commandMode();
        case 'backspace':
          return backspace();
        case 'd':
          return cursor.position(function(error, row, column) {
            return deleteRecord(row, column);
          });
      }
    };
    if (rl.emitKeypressEvents) {
      rl.emitKeypressEvents(stdin);
    }
    keypressListeners = stdin.listeners('keypress');
    oldKeypressListeners = keypressListeners.splice(0);
    stdin.on('keypress', listener);
    x = rl.createInterface(stdin, stdout, null);
    x.on('line', function(cmd) {
      return console.log('You just typed: ' + cmd);
    });
    app = Tower.Application.instance();
    app.isConsole = true;
    return app.initialize(function() {
      var Model, columns, fetch, fields, limit, modelClassName, order, page, select, where, _ref;
      app.stack();
      _ref = _this.program, select = _ref.select, where = _ref.where, order = _ref.order, limit = _ref.limit, page = _ref.page, modelClassName = _ref.modelClassName;
      Model = Tower.constant(modelClassName);
      fields = _.keys(Model.fields());
      if (select.length) {
        fields = _.intersection(select, fields);
      }
      columns = _.map(fields, function(i) {
        return i.length;
      });
      fetch = function(done) {
        return Model.where(where).order(order).limit(limit).page(page).all(done);
      };
      return fetch(function(error, records) {
        var Table, recordIndex, rows, table;
        Table = require('cli-table');
        table = new Table({
          head: fields
        });
        ({
          colWidths: columns
        });
        records.forEach(function(record) {
          var properties;
          properties = _.map(record.getEach(fields), function(i) {
            return String(i);
          });
          return table.push(properties);
        });
        table = table.toString();
        rows = table.split('\n');
        recordIndex = -1;
        rows.forEach(function(row, i) {
          console.log(row);
          if (i > 2 && (i % 2 === 0)) {
            return rows[i] = records[recordIndex++];
          }
        });
        return process.nextTick(process.exit);
      });
    });
  });

  return CommandDatabase;

})();

module.exports = Tower.CommandDatabase;
