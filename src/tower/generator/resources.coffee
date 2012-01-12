Tower.Generator.Resources =  
  route: (routingCode) ->
    @log "route", routingCode
    sentinel = /\.Route\.draw do(?:\s*\|map\|)?\s*$/
    
    @inRoot ->
      @injectIntoFile 'config/routes.rb', "\n  #{routing_code}\n", after: sentinel, verbose: false
  
  nodeModule: (name, options = {}) ->

module.exports = Tower.Generator.Resources
