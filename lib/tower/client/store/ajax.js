var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Ajax = (function(_super) {
  var sync;

  __extends(Ajax, _super);

  Ajax.requests = [];

  Ajax.enabled = true;

  Ajax.pending = false;

  function Ajax() {
    Ajax.__super__.constructor.apply(this, arguments);
    this.deleted = {};
  }

  Ajax.defaults = {
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  Ajax.ajax = function(params, defaults) {
    return $.ajax($.extend({}, this.defaults, defaults, params));
  };

  Ajax.toJSON = function(record, format, method) {
    var data;
    data = {};
    data[Tower.Support.String.camelize(record.constructor.name, true)] = record;
    data.format = format;
    data._method = method;
    return JSON.stringify(data);
  };

  Ajax.disable = function(callback) {
    if (this.enabled) {
      this.enabled = false;
      callback();
      return this.enabled = true;
    } else {
      return callback();
    }
  };

  Ajax.requestNext = function() {
    var next;
    next = this.requests.shift();
    if (next) {
      return this.request(next);
    } else {
      return this.pending = false;
    }
  };

  Ajax.request = function(callback) {
    var _this = this;
    return (callback()).complete(function() {
      return _this.requestNext();
    });
  };

  Ajax.queue = function(callback) {
    if (!this.enabled) return;
    if (this.pending) {
      this.requests.push(callback);
    } else {
      this.pending = true;
      this.request(callback);
    }
    return callback;
  };

  Ajax.prototype.success = function(record, options) {
    var _this = this;
    if (options == null) options = {};
    return function(data, status, xhr) {
      var _ref;
      Ajax.disable(function() {
        if (data && !_.isBlank(data)) {
          return record.updateAttributes(data, {
            sync: false
          });
        }
      });
      return (_ref = options.success) != null ? _ref.apply(_this.record) : void 0;
    };
  };

  Ajax.prototype.failure = function(record, options) {
    var _this = this;
    if (options == null) options = {};
    return function(xhr, statusText, error) {
      var _ref;
      return (_ref = options.error) != null ? _ref.apply(record) : void 0;
    };
  };

  Ajax.prototype.queue = function(callback) {
    return this.constructor.queue(callback);
  };

  Ajax.prototype.request = function() {
    var _ref;
    return (_ref = this.constructor).request.apply(_ref, arguments);
  };

  Ajax.prototype.ajax = function() {
    var _ref;
    return (_ref = this.constructor).ajax.apply(_ref, arguments);
  };

  Ajax.prototype.toJSON = function() {
    var _ref;
    return (_ref = this.constructor).toJSON.apply(_ref, arguments);
  };

  Ajax.prototype.create = function(data, options, callback) {
    var _this = this;
    if (options.sync !== false) {
      return Ajax.__super__.create.call(this, data, options, function(error, records) {
        if (callback) callback.call(_this, error, records);
        return _this.createRequest(records, options);
      });
    } else {
      return Ajax.__super__.create.apply(this, arguments);
    }
  };

  Ajax.prototype.update = function(updates, query, options, callback) {
    var _this = this;
    if (options.sync === true) {
      return Ajax.__super__.update.call(this, updates, query, options, function(error, result) {
        if (callback) callback.call(_this, error, result);
        return _this.updateRequest(result, options);
      });
    } else {
      return Ajax.__super__.update.apply(this, arguments);
    }
  };

  Ajax.prototype.destroy = function(query, options, callback) {
    var _this = this;
    if (options.sync !== false) {
      return Ajax.__super__.destroy.call(this, query, options, function(error, result) {
        return _this.destroyRequest(result, options);
      });
    } else {
      return Ajax.__super__.destroy.apply(this, arguments);
    }
  };

  Ajax.prototype.createRequest = function(records, options) {
    var json,
      _this = this;
    if (options == null) options = {};
    json = this.toJSON(records);
    Tower.urlFor(records.constructor);
    return this.queue(function() {
      var params;
      params = {
        url: url,
        type: "POST",
        data: json
      };
      return _this.ajax(options, params).success(_this.createSuccess(records)).error(_this.createFailure(records));
    });
  };

  Ajax.prototype.createSuccess = function(record) {
    var _this = this;
    return function(data, status, xhr) {
      var id;
      id = record.id;
      record = _this.find(id);
      _this.records[data.id] = record;
      delete _this.records[id];
      return record.updateAttributes(data);
    };
  };

  Ajax.prototype.createFailure = function(record) {
    return this.failure(record);
  };

  Ajax.prototype.updateRequest = function(record, options, callback) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "PUT",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.updateSuccess(record)).error(_this.updateFailure(record));
    });
  };

  Ajax.prototype.updateSuccess = function(record) {
    var _this = this;
    return function(data, status, xhr) {
      record = Tower.constant(_this.className).find(record.id);
      return record.updateAttributes(data);
    };
  };

  Ajax.prototype.updateFailure = function(record) {
    var _this = this;
    return function(xhr, statusText, error) {};
  };

  Ajax.prototype.destroyRequest = function(record, options, callback) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "DELETE",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.destroySuccess(record)).error(_this.destroyFailure(record));
    });
  };

  Ajax.prototype.destroySuccess = function(data) {
    var _this = this;
    return function(data, status, xhr) {
      return delete _this.deleted[data.id];
    };
  };

  Ajax.prototype.destroyFailure = function(record) {
    var _this = this;
    return function(xhr, statusText, error) {};
  };

  Ajax.prototype.findRequest = function(options) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "GET",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
    });
  };

  Ajax.prototype.findSuccess = function(options) {
    var _this = this;
    return function(data, status, xhr) {
      if (_.isPresent(data)) return _this.load(data);
    };
  };

  Ajax.prototype.findFailure = function(record) {
    var _this = this;
    return function(xhr, statusText, error) {};
  };

  Ajax.prototype.findOneRequest = function(options, callback) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "GET",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
    });
  };

  Ajax.prototype.findOneSuccess = function(options) {
    var _this = this;
    return function(data, status, xhr) {};
  };

  Ajax.prototype.findOneFailure = function(options) {
    var _this = this;
    return function(xhr, statusText, error) {};
  };

  sync = function() {
    var _this = this;
    return this.all(function(error, records) {
      var changes, record, _i, _len;
      changes = {
        create: [],
        update: [],
        destroy: []
      };
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        if (record.syncAction) changes[record.syncAction].push(record);
      }
      if (changes.create != null) _this.createRequest(changes.create);
      if (changes.update != null) _this.updateRequest(changes.update);
      if (changes.destroy != null) _this.destroyRequest(changes.destroy);
      return true;
    });
  };

  Ajax.prototype.refresh = function() {};

  Ajax.prototype.fetch = function() {};

  return Ajax;

})(Tower.Store.Memory);
