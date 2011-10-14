# https://github.com/learnboost/stylus
haml    = require('hamljs')
fs      = require('fs')

class Haml
  # compile "./application.haml", (error, result) -> console.log(result)
  compile: (path, options, callback) ->
    callback = options if typeof(options) == "function"
    data = haml.render(fs.readFileSync(path, 'utf8'), options || {})
    callback.call(@, null, data)
    data
    
exports = module.exports = Haml
