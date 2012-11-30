var _;

_ = Tower._;

Tower.ControllerNet = {
  ip: Ember.computed(function() {
    return this.request.ip;
  }).cacheable(),
  encodeContent: function(string, from, to) {
    var Buffer, Iconv, buffer, iconv;
    Buffer = require('buffer').Buffer;
    Iconv = require('iconv').Iconv;
    to = to.toUpperCase();
    if (to === 'ISO-8859-1') {
      to += '//TRANSLIT';
    }
    iconv = new Iconv(from.toUpperCase(), to);
    buffer = iconv.convert(string);
    return buffer.toString();
  },
  setContentType: function(type, encoding) {
    if (encoding == null) {
      encoding = this.encoding;
    }
    if (encoding != null) {
      type += "; charset=" + encoding;
    }
    return this.headers['Content-Type'] = type;
  },
  getContentType: function() {
    return this.headers['Content-Type'];
  },
  head: function(status, options) {
    var location;
    if (options == null) {
      options = {};
    }
    if (typeof status === 'object') {
      options = status;
      status = null;
    }
    status || (status = options.status || 'ok');
    location = options.location;
    delete options.status;
    delete options.location;
    this.status = status;
    if (location) {
      this.location = Tower.urlFor(location);
    }
    if (this.formats) {
      this.headers['Content-Type'] = require('mime').lookup(this.formats[0]);
    }
    this.body = ' ';
    return this.response.end();
  }
};

module.exports = Tower.ControllerNet;
