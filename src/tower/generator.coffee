class Tower.Generator extends Tower.Class#Emergent.Generator
  @run: (type, argv) ->
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](argv)
    generator.run()
    
  constructor: (argv, options = {}) ->
    _.extend @, options
    
    @project  = new Tower.Generator.Project(argv.shift())
    @user     = {}
    
    if argv.length > 0 && argv[0].charAt(0) != "-"
      @model  = new Tower.Generator.Model(argv.shift())
    
    @destinationRoot ||= process.cwd()
    
    @cd       = "."
    @project  = {}
    @user     = {}

require './generator/actions'
require './generator/configuration'
require './generator/resources'

Tower.Generator.include Tower.Generator.Actions
Tower.Generator.include Tower.Generator.Configuration
Tower.Generator.include Tower.Generator.Resources

require './generator/generators/tower/app/appGenerator'
require './generator/generators/tower/model/modelGenerator'
require './generator/generators/tower/view/viewGenerator'

module.exports = Tower.Generator
