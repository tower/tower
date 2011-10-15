Templates =
  Stylus:         require('./templates/stylus')
  Jade:           require('./templates/jade')
  Haml:           require('./templates/haml')
  Ejs:            require('./templates/ejs')
  CoffeeScript:   require('./templates/coffee_script')
  Less:           require('./templates/less')
  # Scss:           require('./templates/scss')
  Mustache:       require('./templates/mustache')
  Sass:           require('./templates/sass')
  Markdown:       require('./templates/markdown')
  
  engines: ->
    @_engines ?= {
      "stylus": Metro.Template.Stylus
      "jade":   Metro.Template.Jade
      "haml":   Metro.Template.Haml
      "ejs":    Metro.Template.Ejs
      "coffee":    Metro.Template.CoffeeScript
      "less":    Metro.Template.Less
      #"scss":    Metro.Template.Scss
      "sass":    Metro.Template.Sass
      "mustache":    Metro.Template.Mustache
    }
    
  engine: "jade"
  
exports = module.exports = Templates
