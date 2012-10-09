generator       = null
sourceRoot      = null
destinationRoot = null
cakefileDestination = null

describe 'Tower.GeneratorActions', ->
  beforeEach ->
    try Tower.removeDirectorySync("#{process.cwd()}/test/tmp")
    sourceRoot          = process.cwd() + "/packages/tower-generator/server/generators/tower/app"
    destinationRoot     = process.cwd() + "/test/tmp"
    cakefileDestination = Tower.join(destinationRoot, "Cakefile")
    Tower.removeFileSync cakefileDestination if Tower.existsSync(cakefileDestination)
    generator   = new Tower.Generator(silent: true, sourceRoot: sourceRoot, destinationRoot: destinationRoot)
  
  test '#findInSourcePaths', ->
    assert.equal generator.findInSourcePaths("cake"), Tower.join(sourceRoot, "templates", "cake")
    
  test '#destinationPath(relativePath)', ->
    assert.equal generator.destinationPath("Cakefile"), cakefileDestination
  
  test '#destinationPath(absolutePath)', ->
    assert.equal generator.destinationPath(cakefileDestination), cakefileDestination
    
  test '#copyFile', (done) ->
    assert.isFalse Tower.existsSync(cakefileDestination)
    
    generator.copyFile "cake", "Cakefile", =>
      assert.isTrue Tower.existsSync(cakefileDestination), "File #{cakefileDestination} doesn't exist"
      done()
  
  test '#readFile', (done) ->
    generator.readFile generator.findInSourcePaths("cake"), (error, content) =>
      assert.match content, /tower/
      done()
  
  test '#createFile(relativePath)', (done) ->
    generator.createFile cakefileDestination, "Some content", =>
      generator.readFile cakefileDestination, (error, content) =>
        assert.match content, /Some content/
        done()
    
  test '#file', ->
    assert.equal generator.createFile.toString(), generator.file.toString()
   
  # failing on node 0.4.x, revisit later but it's not vital 
  test '#createDirectory(recursiveDirectory)', (done) ->
    directory = "./a/b/c/d"
    
    generator.createDirectory directory, (error, result) =>
      assert.isTrue Tower.existsSync("./test/tmp/#{directory}"), "Directory #{directory} doesn't exist"
      done()
  
  test '#directory', ->
    assert.equal generator.createDirectory.toString(), generator.directory.toString()
    
  test '#injectIntoFile', (done) ->
    generator.createFile cakefileDestination, "Some content", =>
      generator.injectIntoFile cakefileDestination, " and some more"
      generator.readFile cakefileDestination, (error, content) =>
        assert.equal "Some content and some more", content
        done()
  
  test '#get'
  test '#removeFile'
  test '#removeDir'
  test '#linkFile'
  test '#inside'
  test '#chmod'
  test '#render'
  test '#template'
  test '#prependToFile'
  test '#prependFile'
  test '#appendToFile'
  test '#appendFile'
  test '#commentLines'
  test '#uncommentLines'
