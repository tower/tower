class Tower.Dispatch.Cookies
  @parse: (string = document.cookie) ->
    result  = {}
    pairs   = string.split(/[;,] */);
    
    for pair in pairs
      eqlIndex  = pair.indexOf('=')
      key       = pair.substring(0, eqlIndex).trim().toLowerCase()
      value     = pair.substring(++eqlIndex, pair.length).trim()
      
      # quoted values
      value = value.slice(1, -1) if '"' == value[0]
      
      # only assign once
      if result[key] == undefined
        value = value.replace(/\+/g, ' ')
        try
          result[key] = decodeURIComponent(value)
        catch error
          if error instanceof URIError
            result[key] = value
          else
            throw err
            
    new @(result)
    
  constructor: (attributes = {}) ->
    @[key] = value for key, value of attributes

module.exports = Tower.Dispatch.Cookies
