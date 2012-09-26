
Tower.ControllerHandlers = {
  ClassMethods: {
    clickHandler: function(name, handler, options) {
      var effect, elementObject, key, value,
        _this = this;
      if (options == null) {
        options = {};
      }
      elementObject = options.elements;
      delete options.elements;
      effect = options.effect;
      delete options.effect;
      for (key in options) {
        value = options[key];
        if (typeof value !== 'string') {
          options[key] = "data-" + key;
        }
      }
      return $(this.dispatcher).on(name, options.target, function(event) {
        var element, elements, params;
        element = $(event.currentTarget);
        params = {};
        for (key in options) {
          value = options[key];
          value = element.attr(value);
          if (value != null) {
            params[key] = value;
          }
        }
        if (elementObject) {
          elements = {};
          for (key in elementObject) {
            value = elementObject[key];
            elements[key] = element.find(value);
          }
        }
        if (effect) {
          if (typeof effect === 'string') {
            element[effect]();
          } else {
            element.animate(effect);
          }
        }
        return _this._dispatch(event, handler, params);
      });
    },
    submitHandler: function(name, handler, options) {
      var _this = this;
      return $(this.dispatcher).on(name, options.target, function(event) {
        var action, elements, form, method, params, target;
        target = $(event.target);
        form = target.closest("form");
        action = form.attr("action");
        method = (form.attr("data-method") || form.attr("method")).toUpperCase();
        params = form.serializeParams();
        params.method = method;
        params.action = action;
        elements = Tower._.extend({
          target: target,
          form: form
        }, {});
        event.data = {
          elements: elements,
          params: params
        };
        return _this._dispatch(event, handler, event.data);
      });
    }
  },
  redirect: function() {
    return Tower.goTo(Tower.urlFor.apply(Tower, arguments));
  }
};

module.exports = Tower.ControllerHandlers;
