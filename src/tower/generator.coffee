class Tower.Generator extends Tower.Class
  # @desc "This generator creates an initializer file at config/initializers"
  @desc: (string) ->
  
  @run: (type, options = {}) ->
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](options)
    generator.run()
    
  constructor: (program) ->
    @program = program

require './generator/actions'
require './generator/attribute'
require './generator/configuration'
require './generator/naming'
require './generator/resources'

Tower.Generator.include Tower.Generator.Actions
Tower.Generator.include Tower.Generator.Configuration
Tower.Generator.include Tower.Generator.Naming
Tower.Generator.include Tower.Generator.Resources

module.exports = Tower.Generator
