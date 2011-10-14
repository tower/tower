# https://github.com/learnboost/stylus
stylus  = require('stylus')
fs      = require('fs')

class Stylus
  
  # compile "./application.styl", (error, result) -> console.log(result)
  compile: (path, callback) ->
    stylus(fs.readFileSync(path, 'utf8')).set('filename', path).render(callback)
    
exports = module.exports = Stylus
