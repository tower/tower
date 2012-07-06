# @module
Tower.Support.I18n =
  PATTERN: /(?:%%|%\{(\w+)\}|%<(\w+)>(.*?\d*\.?\d*[bBdiouxXeEfgGcps]))/g
  defaultLanguage: 'en'

  load: (pathOrObject, language = @defaultLanguage) ->
    store     = @store()
    language  = store[language] ||= {}
    Tower.modules._.deepMerge(language, if typeof(pathOrObject) == 'string' then require(pathOrObject) else pathOrObject)
    @

  translate: (key, options = {}) ->
    if options.hasOwnProperty('tense')
      key += ".#{options.tense}"
    if options.hasOwnProperty('count')
      switch options.count
        when 0 then key += '.none'
        when 1 then key += '.one'
        else key += '.other'

    @interpolate(@lookup(key, options.language), options)

  localize: ->
    @translate arguments...

  lookup: (key, language = @defaultLanguage) ->
    parts   = key.split('.')
    result  = @store()[language]

    try
      for part in parts
        result = result[part]
    catch error
      result = null

    throw new Error("Translation doesn't exist for '#{key}'") unless result?

    result

  store: ->
    @_store ||= {}

  # https://github.com/svenfuchs/i18n/blob/master/lib/i18n/interpolate/ruby.rb
  interpolate: (string, locals = {}) ->
    string.replace @PATTERN, (match, $1, $2, $3) ->
      if match == '%%'
        '%'
      else
        key = $1 || $2
        if locals.hasOwnProperty(key)
          value = locals[key]
        else
          throw new Error("Missing interpolation argument #{key}")
        value = value.call(locals) if typeof value == 'function'
        if $3 then sprintf("%#{$3}", value) else value

Tower.Support.I18n.t = Tower.Support.I18n.translate

module.exports = Tower.Support.I18n
