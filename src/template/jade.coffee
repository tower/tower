# https://github.com/learnboost/stylus
jade    = require('jade')
fs      = require('fs')

class Jade
  # compile "./application.jade", (error, result) -> console.log(result)
  compile: (path, options, callback) ->
    callback = options if typeof(options) == "function"
    jade.render(fs.readFileSync(path, 'utf8'), options || {}, callback)
    
exports = module.exports = Jade
