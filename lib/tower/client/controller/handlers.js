
Tower.Controller.Handlers = {
  ClassMethods: {
    submitHandler: function(name, handler, options) {
      var _this = this;
      return $(this.dispatcher).on(name, function(event) {
        var action, elements, form, method, params, target;
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
        return _this._dispatch(handler, {
          elements: elements,
          params: params
        });
      });
    }
  }
};

module.exports = Tower.Controller.Handlers;
