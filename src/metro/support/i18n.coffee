Metro.Support.I18n =
  load: (pathOrObject, language = @defaultLanguage) ->
    store     = @store()
    language  = store[language] ||= {}
    
    Metro.Support.Object.deepMerge(language, if typeof(pathOrObject) == "string" then require(pathOrObject) else pathOrObject)
    
    @
  
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
  
  lookup: (key, language = @defaultLanguage) ->
    parts   = key.split(".")
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
  
  interpolator: ->
    @_interpolator ||= new (require('shift').Mustache)
    
Metro.Support.I18n.t = Metro.Support.I18n.translate
  
module.exports = Metro.Support.I18n
