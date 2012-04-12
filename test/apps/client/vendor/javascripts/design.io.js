
window.DesignIO = (function() {

  function DesignIO(namespace, options) {
    options || (options = {});
    this.callbacks = {};
    this.watchers = [];
    this.port = options.port || 4181;
    this.namespace = namespace;
    this.url = options.url || ("" + window.location.protocol + "//" + window.location.hostname + ":" + this.port);
    this.socket = io.connect(this.url);
    this.connect();
  }

  DesignIO.prototype.connect = function() {
    var self, socket;
    socket = this.socket;
    self = this;
    return socket.on('connect', function() {
      socket.emit('userAgent', self.userAgent());
      socket.on('watch', function(data) {
        return self.watch(data);
      });
      return socket.on('exec', function(data) {
        return self.exec(data);
      });
    });
  };

  DesignIO.prototype.on = function(name, callback) {
    return this.callbacks[name] = callback;
  };

  DesignIO.prototype.runCallback = function(name, data) {
    if (this.callbacks[name]) this.callbacks[name].call(this, data);
    return true;
  };

  DesignIO.prototype.watch = function(data) {
    var watcher, watchers, _i, _len, _results;
    this.watchers = watchers = JSON.parse(data, this.reviver).body;
    _results = [];
    for (_i = 0, _len = watchers.length; _i < _len; _i++) {
      watcher = watchers[_i];
      watcher.client = this;
      watcher.log = function(data) {
        data.path || (data.path = this.path);
        data.action || (data.action = this.action);
        data.timestamp || (data.timestamp = new Date);
        data.id = this.id;
        return this.client.log(data);
      };
      if (watcher.hasOwnProperty("connect")) {
        _results.push(watcher.connect());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  DesignIO.prototype.exec = function(data) {
    var watcher, watchers, _i, _len;
    data = JSON.parse(data, this.reviver);
    watchers = this.watchers;
    for (_i = 0, _len = watchers.length; _i < _len; _i++) {
      watcher = watchers[_i];
      if (watcher.id === data.id) {
        watcher.path = data.path;
        watcher.action = data.action;
        if (watcher.hasOwnProperty(data.action)) watcher[data.action](data);
      }
    }
    return this.runCallback(data.action, data);
  };

  DesignIO.prototype.log = function(data) {
    if (typeof data === "object") {
      data.userAgent = window.navigator.userAgent;
      data.url = window.location.href;
      data.namespace = this.namespace;
    }
    return this.socket.emit('log', JSON.stringify(data, this.replacer));
  };

  DesignIO.prototype.userAgent = function() {
    return {
      userAgent: window.navigator.userAgent,
      url: window.location.href,
      namespace: this.namespace
    };
  };

  DesignIO.prototype.replacer = function(key, value) {
    if (typeof value === "function") {
      return "(" + value + ")";
    } else {
      return value;
    }
  };

  DesignIO.prototype.reviver = function(key, value) {
    if (typeof value === "string" && !!value.match(/^(?:\(function\s*\([^\)]*\)\s*\{|\(\/)/) && !!value.match(/(?:\}\s*\)|\/\w*\))$/)) {
      return eval(value);
    } else {
      return value;
    }
  };

  return DesignIO;

})();
