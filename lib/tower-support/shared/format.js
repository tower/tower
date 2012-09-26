var _;

_ = Tower._;

(function() {
  var asyncing, cardType, casting, check, format, inflections, name, phoneFormats, postalCodeFormats, sanitize, sanitizing, validating, validator, _fn, _i, _len, _ref;
  validator = Tower.module('validator');
  check = validator.check;
  sanitize = validator.sanitize;
  try {
    validator.Validator.prototype.error = function(msg) {
      this._errors.push(msg);
      return this;
    };
  } catch (error) {
    console.log(error);
  }
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
    xss: function(value) {
      return sanitize(value).xss();
    },
    distance: function() {
      var _ref;
      return (_ref = Tower.module('geo')).getDistance.apply(_ref, arguments);
    },
    toInt: function(value) {
      return sanitize(value).toInt();
    },
    toBoolean: function(value) {
      return sanitize(value).toBoolean();
    },
    toFixed: function() {
      var _ref;
      return (_ref = Tower.module('accounting')).toFixed.apply(_ref, arguments);
    },
    formatCurrency: function() {
      var _ref;
      return (_ref = Tower.module('accounting')).formatMoney.apply(_ref, arguments);
    },
    formatNumber: function() {
      var _ref;
      return (_ref = Tower.module('accounting')).formatNumber.apply(_ref, arguments);
    },
    unformatCurrency: function() {
      var _ref;
      return (_ref = Tower.module('accounting')).unformat.apply(_ref, arguments);
    },
    unformatCreditCard: function(value) {
      return value.toString().replace(/[- ]/g, '');
    },
    strftime: function(time, format) {
      if (time._wrapped) {
        time = time.value();
      }
      return Tower.module('moment')(time).format(format);
    },
    now: function() {
      return _(Tower.module('moment')()._d);
    },
    endOfDay: function(value) {
      return _(Tower.module('moment')(value).eod()._d);
    },
    endOfWeek: function(value) {},
    endOfMonth: function() {},
    endOfQuarter: function() {},
    endOfYear: function() {},
    beginningOfDay: function(value) {
      return _(Tower.module('moment')(value).sod()._d);
    },
    beginningOfWeek: function() {},
    beginningOfMonth: function() {},
    beginningOfQuarter: function() {},
    beginningOfYear: function() {},
    midnight: function() {},
    toDate: function(value) {
      if (value == null) {
        return value;
      }
      return Tower.module('moment')(value)._d;
    },
    withDate: function(value) {
      return Tower.module('moment')(value);
    },
    days: function(value) {
      return _(value * 24 * 60 * 60 * 1000);
    },
    fromNow: function(value) {
      return _(Tower.module('moment')().add('milliseconds', value)._d);
    },
    ago: function(value) {
      return _(Tower.module('moment')().subtract('milliseconds', value)._d);
    },
    toHuman: function(value) {
      return Tower.module('moment')(value).from();
    },
    humanizeDuration: function(from, as) {
      if (as == null) {
        as = 'days';
      }
      if (from._wrapped) {
        from = from.value();
      }
      return Tower.module('moment').humanizeDuration(from, 'milliseconds');
    },
    toS: function(array) {
      return _.map(array, function(item) {
        return item.toString();
      });
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
      result = check(value).isEmail();
      if (!result._errors.length) {
        return true;
      }
      return false;
    },
    isUUID: function(value) {
      var result;
      try {
        result = check(value).isUUID();
      } catch (_error) {}
      if (!result._errors.length) {
        return true;
      }
      return result;
    },
    isAccept: function(value, param) {
      param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
      return !!value.match(new RegExp(".(" + param + ")$", "i"));
    },
    isPhone: function(value, options) {
      var pattern;
      if (options == null) {
        options = {};
      }
      pattern = phoneFormats[options.format] || /^\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4}|\d{10}|\d{3}\s\d{3}\s\d{4}|\(\d{3}\)\s\d{3}-\d{4}$/i;
      return !!value.toString().match(pattern);
    },
    isUri: function(value, options) {
      var pattern;
      if (options == null) {
        options = {};
      }
      pattern = options.protocol !== false ? /^(?:https?:\/\/)(?:[\w]+\.)(?:\.?[\w]{2,})+$/ : /^(?:https?:\/\/)?(?:[\w]+\.)(?:\.?[\w]{2,})+$/;
      return !!value.match(pattern);
    },
    isCreditCard: function(value) {
      return _.isLuhn(value);
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
      if (!value) {
        return false;
      }
      number = value.toString().replace(/\D/g, "");
      length = number.length;
      parity = length % 2;
      total = 0;
      i = 0;
      while (i < length) {
        digit = number.charAt(i);
        if (i % 2 === parity) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
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
      if (country == null) {
        country = 'us';
      }
      return !!value.match(postalCodeFormats[country]);
    },
    isSlug: function(value) {
      return value === _.parameterize(value);
    }
  };
  validating.isUrl = validating.isUri;
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
  inflections = {
    pluralize: function() {
      var _ref1;
      return (_ref1 = Tower.module('inflector')).pluralize.apply(_ref1, arguments);
    },
    singularize: function(name) {
      if (name.match(/ss$/)) {
        return name;
      }
      return Tower.module('inflector').singularize(name);
    },
    camelCase: function(value) {
      return _.camelize(value);
    }
  };
  asyncing = {
    series: function() {
      var _ref1;
      return (_ref1 = Tower.module('async')).series.apply(_ref1, arguments);
    },
    parallel: function() {
      var _ref1;
      return (_ref1 = Tower.module('async')).parallel.apply(_ref1, arguments);
    }
  };
  _.mixin(casting);
  _.mixin(sanitizing);
  _.mixin(inflections);
  _.mixin(validating);
  return _.mixin(asyncing);
})();
