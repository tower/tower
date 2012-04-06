var accounting, cardType, casting, check, format, moment, name, phoneFormats, postalCodeFormats, sanitize, sanitizing, validating, validator, _fn, _i, _len, _ref;

validator = require('validator');

check = validator.check;

sanitize = validator.sanitize;

require('validator').Validator.prototype.error = function(msg) {
  this._errors.push(msg);
  return this;
};

accounting = require('accounting');

moment = require('moment');

phoneFormats = {
  us: ["###-###-####", "##########", "###\\.###\\.####", "### ### ####", "\\(###\\) ###-####"],
  brazil: ["## ####-####", "\\(##\\) ####-####", "##########"],
  france: ["## ## ## ## ##"],
  uk: ["#### ### ####"]
};

for (name in phoneFormats) {
  format = phoneFormats[name];
  phoneFormats[name] = new RegExp("^" + (format.join('|').replace(/#/g, '\\d')) + "$", "i");
}

postalCodeFormats = {
  us: ['#####', '#####-####'],
  pt: ['####', '####-###']
};

for (name in postalCodeFormats) {
  format = postalCodeFormats[name];
  postalCodeFormats[name] = new RegExp("^" + (format.join('|').replace(/#/g, '\\d')) + "$", "i");
}

casting = {
  toInt: function(value) {
    return sanitize(value).toInt();
  },
  toBoolean: function(value) {
    return sanitize(value).toBoolean();
  },
  toFixed: function() {
    return accounting.toFixed.apply(accounting, arguments);
  },
  formatCurrency: function() {
    return accounting.formatMoney.apply(accounting, arguments);
  },
  formatNumber: function() {
    return accounting.formatNumber.apply(accounting, arguments);
  },
  unformatCurrency: function() {
    return accounting.unformat.apply(accounting, arguments);
  },
  unformatCreditCard: function(value) {
    return value.toString().replace(/[- ]/g, '');
  },
  strftime: function(time, format) {
    return moment(time).format(format);
  },
  now: function() {
    return moment()._d;
  },
  endOfDay: function(value) {
    return _(moment(value).eod()._d);
  },
  endOfWeek: function(value) {},
  endOfMonth: function() {},
  endOfQuarter: function() {},
  endOfYear: function() {},
  beginningOfDay: function(value) {
    return _(moment(value).sod()._d);
  },
  beginningOfWeek: function() {},
  beginningOfMonth: function() {},
  beginningOfQuarter: function() {},
  beginningOfYear: function() {},
  midnight: function() {},
  toDate: function(value) {
    return moment(value)._d;
  },
  withDate: function(value) {
    return moment(value);
  },
  days: function(value) {
    return _(value * 24 * 60 * 60 * 1000);
  },
  fromNow: function(value) {
    return _(moment().add('milliseconds', value)._d);
  },
  ago: function(value) {
    return _(moment().subtract('milliseconds', value)._d);
  },
  toHuman: function(value) {
    return moment(value).from();
  },
  humanizeDuration: function(from, as) {
    if (as == null) as = 'days';
    if (from._wrapped) from = from.value();
    return moment.humanizeDuration(from, 'milliseconds');
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

validating = {
  isEmail: function(value) {
    var result;
    try {
      result = check(value).isEmail();
    } catch (_error) {}
    if (!result._errors.length) return true;
    return result;
  },
  isUUID: function(value) {
    var result;
    try {
      result = check(value).isUUID();
    } catch (_error) {}
    if (!result._errors.length) return true;
    return result;
  },
  isAccept: function(value, param) {
    param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
    return !!value.match(new RegExp(".(" + param + ")$", "i"));
  },
  isPhone: function(value, options) {
    var pattern;
    if (options == null) options = {};
    pattern = phoneFormats[options.format] || /^\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4}|\d{10}|\d{3}\s\d{3}\s\d{4}|\(\d{3}\)\s\d{3}-\d{4}$/i;
    return !!value.toString().match(pattern);
  },
  isMasterCard: function(value) {
    return _.isLuhn(value) && !!value.match(/^5[1-5].{14}/);
  },
  isAmex: function(value) {
    return _.isLuhn(value) && !!value.match(/^3[47].{13}/);
  },
  isVisa: function(value) {
    return _.isLuhn(value) && !!value.match(/^4.{15}/);
  },
  isLuhn: function(value) {
    var digit, i, length, number, parity, total;
    if (!value) return false;
    number = value.toString().replace(/\D/g, "");
    length = number.length;
    parity = length % 2;
    total = 0;
    i = 0;
    while (i < length) {
      digit = number.charAt(i);
      if (i % 2 === parity) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      total += parseInt(digit);
      i++;
    }
    return total % 10 === 0;
  },
  isWeakPassword: function(value) {
    return !!value.match(/(?=.{6,}).*/g);
  },
  isMediumPassword: function(value) {
    return !!value.match(/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/);
  },
  isStrongPassword: function(value) {
    return !!value.match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/);
  },
  isPostalCode: function(value, country) {
    if (country == null) country = 'us';
    return !!value.match(postalCodeFormats[country]);
  },
  isSlug: function(value) {
    return value === _.parameterize(value);
  }
};

_ref = ['DinersClub', 'EnRoute', 'Discover', 'JCB', 'CarteBlanche', 'Switch', 'Solo', 'Laser'];
_fn = function(cardType) {
  return validating["is" + cardType] = function(value) {
    return _.isLuhn(value);
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  cardType = _ref[_i];
  _fn(cardType);
}

_.mixin(casting);

_.mixin(sanitizing);

_.mixin(validating);
