sass      = require('sass')
fs        = require('fs')

class Sass
  
  # compile "./application.sass"
  compile: (path, options) ->
    sass.render(fs.readFileSync(path, 'utf8'))
    
exports = module.exports = Sass
