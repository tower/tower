Tower.View.StringHelper =  
  t: (string) ->
    Tower.Support.I18n.translate(string)
  
  l: (object) ->
    Tower.Support.I18n.localize(string)
    
  boolean: (boolean) ->
    if boolean then "yes" else "no"

module.exports = Tower.View.StringHelper
