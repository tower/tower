Controllers =
  Base: require('./controllers/base')
  
  bootstrap: ->
    Metro.Support.load_classes("#{Metro.root}/app/controllers")
  
exports = module.exports = Controllers
