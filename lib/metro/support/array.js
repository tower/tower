(function() {
  Metro.Support.Array = {
    extractArgs: function(args) {
      return Array.prototype.slice.call(args, 0, args.length);
    },
    extractArgsAndOptions: function(args) {
      args = Array.prototype.slice.call(args, 0, args.length);
      if (typeof args[args.length - 1] !== 'object') {
        args.push({});
      }
      return args;
    },
    args: function(args) {
      var options;
      args = Array.prototype.slice.call(args, 0, args.length);
      if (typeof args[args.length - 1] !== 'object') {
        options = {};
      } else {
        options = args.pop();
      }
      return {
        args: args,
        options: options
      };
    },
    argsOptionsAndCallback: function() {
      var args, callback, last, options;
      args = Array.prototype.slice.call(arguments);
      last = args.length - 1;
      if (typeof args[last] === "function") {
        callback = args[last];
        if (args.length >= 3) {
          if (typeof args[last - 1] === "object") {
            options = args[last - 1];
            args = args.slice(0, (last - 2 + 1) || 9e9);
          } else {
            options = {};
            args = args.slice(0, (last - 1 + 1) || 9e9);
          }
        } else {
          options = {};
        }
      } else if (args.length >= 2 && typeof args[last] === "object") {
        args = args.slice(0, (last - 1 + 1) || 9e9);
        options = args[last];
        callback = null;
      } else {
        options = {};
        callback = null;
      }
      return [args, options, callback];
    },
    sortBy: function(objects) {
      var arrayComparator, callbacks, sortings, valueComparator;
      sortings = Array.prototype.slice.call(arguments, 1, arguments.length);
      callbacks = sortings[sortings.length - 1] instanceof Array ? {} : sortings.pop();
      valueComparator = function(x, y) {
        if (x > y) {
          return 1;
        } else {
          if (x < y) {
            return -1;
          } else {
            return 0;
          }
        }
      };
      arrayComparator = function(a, b) {
        var x, y;
        x = [];
        y = [];
        sortings.forEach(function(sorting) {
          var aValue, attribute, bValue, direction;
          attribute = sorting[0];
          direction = sorting[1];
          aValue = a[attribute];
          bValue = b[attribute];
          if (typeof callbacks[attribute] !== "undefined") {
            aValue = callbacks[attribute](aValue);
            bValue = callbacks[attribute](bValue);
          }
          x.push(direction * valueComparator(aValue, bValue));
          return y.push(direction * valueComparator(bValue, aValue));
        });
        if (x < y) {
          return -1;
        } else {
          return 1;
        }
      };
      sortings = sortings.map(function(sorting) {
        if (!(sorting instanceof Array)) {
          sorting = [sorting, "asc"];
        }
        if (sorting[1] === "desc") {
          sorting[1] = -1;
        } else {
          sorting[1] = 1;
        }
        return sorting;
      });
      return objects.sort(function(a, b) {
        return arrayComparator(a, b);
      });
    }
  };
  module.exports = Metro.Support.Array;
}).call(this);
