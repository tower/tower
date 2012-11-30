var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __slice = [].slice;

Tower.ViewComponent = (function() {

  __defineStaticProperty(ViewComponent,  "render", function() {
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
  });

  function ViewComponent(args, options) {
    var key, value;
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
  }

  __defineProperty(ViewComponent,  "tag", function() {
    var args, key;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.template.tag(key, _.compact(args));
  });

  __defineProperty(ViewComponent,  "addClass", function(string, args) {
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
  });

  return ViewComponent;

})();
