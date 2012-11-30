var _,
  __slice = [].slice;

_ = Tower._;

Tower.GeneratorShell = {
  sayStatus: function(status, color) {
    if (this.options.verbose) {
      return console.log(status);
    }
  },
  promptMultiline: function() {
    var args, key, _ref;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.program).prompt.apply(_ref, ["" + key + ":"].concat(__slice.call(args)));
  },
  prompt: function() {
    var args, key, _ref;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.program).prompt.apply(_ref, ["" + key + ": "].concat(__slice.call(args)));
  },
  choose: function(description, list, callback) {
    console.log(description);
    return this.program.choose(list, callback);
  }
};

module.exports = Tower.GeneratorShell;
