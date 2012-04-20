generator       = null
sourceRoot      = null
destinationRoot = null

describe 'Tower.Generator.AppGenerator', ->
  beforeEach ->
    sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/app"
    destinationRoot = process.cwd() + "/test/tmp/myapp"
    sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/app"
    destinationRoot = process.cwd() + "/test/tmp/myapp"
    generator       = new Tower.Generator.AppGenerator(sourceRoot: sourceRoot, destinationRoot: destinationRoot)
    
  test 'create an app', (done) ->
    generator.run =>
      done()
    #Tower.Command.run(["tower", "new", "myapp"])