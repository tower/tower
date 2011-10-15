class Locale
  @namespaces: {}
    
  @localize: (key) ->
    @namespaces[key] || key
  
exports = module.exports = Locale

Metro.localize = Locale.localize
