
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
    clickHandler: function(name, handler, options) {
      var _this = this;
      return $(this.dispatcher).on(name, function(event) {});
    },
    submitHandler: function(name, handler, options) {
      var _this = this;
      return $(this.dispatcher).on(name, function(event) {
        var action, elements, form, method, params, target;
        try {
          target = $(event.target);
          form = target.closest("form");
          action = form.attr("action");
          method = (form.attr("data-method") || form.attr("method")).toUpperCase();
          params = form.serializeParams();
          params.method = method;
          params.action = action;
          elements = _.extend({
            target: target,
            form: form
          }, {});
          _this._dispatch(handler, {
            elements: elements,
            params: params
          });
        } catch (error) {
          console.log(error);
        }
        return false;
      });
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
