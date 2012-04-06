var casting, check, sanitize, sanitizing, validator;

validator = require('validator');

check = validator.check;

sanitize = validator.sanitize;

casting = {
  toInt: function(value) {
    return sanitize(value).toInt();
  },
  toBoolean: function(value) {
    return sanitize(value).toBoolean();
  }
};

sanitizing = {
  trim: function(value) {
    return sanitize(value).trim();
  },
  ltrim: function(value, trim) {
    return sanitize(value).ltrim(trim);
  },
  rtrim: function(value, trim) {
    return sanitize(value, trim).rtrim(trim);
  },
  xss: function(value) {
    return sanitize(value).xss();
  },
  entityDecode: function(value) {
    return sanitize(value).entityDecode();
  },
  "with": function(value) {
    return sanitize(value).chain();
  }
};

_.mixin(casting);

_.mixin(sanitizing);
