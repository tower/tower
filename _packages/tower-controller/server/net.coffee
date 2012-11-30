_ = Tower._

# @module
Tower.ControllerNet =
  ip: Ember.computed(->
    @request.ip
  ).cacheable()

  # @todo maybe an underscore helper?
  # 
  # @example convert from utf-8 to ISO-8859-1
  #   @encodeContent 'utf-8', 'ISO-8859-1'
  #   @encodeContent 'utf-8', 'ISO-8859-1//TRANSLIT'
  #   
  encodeContent: (string, from, to) ->
    Buffer  = require('buffer').Buffer
    Iconv   = require('iconv').Iconv
    to = to.toUpperCase()
    to += '//TRANSLIT' if to == 'ISO-8859-1'
    iconv   = new Iconv(from.toUpperCase(), to)
    buffer  = iconv.convert(string)
    buffer.toString()

  setContentType: (type, encoding = @encoding) ->
    type += "; charset=#{encoding}" if encoding?
    @headers['Content-Type'] = type

  getContentType: ->
    @headers['Content-Type']

  # @todo
  head: (status, options = {}) ->
    if typeof status == 'object'
      options = status
      status  = null

    status  ||= options.status || 'ok'
    location  = options.location

    delete options.status
    delete options.location

    #for key, value of options
    #  @headers[key.dasherize.split('-').each { |v| v[0] = v[0].chr.upcase }.join('-')] = value.to_s

    @status       = status
    @location     = Tower.urlFor(location) if location
    @headers['Content-Type'] = require('mime').lookup(@formats[0]) if @formats
    @body         = ' '

    @response.end()

module.exports = Tower.ControllerNet
