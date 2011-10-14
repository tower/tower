# https://github.com/learnboost/stylus
jade    = require('jade')
fs      = require('fs')

class Jade
  # compile "./application.jade", (error, result) -> console.log(result)
  compile: (path, options) ->
    callback = options if typeof(options) == "function"
    result = null
    jade.render fs.readFileSync(path, 'utf8'), options || {}, (error, data) -> result = data
    result
    
exports = module.exports = Jade
