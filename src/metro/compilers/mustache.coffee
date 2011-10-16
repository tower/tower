# https://github.com/learnboost/stylus
mustache  = require('mustache')
fs        = require('fs')

class Mustache
  
  # compile "./application.mustache"
  compile: (path, options) ->
    mustache.to_html fs.readFileSync(path, 'utf8'), options.locals
    
exports = module.exports = Mustache
