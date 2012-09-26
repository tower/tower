var __slice = [].slice;

Tower.ViewElementHelper = {
  title: function(value) {
    return document.title = value;
  },
  addClass: function() {
    var classes, part, parts, string, _i, _len;
    string = arguments[0], parts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    classes = string.split(/\ +/);
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      if (classes.indexOf(part) > -1) {
        classes.push(part);
      }
    }
    return classes.join(" ");
  },
  elementId: function() {
    return "#" + (this.elementKey.apply(this, arguments));
  },
  elementClass: function() {
    return "." + (this.elementKey.apply(this, arguments));
  },
  elementKey: function() {
    return Tower._.parameterize(this.elementNameComponents.apply(this, arguments).join("-"));
  },
  elementName: function() {
    var i, item, result, _i, _len;
    result = this.elementNameComponents.apply(this, arguments);
    i = 1;
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
      item = result[i];
      result[i] = "[" + item + "]";
    }
    return Tower._.parameterize(result.join(""));
  },
  elementNameComponents: function() {
    var args, item, result, _i, _len;
    args = _.args(arguments);
    result = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      item = args[_i];
      switch (typeof item) {
        case "function":
          result.push(item.constructor.name);
          break;
        case "string":
          result.push(item);
          break;
        default:
          result.push(item.toString());
      }
    }
    return result;
  }
};

module.exports = Tower.ViewElementHelper;
