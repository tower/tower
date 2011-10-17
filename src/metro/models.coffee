# https://github.com/LearnBoost/mongoose
Models =
  Base: require('./models/base')
  
  bootstrap: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/models")
  
module.exports = Models
