class Tower.Generator extends Tower.Class#Emergent.Generator
  @run: (type, options) ->
    new Tower.Generator[Tower.Support.String.camelize(type)](options)
    
  constructor: (options = {}) ->
    _.extend @, options
    
    unless @projectName
      name = process.cwd().split("/")
      @projectName = name[name.length - 1]
      
    @destinationRoot  ||= process.cwd()
    
    @currentSourceDirectory = @currentDestinationDirectory = "."
    
    unless @project
      @project          = @buildProject()
      @user             = {}
      @buildUser (user) =>
        @user   = user
        @model  = @buildModel(@modelName, @project.className, @program.args) if @modelName
        
        @run()

require './generator/actions'
require './generator/configuration'
require './generator/resources'
require './generator/shell'

Tower.Generator.include Tower.Generator.Actions
Tower.Generator.include Tower.Generator.Configuration
Tower.Generator.include Tower.Generator.Resources
Tower.Generator.include Tower.Generator.Shell

require './generator/generators/tower/app/appGenerator'
require './generator/generators/tower/model/modelGenerator'
require './generator/generators/tower/view/viewGenerator'

module.exports = Tower.Generator
