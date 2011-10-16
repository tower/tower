# https://github.com/learnboost/stylus
less    = require('less')
fs      = require('fs')

class Less
  
  # compile "./application.less"
  compile: (path) ->
    #options ?= {}
    #options.bare = true if options.bare == undefined
    result = null
    less.render fs.readFileSync(path, 'utf8'), (error, data) -> result = data
    result
    
exports = module.exports = Less
