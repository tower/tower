Metro.Support.I18n =
  defaultLanguage: "en"
  
  translate: (key, options = {}) ->
    if options.hasOwnProperty("tense")
      key += ".#{options.tense}"
    if options.hasOwnProperty("count")
      switch options.count
        when 0 then key += ".none"
        when 1 then key += ".one"
        else key += ".other"
    
    @interpolator().render(@lookup(key, options.language), locals: options)
    
  t: @::translate
  
  lookup: (key, language = @defaultLanguage) ->
    parts   = key.split(".")
    result  = @store[language]
    
    try
      for part in parts
        result = result[part]
    catch error
      result = null
      
    throw new Error("Translation doesn't exist for '#{key}'") unless result?
    
    result
    
  store: {}
  
  interpolator: ->
    @_interpolator ||= new (require('shift').Mustache)
  
module.exports = Metro.Support.I18n
