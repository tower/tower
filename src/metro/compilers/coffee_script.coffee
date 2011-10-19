class CoffeeScript
  engine: -> require('coffee-script')
  
  # compile "./application.coffee"
  compile: (content, options) ->
    options ?= {}
    options.bare = true if options.bare == undefined
    @engine().compile(content, options)
    
exports = module.exports = CoffeeScript
