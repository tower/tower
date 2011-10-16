# https://github.com/LearnBoost/mongoose
Models =
  Base: require('./models/base')
  
  bootstrap: ->
    Metro.Support.load_classes("#{Metro.root}/app/models")
  
module.exports = Models
