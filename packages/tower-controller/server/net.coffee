# @module
Tower.ControllerNet =
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
    @headers['Content-Type'] = Mime[formats.first] if formats
    @body         = ' '

module.exports = Tower.ControllerNet
