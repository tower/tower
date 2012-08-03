Tower.SupportString =
  camelize_rx:    /(?:^|_|\-)(.)/g
  capitalize_rx:  /(^|\s)([a-z])/g
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g
  underscore_rx2: /([a-z\d])([A-Z])/g

  constantize: (string, scope = global) ->
    scope[Tower.SupportString.camelize(string)]

  camelize: (string, firstLetterLower) ->
    string = string.replace Tower.SupportString.camelize_rx, (str, p1) -> p1.toUpperCase()
    if firstLetterLower then string.substr(0,1).toLowerCase() + string.substr(1) else string

  underscore: (string) ->
    string.replace(Tower.SupportString.underscore_rx1, '$1_$2')
          .replace(Tower.SupportString.underscore_rx2, '$1_$2')
          .replace('-', '_').toLowerCase()

  singularize: (string) ->
    Tower.modules.inflector.singularize arguments...

  repeat: (string, number) ->
    new Array(number + 1).join(string)

  pluralize: (count, string) ->
    if string
      return string if count is 1
    else
      string = count

    Tower.modules.inflector.pluralize string

  capitalize: (string) -> string.replace Tower.SupportString.capitalize_rx, (m, p1, p2) -> p1 + p2.toUpperCase()

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

  # This should have a maxSize option or something
  parameterize: (string) ->
    # What do you do with a string like this:
    # > This week's http://t.co/f2HvvZ1u
    # 1. "this-weeks-tco"
    # 2. "this-weeks-httptco"
    Tower.SupportString.underscore(string)
      #.replace(/'/, '') # week's => weeks
      .replace(/\.([^\.])/, (_, $1) -> $1) # node.js => nodejs (instead of node-js)
      .replace(/[^a-z0-9]+/g, "-") # replace every other non-word character with "-"
      .replace(/^-+|-+$/g, '') # remove hyphens from beginning and end

  toStateName: (string) ->
    "is#{_.camelize(string)}Active"

  # rfc4122 version 4 compliant guid
  # http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript#answer-2117523
  # This is used primarily for generating temporari client ids, which
  # will be replaced within a few milliseconds with a server id once saved.
  uuid: ->
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
      r = Math.random()*16|0
      v = if c == 'x' then r else (r&0x3|0x8)
      v.toString(16)

  stringify: (object, pretty = true) ->
    if pretty
      JSON.stringify(object, null, 2)
    else
      JSON.stringify(object)

module.exports = Tower.SupportString
