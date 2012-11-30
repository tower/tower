var _;

_ = Tower._;

Tower.ControllerCaching = {
  etag: function(content) {
    return require('express/lib/utils').etag(content);
  },
  isConditionalGET: Ember.computed(function() {
    return require('connect').utils.conditionalGET(this.request);
  }).cacheable(),
  _freshWhenOptions: function(record, options) {
    var defaultOptions;
    if (_.isHash(record)) {
      options = record;
    } else {
      defaultOptions = {
        etag: record,
        lastModified: record.get('updatedAt')
      };
      if (options) {
        options = _.defaults(options, defaultOptions);
      } else {
        options = defaultOptions;
      }
    }
    return options;
  },
  setDefaultCacheControl: function() {
    var cacheControl, extras, maxAge, response, value;
    response = this.response;
    cacheControl = response.cacheControl;
    if (response.get('cache-control') != null) {
      return;
    }
    if (_.isBlank(cacheControl)) {
      value = 'max-age=0, private, must-revalidate';
    } else if (cacheControl.noCache) {
      value = 'no-cache';
    } else {
      extras = cacheControl.extras;
      maxAge = cacheControl.maxAge;
      value = [];
      if (maxAge != null) {
        value.push("max-age=" + (_.toInt(maxAge)));
      }
      value.push(cacheControl["public"] ? 'public' : 'private');
      if (cacheControl.mustRevalidate) {
        value.push('must-revalidate');
      }
      if (extras) {
        value = value.concat(extras);
      }
      value = value.join(', ');
    }
    return response.set('cache-control', value);
  },
  expiresIn: function(seconds, options) {
    var keys;
    if (options == null) {
      options = {};
    }
    _.extend(this.response.cacheControl, {
      maxAge: seconds,
      "public": !!options["public"],
      mustRevalidate: !!options.mustRevalidate
    });
    delete options["public"];
    delete options.mustRevalidate;
    keys = _.keys(options);
    response.cacheControl.extras = _.map(keys, function(k) {
      return "" + k + "=" + options[k];
    });
    if (!response.get('Date')) {
      return response.set('Date', new Date().toUTCString());
    }
  },
  freshWhen: function(record, options) {
    var request, response;
    options = this._freshWhenOptions(options);
    request = this.request;
    response = this.response;
    if ((options.etag != null) && !response.get('ETag')) {
      response.set('ETag', this.etag(options.etag));
    }
    if (options.hasOwnProperty('public')) {
      response.cacheControl["public"] = options["public"];
    }
    if (options.lastModified && !response.get('Last-Modified')) {
      response.set('Last-Modified', options.lastModified.toUTCString());
    }
    if (!this._requestIsFresh()) {
      return this.head(304);
    }
  },
  isFresh: function(record, options) {
    this.get('isConditionalGET');
    return this.freshWhen(record, options);
  },
  _requestIsFresh: function() {
    return require('fresh')(this.request, this.response);
  },
  store: function() {
    return this._store || (this._store = {});
  }
};

module.exports = Tower.ControllerCaching;
