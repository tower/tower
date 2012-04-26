var __slice = [].slice;

Tower.View.Component = (function() {

  Component.name = 'Component';

  Component.render = function() {
    var args, block, options, template;
    args = _.args(arguments);
    template = args.shift();
    block = _.extractBlock(args);
    if (!(args[args.length - 1] instanceof Tower.Model || typeof args[args.length - 1] !== "object")) {
      options = args.pop();
    }
    options || (options = {});
    options.template = template;
    return (new this(args, options)).render(block);
  };

  function Component(args, options) {
    var key, value;
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
  }

  Component.prototype.tag = function() {
    var args, key;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.template.tag(key, args);
  };

  Component.prototype.addClass = function(string, args) {
    var arg, result, _i, _len;
    result = string ? string.split(/\s+/g) : [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      if (!arg) {
        continue;
      }
      if (!(result.indexOf(arg) > -1)) {
        result.push(arg);
      }
    }
    return result.join(" ");
  };

  return Component;

})();
