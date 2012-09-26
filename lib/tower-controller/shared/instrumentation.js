var _;

_ = Tower._;

Tower.ControllerInstrumentation = {
  call: function(request, response, next) {
    var accept, acceptFormat, encoding, files, key, params, value, _ref, _ref1, _ref2;
    this.request = request;
    this.response = response;
    this.params = params = request.params || {};
    this.headers = {};
    this.cookies = request.cookies || {};
    this.query = request.query || {};
    this.session = request.session || {};
    if (typeof params.conditions === 'string') {
      params.conditions = JSON.parse(params.conditions);
    }
    if (!params.format) {
      accept = (_ref = this.request) != null ? (_ref1 = _ref.headers) != null ? _ref1['accept'] : void 0 : void 0;
      acceptFormat = accept != null ? accept.split(',') : void 0;
      if (accept === void 0) {
        try {
          params.format = require('mime').extension(request.header('content-type'));
        } catch (_error) {}
      } else {
        try {
          params.format = require('mime').extension(acceptFormat[0]);
        } catch (_error) {}
      }
      params.format || (params.format = 'html');
      if (params.format.toLowerCase() === 'form') {
        params.format = 'html';
      }
    }
    encoding = (_ref2 = request.headers) != null ? _ref2['accept-charset'] : void 0;
    this.encoding = encoding || (encoding = Tower.defaultEncoding);
    if (files = request.files) {
      for (key in files) {
        value = files[key];
        params[key] || (params[key] = {});
        _.extend(params[key], value);
      }
    }
    this.format = params.format;
    this.action = params.action;
    this.callback = next;
    return this.process();
  },
  process: function() {
    var block, complete,
      _this = this;
    if (!Tower.env.match(/(test|production)/)) {
      console.log("  Processing by " + (this.constructor.className()) + "#" + this.action + " as " + (this.format.toUpperCase()) + " (" + this.request.method + ")");
      console.log("  Parameters:", this.params);
    }
    block = function(callback) {
      try {
        return _this[_this.action].call(_this, callback);
      } catch (error) {
        return callback(error);
      }
    };
    complete = function(error) {
      if (error) {
        if (Tower.env === 'development') {
          console.log("Callback failed", error);
        }
        return _this.handleError(error);
      }
    };
    return this.runCallbacks('action', {
      name: this.action
    }, block, complete);
  },
  clear: function() {
    this.request = null;
    return this.response = null;
  },
  metadata: function() {
    return this.constructor.metadata();
  }
};

module.exports = Tower.ControllerInstrumentation;
