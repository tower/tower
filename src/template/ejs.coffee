ejs     = require('ejs')
fs      = require('fs')

class Ejs
  # compile "./application.haml", (error, result) -> console.log(result)
  compile: (path, options, callback) ->
    callback = options if typeof(options) == "function"
    data = ejs.render(fs.readFileSync(path, 'utf8'), options || {})
    callback.call(@, null, data)
    data
    
exports = module.exports = Ejs
