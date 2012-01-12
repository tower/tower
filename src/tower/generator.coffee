class Tower.Generator extends Tower.Class#Emergent.Generator
  # @desc "This generator creates an initializer file at config/initializers"
  @desc: (string) ->
  
  @run: (type, options = {}) ->
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](options)
    generator.run()
    
  constructor: (options = {}) ->
    _.extend @, options
    
    @destinationRoot ||= process.cwd()
    
    @cd       = "."
    @project  = {}
    @user     = {}

require './generator/actions'
require './generator/attribute'
require './generator/configuration'
require './generator/resources'

Tower.Generator.include Tower.Generator.Actions
Tower.Generator.include Tower.Generator.Attribute
Tower.Generator.include Tower.Generator.Configuration
Tower.Generator.include Tower.Generator.Resources

require './generator/generators/app/appGenerator'

module.exports = Tower.Generator
