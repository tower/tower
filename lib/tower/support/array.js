var nativeIndexOf;

nativeIndexOf = Array.prototype.indexOf;

Tower.Support.Array = {
  toStringIndexOf: function(array, item, isSorted) {
    var i, l;
    if (array == null) {
      return -1;
    }
    i = 0;
    l = array.length;
    while (i < l) {
      if (i in array && array[i] && item && array[i].toString() === item.toString()) {
        return i;
      }
      i++;
    }
    return -1;
  },
  extractOptions: function(args) {
    if (typeof args[args.length - 1] === "object") {
      return args.pop();
    } else {
      return {};
    }
  },
  extractBlock: function(args) {
    if (typeof args[args.length - 1] === "function") {
      return args.pop();
    } else {
      return null;
    }
  },
  args: function(args, index, withCallback, withOptions) {
    if (index == null) {
      index = 0;
    }
    if (withCallback == null) {
      withCallback = false;
    }
    if (withOptions == null) {
      withOptions = false;
    }
    args = Array.prototype.slice.call(args, index, args.length);
    if (withCallback && !(args.length >= 2 && typeof args[args.length - 1] === "function")) {
      throw new Error("You must pass a callback to the render method");
    }
    return args;
  },
  sortBy: function(objects) {
    var arrayComparator, callbacks, sortings, valueComparator;
    sortings = this.args(arguments, 1);
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
        aValue = a.get(attribute);
        bValue = b.get(attribute);
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
