Controllers =
  Base: require('./controllers/base')
  
  bootstrap: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/controllers")
  
exports = module.exports = Controllers
