# validator library
# https://github.com/cesario/activevalidators
# https://github.com/rickharrison/validate.js/blob/master/validate.js
validator   = Tower.modules.validator
check       = validator.check
sanitize    = validator.sanitize
async       = Tower.modules.async

try
  validator.Validator::error = (msg) ->
    @_errors.push(msg)
    @
catch error
  console.log error

# accounting library
# http://josscrowcroft.github.com/accounting.js/
accounting  = Tower.modules.accounting

# date library
# https://github.com/xaviershay/kronic
moment      = Tower.modules.moment

# geo library
geo         = Tower.modules.geo

# inflector
inflector   = Tower.modules.inflector

# others
# - UPS tracking codes: https://www.ups.com/content/us/en/tracking/help/tracking/tnh.html
# https://github.com/zacharyvoase/humanhash

# phone library
# https://github.com/carr/phone (ruby only)
# this is what it's about! 84 bytes :) https://gist.github.com/976805
phoneFormats =
  us:     ["###-###-####", "##########", "###\\.###\\.####", "### ### ####", "\\(###\\) ###-####"]
  brazil: ["## ####-####", "\\(##\\) ####-####", "##########"]
  france: ["## ## ## ## ##"]
  uk:     ["#### ### ####"]
  
for name, format of phoneFormats
  phoneFormats[name] = new RegExp("^#{format.join('|').replace(/#/g, '\\d')}$", "i")
  
postalCodeFormats =
  us: ['#####', '#####-####']
  pt: ['####', '####-###']
  
for name, format of postalCodeFormats
  postalCodeFormats[name] = new RegExp("^#{format.join('|').replace(/#/g, '\\d')}$", "i")
  
casting =
  xss: (value) ->
    sanitize(value).xss()

  distance: ->
    geo.getDistance(arguments...)

  toInt: (value) ->
    sanitize(value).toInt()
    
  toBoolean: (value) ->
    sanitize(value).toBoolean()
    
  toFixed: ->
    accounting.toFixed(arguments...)
    
  formatCurrency: ->
    accounting.formatMoney(arguments...)
    
  formatNumber: ->
    accounting.formatNumber(arguments...)
    
  unformatCurrency: ->
    accounting.unformat(arguments...)
    
  unformatCreditCard: (value) ->
    value.toString().replace(/[- ]/g, '')
    
  strftime: (time, format) ->
    time = time.value() if time._wrapped
    moment(time).format(format)
    
  now: ->
    _ moment()._d
    
  endOfDay: (value) ->
    _ moment(value).eod()._d
    
  endOfWeek: (value) ->
    
  endOfMonth: ->
    
  endOfQuarter: ->
    
  endOfYear: ->
    
  beginningOfDay: (value) ->
    _ moment(value).sod()._d
    
  beginningOfWeek: ->
    
  beginningOfMonth: ->
    
  beginningOfQuarter: ->
    
  beginningOfYear: ->
    
  midnight: ->
    
  toDate: (value) ->
    moment(value)._d
    
  withDate: (value) ->
    moment(value)
    
  days: (value) ->
    _(value * 24 * 60 * 60 * 1000)
    
  fromNow: (value) ->
    _ moment().add('milliseconds', value)._d
    
  ago: (value) ->
    _ moment().subtract('milliseconds', value)._d
    
  toHuman: (value) ->
    moment(value).from()
    
  humanizeDuration: (from, as = 'days') ->
    from = from.value() if from._wrapped
    moment.humanizeDuration(from, 'milliseconds')
    
sanitizing =
  trim: (value) ->
    sanitize(value).trim()
    
  ltrim: (value, trim) ->
    sanitize(value).ltrim(trim)
    
  rtrim: (value, trim) ->
    sanitize(value, trim).rtrim(trim)
    
  xss: (value) ->
    sanitize(value).xss()
    
  entityDecode: (value) ->
    sanitize(value).entityDecode()
    
  with: (value) ->
    sanitize(value).chain()
  
validating =
  isEmail: (value) ->
    result = check(value).isEmail()
    return true unless result._errors.length
    false
    
  isUUID: (value) ->
    try result = check(value).isUUID()
    return true unless result._errors.length
    result
    
  isAccept: (value, param) ->
    param = if typeof param is "string" then param.replace(/,/g, "|") else "png|jpe?g|gif"
    !!value.match(new RegExp(".(#{param})$", "i"))
  
  isPhone: (value, options = {}) ->
    pattern = phoneFormats[options.format] || /^\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4}|\d{10}|\d{3}\s\d{3}\s\d{4}|\(\d{3}\)\s\d{3}-\d{4}$/i
    !!value.toString().match(pattern)
    
  isCreditCard: (value) ->
    _.isLuhn(value)
    
  isMasterCard: (value) ->
    _.isLuhn(value) && !!value.match(/^5[1-5].{14}/)
    
  isAmex: (value) ->
    _.isLuhn(value) && !!value.match(/^3[47].{13}/)
    
  isVisa: (value) ->
    _.isLuhn(value) && !!value.match(/^4.{15}/)
  
  # for validating credit cards
  isLuhn: (value) ->
    return false unless value
    number  = value.toString().replace(/\D/g, "")
    length  = number.length
    parity  = length % 2
    total   = 0
    i       = 0
    
    while i < length
      digit = number.charAt(i)
      if i % 2 == parity
        digit *= 2
        digit -= 9  if digit > 9
      total += parseInt(digit)
      i++
    
    total % 10 is 0
    
  isWeakPassword: (value) ->
    !!value.match(/(?=.{6,}).*/g) # 6 characters
  
  isMediumPassword: (value) ->
    !!value.match(/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/) # len=7 chars and numbers
    
  isStrongPassword: (value) ->
    !!value.match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/) # len=8 chars and numbers and special chars
    
  isPostalCode: (value, country = 'us') ->
    !!value.match(postalCodeFormats[country])
    
  isSlug: (value) ->
    value == _.parameterize(value)

for cardType in ['DinersClub', 'EnRoute', 'Discover', 'JCB', 'CarteBlanche', 'Switch', 'Solo', 'Laser']
  do (cardType) ->
    validating["is#{cardType}"] = (value) ->
      _.isLuhn(value)
      
inflections =
  pluralize: ->
    inflector.pluralize(arguments...)
    
  singularize: ->
    inflector.singularize(arguments...)
    
  camelCase: (value) ->
    Tower.Support.String.camelize(value)
    
asyncing =
  series: ->
    async.series arguments...
    
  parallel: ->
    async.parallel arguments...

_.mixin casting
_.mixin sanitizing
_.mixin inflections
_.mixin validating
_.mixin asyncing