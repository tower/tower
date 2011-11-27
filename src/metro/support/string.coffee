Metro.Support.String =
  camelize_rx:    /(?:^|_|\-)(.)/g
  capitalize_rx:  /(^|\s)([a-z])/g
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g
  underscore_rx2: /([a-z\d])([A-Z])/g
  
  constantize: (string, scope = global) ->
    scope[@camelize(string)]
  
  camelize: (string, firstLetterLower) ->
    string = string.replace @camelize_rx, (str, p1) -> p1.toUpperCase()
    if firstLetterLower then string.substr(0,1).toLowerCase() + string.substr(1) else string

  underscore: (string) ->
    string.replace(@underscore_rx1, '$1_$2')
          .replace(@underscore_rx2, '$1_$2')
          .replace('-', '_').toLowerCase()

  singularize: (string) ->
    len = string.length
    if string.substr(len - 3) is 'ies'
      string.substr(0, len - 3) + 'y'
    else if string.substr(len - 1) is 's'
      string.substr(0, len - 1)
    else
      string

  pluralize: (count, string) ->
    if string
      return string if count is 1
    else
      string = count

    len = string.length
    lastLetter = string.substr(len - 1)
    if lastLetter is 'y'
      "#{string.substr(0, len - 1)}ies"
    else if lastLetter is 's'
      string
    else
      "#{string}s"

  capitalize: (string) -> string.replace @capitalize_rx, (m,p1,p2) -> p1 + p2.toUpperCase()
  
  trim: (string) -> if string then string.trim() else ""
  
  interpolate: (stringOrObject, keys) ->
    if typeof stringOrObject is 'object'
      string = stringOrObject[keys.count]
      unless string
        string = stringOrObject['other']
    else
      string = stringOrObject

    for key, value of keys
      string = string.replace(new RegExp("%\\{#{key}\\}", "g"), value)
    string
    
module.exports = Metro.Support.String
