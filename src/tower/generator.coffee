#Emergent = require 'emergent'
class Tower.Generator extends Tower.Class#Emergent.Generator
  # @desc "This generator creates an initializer file at config/initializers"
  @desc: (string) ->
  
  @run: (type, options = {}) ->
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](options)
    generator.run()
    
  constructor: (program) ->
    @program = program

require './generator/attribute'
require './generator/naming'
require './generator/resources'

Tower.Generator.include Tower.Generator.Attribute
Tower.Generator.include Tower.Generator.Naming
Tower.Generator.include Tower.Generator.Resources

module.exports = Tower.Generator
