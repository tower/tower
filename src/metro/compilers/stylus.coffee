# https://github.com/learnboost/stylus
stylus  = require('stylus')
fs      = require('fs')

class Stylus
  
  # compile "./application.styl", (error, result) -> console.log(result)
  compile: (path) ->
    result = null
    stylus.render fs.readFileSync(path, 'utf8'), {}, (error, data) -> result = data
    result
    
exports = module.exports = Stylus
