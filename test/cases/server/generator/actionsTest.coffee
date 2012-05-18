generator       = null
sourceRoot      = null
destinationRoot = null
File            = require('pathfinder').File
fs              = require 'fs'
wrench          = require 'wrench'
cakefileDestination = null

describe 'Tower.Generator.Actions', ->
  beforeEach ->
    try wrench.rmdirSyncRecursive("#{process.cwd()}/test/tmp", true)
    sourceRoot          = process.cwd() + "/src/tower/server/generator/generators/tower/app"
    destinationRoot     = process.cwd() + "/test/tmp"
    cakefileDestination = File.join(destinationRoot, "Cakefile")
    fs.unlinkSync cakefileDestination if File.exists(cakefileDestination)
    generator   = new Tower.Generator(silent: true, sourceRoot: sourceRoot, destinationRoot: destinationRoot)
  
  test '#findInSourcePaths', ->
    assert.equal generator.findInSourcePaths("cake"), File.join(sourceRoot, "templates", "cake")
    
  test '#destinationPath(relativePath)', ->
    assert.equal generator.destinationPath("Cakefile"), cakefileDestination
  
  test '#destinationPath(absolutePath)', ->
    assert.equal generator.destinationPath(cakefileDestination), cakefileDestination
    
  test '#copyFile', (done) ->
    assert.isFalse File.exists(cakefileDestination)
    
    generator.copyFile "cake", "Cakefile", =>
      assert.isTrue File.exists(cakefileDestination), "File #{cakefileDestination} doesn't exist"
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
  #test '#createDirectory(recursiveDirectory)', (done) ->
  #  directory = "./a/b/c/d"
  #  
  #  generator.createDirectory directory, (error, result) =>
  #    assert.isTrue File.exists("./test/tmp/#{directory}"), "Directory #{directory} doesn't exist"
  #    done()
  
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
