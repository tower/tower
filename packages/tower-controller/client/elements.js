
Tower.ControllerElements = {
  ClassMethods: {
    extractElements: function(target, options) {
      var key, method, result, selector, selectors;
      if (options == null) {
        options = {};
      }
      result = {};
      for (method in options) {
        selectors = options[method];
        for (key in selectors) {
          selector = selectors[key];
          result[key] = target[method](selector);
        }
      }
      return result;
    },
    processElements: function(target, options) {
      if (options == null) {
        options = {};
      }
      return this.elements = this.extractElements(target, options);
    }
  }
};
