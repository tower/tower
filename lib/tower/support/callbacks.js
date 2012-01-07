var __slice = Array.prototype.slice;

Tower.Support.Callbacks = {
  ClassMethods: {
    setCallback: function(name) {
      var mapped;
      mapped = null;
      return this._updateCallbacks(name, filter_list, block, function(target, chain, type, filters, options) {
        mapped || (mapped = filters.map(function(filter) {
          return Callback["new"](chain, filter, type, options.dup, self);
        }));
        filters.each(function(filter) {
          return chain.delete_if(function(c) {
            return typeof c.matches === "function" ? c.matches(type, filter) : void 0;
          });
        });
        if (options.prepend) {
          chain.unshift(mapped.reverse);
        } else {
          chain.push(mapped);
        }
        return target["_" + name + "Callbacks"] = chain;
      });
    },
    resetCallbacks: function(name) {},
    _updateCallbacks: function(name, filters, block) {
      var chain, options, target, targets, type, _base, _base2, _i, _len, _results;
      if (filters == null) filters = [];
      if (block == null) block = nil;
      type = (typeof (_base = filters.first)["in"] === "function" ? _base["in"](["before", "after", "around"]) : void 0) ? filters.shift : "before";
      options = (typeof (_base2 = filters.last).is_a === "function" ? _base2.is_a(Hash) : void 0) ? filters.pop : {};
      if (block) filters.unshift(block);
      targets = [this] + Tower.Support.DescendantsTracker.descendants(this);
      _results = [];
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        target = targets[_i];
        chain = target["_" + name + "Callbacks"];
        yield(target, chain.dup, type, filters, options);
        _results.push(target._defineCallback(name));
      }
      return _results;
    },
    defineCallbacks: function() {
      var callbacks, options;
      callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return options = typeof callbacks[callbacks.length - 1] === "object" ? callbacks.pop() : {};
    },
    _defineCallback: function(name) {
      var body;
      body = send("_" + symbol + "_callbacks").compile;
      return this["_run" + (Tower.Support.String.camelize(name)) + "Callbacks"] = function(key, block) {
        if (key == null) key = null;
      };
    }
  },
  runCallbacks: function(kind) {
    return this["_run" + (Tower.Support.String.camelize(kind)) + "Callbacks"];
  }
};

module.exports = Tower.Support.Callbacks;
