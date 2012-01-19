Tower.View.StringHelper =  
  t: (string) ->
    Tower.translate(string)
  
  l: (object) ->
    Tower.localize(string)
    
  boolean: (boolean) ->
    if boolean then "yes" else "no"

module.exports = Tower.View.StringHelper
