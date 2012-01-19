var __slice = Array.prototype.slice;

Tower.View.Component = (function() {

  Component.render = function() {
    var args, block, options, template;
    args = Tower.Support.Array.args(arguments);
    template = args.shift();
    block = Tower.Support.Array.extractBlock(args);
    options = Tower.Support.Array.extractOptions(args);
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

  return Component;

})();
