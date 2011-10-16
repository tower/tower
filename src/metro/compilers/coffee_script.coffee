# https://github.com/learnboost/stylus
coffee  = require('coffee-script')
fs      = require('fs')

class CoffeeScript
  # compile "./application.coffee"
  compile: (path, options) ->
    options ?= {}
    options.bare = true if options.bare == undefined
    coffee.compile(fs.readFileSync(path, 'utf8'), options)
    
exports = module.exports = CoffeeScript
