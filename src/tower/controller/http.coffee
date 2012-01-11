Tower.Controller.HTTP =
  head: (status, options = {}) ->
    if typeof status == "object"
      options = status
      status  = null
      
    status  ||= options.status || "ok"
    location  = options.location
    
    delete options.status
    delete options.location

    #for key, value of options
    #  @headers[key.dasherize.split('-').each { |v| v[0] = v[0].chr.upcase }.join('-')] = value.to_s

    @status       = status
    @location     = urlFor(location) if location
    @contentType  = Mime[formats.first] if formats
    @body         = " "
    
module.exports = Tower.Controller.HTTP
