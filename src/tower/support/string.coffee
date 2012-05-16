Tower.Support.String =
  camelize_rx:    /(?:^|_|\-)(.)/g
  capitalize_rx:  /(^|\s)([a-z])/g
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g
  underscore_rx2: /([a-z\d])([A-Z])/g

  constantize: (string, scope = global) ->
    scope[Tower.Support.String.camelize(string)]

  camelize: (string, firstLetterLower) ->
    string = string.replace Tower.Support.String.camelize_rx, (str, p1) -> p1.toUpperCase()
    if firstLetterLower then string.substr(0,1).toLowerCase() + string.substr(1) else string

  underscore: (string) ->
    string.replace(Tower.Support.String.underscore_rx1, '$1_$2')
          .replace(Tower.Support.String.underscore_rx2, '$1_$2')
          .replace('-', '_').toLowerCase()

  singularize: (string) ->
    Tower.modules.inflector.singularize arguments...

  pluralize: (count, string) ->
    if string
      return string if count is 1
    else
      string = count
    
    Tower.modules.inflector.pluralize string

  capitalize: (string) -> string.replace Tower.Support.String.capitalize_rx, (m, p1, p2) -> p1 + p2.toUpperCase()

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

  grep: (object, regex, iterator, context) ->
    regex = if _.isRegExp(regex) then regex else RegExp(String(regex).replace(/([{.(|}:)$+?=^*!\/[\]\\])/g, "\\$1"))
    found = _.select(object, (s) ->
      regex.test(s)
    , context)
    return _.map(found, iterator, context) if iterator
    found
    
  parameterize: (string) ->
    Tower.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, '')

module.exports = Tower.Support.String
