# https://github.com/learnboost/stylus
markdown  = require('markdown')
fs        = require('fs')

class Markdown
  
  # compile "./application.mustache"
  compile: (path, options) ->
    markdown.parse fs.readFileSync(path, 'utf8')
    
exports = module.exports = Markdown
