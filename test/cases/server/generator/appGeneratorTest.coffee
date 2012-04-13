generator       = null
sourceRoot      = null
destinationRoot = null

describe 'Tower.Generator.AppGenerator', ->
  before ->
    sourceRoot      = "#{process.cwd()}/lib/tower/server/generator/generators/tower/app"
    destinationRoot = "#{process.cwd()}/test/tmp/myapp"
    #generator       = new Tower.Generator.AppGenerator(
    #  sourceRoot: sourceRoot
    #  destinationRoot: destinationRoot
    #  program: {}
    #  appName: "myapp"
    #)
    
  test 'create an app', (done) ->
    assert.file "#{Tower.root}/app/controllers/testJsonController.coffee"
    done()
    #generator.run =>
    #  done()
    #Tower.Command.run(["tower", "new", "myapp"])
