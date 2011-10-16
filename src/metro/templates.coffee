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
      "stylus":   Metro.Templates.Stylus
      "jade":     Metro.Templates.Jade
      "haml":     Metro.Templates.Haml
      "ejs":      Metro.Templates.Ejs
      "coffee":   Metro.Templates.CoffeeScript
      "less":     Metro.Templates.Less
      #"scss":    Metro.Templates.Scss
      "sass":     Metro.Templates.Sass
      "mustache": Metro.Templates.Mustache
    }
    
  engine: "jade"
  
exports = module.exports = Templates
