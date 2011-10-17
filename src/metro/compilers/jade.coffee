# https://github.com/learnboost/stylus
jade    = require('jade')
fs      = require('fs')

class Jade
  # compile "./application.jade", (error, result) -> console.log(result)
  compile: (path, options) ->
    callback = options if typeof(options) == "function"
    result = null
    options ?= {}
    jade.render fs.readFileSync(path, 'utf8'), options, (error, data) ->
      if error
        result = error.toString()
      else
        result = data
    result
    
exports = module.exports = Jade
