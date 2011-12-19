
  Coach.View.ElementHelper = {
    elementId: function() {
      return "#" + (this.elementKey.apply(this, arguments));
    },
    elementClass: function() {
      return "." + (this.elementKey.apply(this, arguments));
    },
    elementKey: function() {
      return Coach.Support.String.parameterize(this.elementNameComponents.apply(this, arguments).join("-"));
    },
    elementName: function() {
      var i, item, result, _len;
      result = this.elementNameComponents.apply(this, arguments);
      i = 1;
      for (i = 0, _len = result.length; i < _len; i++) {
        item = result[i];
        result[i] = "[" + item + "]";
      }
      return Coach.Support.String.parameterize(result.join(""));
    },
    elementNameComponents: function() {
      var args, item, result, _i, _len;
      args = Coach.Support.Array.args(arguments);
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
