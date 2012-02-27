
Tower.Controller.Elements = {
  ClassMethods: {
    extractElements: function(target, options) {
      var key, method, result, selector, selectors;
      if (options == null) options = {};
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
      if (options == null) options = {};
      return this.elements = this.extractElements(target, options);
    },
    invalidForm: function() {
      var attribute, element, errors, field, _ref, _results;
      element = $("#" + this.resourceName + "-" + this.elementName);
      _ref = this.resource.errors;
      _results = [];
      for (attribute in _ref) {
        errors = _ref[attribute];
        field = $("#" + this.resourceName + "-" + attribute + "-field");
        if (field.length) {
          field.css("background", "yellow");
          _results.push($("input", field).after("<output class='error'>" + (errors.join("\n")) + "</output>"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  }
};

module.exports = Tower.Controller.Elements;
