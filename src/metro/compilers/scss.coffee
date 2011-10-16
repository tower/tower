# https://github.com/learnboost/stylus
#scss    = require('scss')
fs      = require('fs')

class Scss
  
  # compile "./application.less"
  compile: (path) ->
    #options ?= {}
    #options.bare = true if options.bare == undefined
    result = null
    #scss.render fs.readFileSync(path, 'utf8'), (error, data) -> result = data
    result
    
exports = module.exports = Scss
