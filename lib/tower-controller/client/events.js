
Tower.ControllerEvents = {
  ClassMethods: {
    DOM_EVENTS: ['click', 'dblclick', 'blur', 'error', 'focus', 'focusIn', 'focusOut', 'hover', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'ready', 'resize', 'scroll', 'select', 'submit', 'tap', 'taphold', 'swipe', 'swipeleft', 'swiperight'],
    dispatcher: global,
    addEventHandler: function(name, handler, options) {
      if (options.type === 'socket' || !name.match(this.DOM_EVENT_PATTERN)) {
        return this.addSocketEventHandler(name, handler, options);
      } else {
        return this.addDomEventHandler(name, handler, options);
      }
    },
    socketNamespace: function() {
      return Tower.SupportString.pluralize(Tower.SupportString.camelize(this.className().replace(/(Controller)$/, ''), false));
    },
    addSocketEventHandler: function(name, handler, options) {
      var _this = this;
      this.io || (this.io = Tower.Application.instance().io.connect('/' + this.socketNamespace()));
      return this.io.on(name, function(data) {
        return _this._dispatch(_this.io, handler, {
          params: data
        });
      });
    },
    addDomEventHandler: function(name, handler, options) {
      var eventType, method, parts, selector,
        _this = this;
      parts = name.split(/\ +/);
      name = parts.shift();
      selector = parts.join(' ');
      if (selector && selector !== '') {
        options.target = selector;
      }
      options.target || (options.target = 'body');
      eventType = name.split(/[\.:]/)[0];
      method = this["" + eventType + "Handler"];
      if (method) {
        method.call(this, name, handler, options);
      } else {
        $(this.dispatcher).on(name, options.target, function(event) {
          return _this._dispatch(event, handler, options);
        });
      }
      return this;
    },
    _dispatch: function(event, handler, options) {
      var controller;
      if (options == null) {
        options = {};
      }
      controller = this.instance();
      controller.elements || (controller.elements = {});
      controller.params || (controller.params = {});
      if (options.params) {
        Tower._.extend(controller.params, options.params);
      }
      if (options.elements) {
        Tower._.extend(controller.elements, options.elements);
      }
      if (typeof handler === 'string') {
        return controller[handler].call(controller, event);
      } else {
        return handler.call(controller, event);
      }
    }
  }
};

Tower.ControllerEvents.ClassMethods.DOM_EVENT_PATTERN = new RegExp("^(" + (Tower.ControllerEvents.ClassMethods.DOM_EVENTS.join("|")) + ")");

module.exports = Tower.ControllerEvents;
