var _;

_ = Tower._;

Tower.StoreTransportAjax = {
  requests: [],
  enabled: true,
  pending: false,
  requesting: false,
  defaults: {
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    async: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  ajax: function(params, defaults) {
    return $.ajax(this.serializeParams(params, defaults));
  },
  serializeParams: function(params, defaults) {
    params = _.extend({}, this.defaults, defaults, params);
    if (params.type === 'GET' && params.dataType === 'json') {
      params = this._adjustParamsForJSONP(params);
    }
    return params;
  },
  _adjustParamsForJSONP: function(params) {
    var callbackParam, separator;
    params.dataType = 'jsonp';
    delete params.contentType;
    if (!params.url.match(/[\?\&]callback=.+/)) {
      callbackParam = 'callback=?';
      separator = params.url.match(/\?/) ? '&' : '?';
      params.url = "" + params.url + separator + callbackParam;
    }
    return params;
  },
  toJSON: function(record, method, format) {
    var data;
    data = {};
    data[_.camelize(record.constructor.toKey(), true)] = record;
    data._method = method;
    data.format = format;
    return JSON.stringify(data);
  },
  disable: function(callback) {
    if (this.enabled) {
      this.enabled = false;
      callback();
      return this.enabled = true;
    } else {
      return callback();
    }
  },
  requestNext: function() {
    var next;
    next = this.requests.shift();
    if (next) {
      return this.request(next);
    } else {
      return this.pending = false;
    }
  },
  request: function(callback) {
    var _this = this;
    this.requesting = true;
    return callback().complete(function() {
      _this.requesting = false;
      return _this.requestNext();
    });
  },
  queue: function(callback) {
    if (!this.enabled) {
      return;
    }
    if (this.pending) {
      this.requests.push(callback);
    } else {
      this.pending = true;
      this.request(callback);
    }
    return callback;
  },
  success: function(record, options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return function(data, status, xhr) {
      var _ref;
      _this.disable(function() {
        if (data && !_.isBlank(data)) {
          return record.updateAttributes(data, {
            sync: false
          });
        }
      });
      return (_ref = options.success) != null ? _ref.apply(_this.record) : void 0;
    };
  },
  failure: function(record, callback) {
    var _this = this;
    return function(xhr, statusText, error) {
      var json;
      json = (function() {
        try {
          return JSON.parse(xhr.responseText);
        } catch (_error) {}
      })();
      json || (json = {});
      json.status || (json.status = xhr.status);
      json.statusText || (json.statusText = statusText);
      json.message || (json.message = error);
      if (callback) {
        return callback.call(_this, json);
      }
    };
  },
  create: function(records, callback) {
    var record, _i, _len, _results,
      _this = this;
    records = _.toArray(records);
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      _results.push((function(record) {
        return _this.queue(function() {
          var params;
          params = {
            url: _this.urlForCreate(record),
            type: 'POST',
            data: _this.toJSON(record)
          };
          return _this.ajax({}, params).success(_this.createSuccess(record, callback)).error(_this.createFailure(record, callback));
        });
      })(record));
    }
    return _results;
  },
  urlForCreate: function(record) {
    return Tower.urlFor(record.constructor);
  },
  createSuccess: function(record, callback) {
    var _this = this;
    return function(data, status, xhr) {
      record.setProperties(data);
      if (callback) {
        return callback.call(_this, null, record);
      }
    };
  },
  createFailure: function(record, callback) {
    return this.failure(record, callback);
  },
  update: function(records, callback) {
    var record, _i, _len, _results,
      _this = this;
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      _results.push((function(record) {
        return _this.queue(function() {
          var data, params;
          data = {};
          data[_.camelize(record.constructor.toKey(), true)] = record.get('dirtyAttributes');
          data._method = 'PUT';
          data.format = 'json';
          params = {
            type: 'PUT',
            data: JSON.stringify(data),
            url: _this.urlForUpdate(record)
          };
          return _this.ajax({}, params).success(_this.updateSuccess(record, callback)).error(_this.updateFailure(record, callback));
        });
      })(record));
    }
    return _results;
  },
  urlForUpdate: function(record) {
    return Tower.urlFor(record);
  },
  updateSuccess: function(record, callback) {
    var _this = this;
    return function(data, status, xhr) {
      record.setProperties(data);
      if (callback) {
        return callback.call(_this, null, record);
      }
    };
  },
  updateFailure: function(record, callback) {
    return this.failure(record, callback);
  },
  destroy: function(records, callback) {
    var record, _i, _len, _results,
      _this = this;
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      _results.push((function(record) {
        return _this.queue(function() {
          var params;
          params = {
            url: _this.urlForDestroy(record),
            type: 'POST',
            data: JSON.stringify({
              format: 'json',
              _method: 'DELETE'
            })
          };
          return _this.ajax({}, params).success(_this.destroySuccess(record, callback)).error(_this.destroyFailure(record, callback));
        });
      })(record));
    }
    return _results;
  },
  urlForDestroy: function(record) {
    return Tower.urlFor(record);
  },
  destroySuccess: function(record, callback) {
    var _this = this;
    return function(data, status, xhr) {
      if (callback) {
        return callback.call(_this, null, record);
      }
    };
  },
  destroyFailure: function(record, callback) {
    return this.failure(record, callback);
  },
  findSuccess: function(cursor, callback) {
    var _this = this;
    return function(data, status, xhr) {
      data = cursor.model.load(data);
      if (callback) {
        return callback(null, data);
      }
    };
  },
  findFailure: function(cursor, callback) {
    return this.failure(cursor, callback);
  },
  find: function(cursor, callback) {
    var params, records,
      _this = this;
    params = this.serializeParamsForFind(cursor);
    records = void 0;
    this.queue(function() {
      return _this.ajax(params).success(_this.findSuccess(cursor, function(error, data) {
        if (callback) {
          callback.call(_this, error, data);
        }
        return records = data;
      })).error(_this.findFailure(cursor, callback));
    });
    return records;
  },
  serializeParamsForFind: function(cursor) {
    var data, url;
    url = this.urlForIndex(cursor.model);
    data = cursor.toParams();
    data.format = 'json';
    return {
      type: 'GET',
      data: $.param(data),
      url: url
    };
  },
  urlForIndex: function(model) {
    return Tower.urlFor(model);
  },
  findOne: function(cursor, callback) {
    var params, records,
      _this = this;
    params = this.serializeParamsForFindOne(cursor);
    records = void 0;
    this.queue(function() {
      return _this.ajax(params).success(_this.findSuccess(cursor, function(error, data) {
        data = (function() {
          try {
            return data[0];
          } catch (_error) {}
        })();
        if (callback) {
          callback.call(_this, error, data);
        }
        return records = data;
      })).error(_this.findFailure(cursor, callback));
    });
    return records;
  },
  serializeParamsForFindOne: function(cursor) {
    var data, url;
    data = cursor.toParams();
    delete data.limit;
    url = this.urlForShow(cursor.model, data.conditions.id);
    data.format = 'json';
    return {
      type: 'GET',
      data: $.param(data),
      url: url
    };
  },
  urlForShow: function(model, id) {
    return Tower.urlFor(model) + '/' + id;
  }
};

module.exports = Tower.StoreTransportAjax;
