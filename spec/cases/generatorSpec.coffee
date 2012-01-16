require '../config'
###
generator       = null
sourceRoot      = null
destinationRoot = null
File            = require('pathfinder').File
fs              = require 'fs'

expectGeneratedFile = (path) ->
  expect(File.exists(File.join(destinationRoot, path))).toEqual true

describe 'Tower.Generator', ->
  describe 'Tower.Generator.Configuration', ->
    beforeEach ->
      generator   = new Tower.Generator()
    
    test '#destinationRoot', ->
      expect(generator.destinationRoot).toEqual process.cwd()
  
  describe 'Tower.Generator.Actions', ->
    beforeEach ->
      sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/app"
      destinationRoot = process.cwd() + "/spec/tmp"
      fs.unlinkSync File.join(destinationRoot, "Cakefile") if File.exists(File.join(destinationRoot, "Cakefile"))
      generator   = new Tower.Generator(sourceRoot: sourceRoot, destinationRoot: destinationRoot)
      
    test '#findInSourcePaths', ->
      expect(generator.findInSourcePaths("Cakefile")).toEqual File.join(sourceRoot, "templates", "Cakefile")
      
    test '#copyFile', ->
      expect(File.exists(File.join(destinationRoot, "Cakefile"))).toEqual false
      
      generator.copyFile("Cakefile")
      
      waits 10
      
      runs ->
        expectGeneratedFile "Cakefile"
        
    test '#directory', ->
      
    test '#inside', ->
      
        
  describe 'Tower.Generator.AppGenerator', ->
    beforeEach ->
      sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/app"
      destinationRoot = process.cwd() + "/spec/tmp"
      generator   = new Tower.Generator.AppGenerator(sourceRoot: sourceRoot, destinationRoot: destinationRoot)
      
    test 'create an app', ->
      generator.run()
  
  describe 'Tower.Generator.ModelGenerator', ->
    beforeEach ->
      sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/model"
      destinationRoot = process.cwd() + "/spec/tmp"
      generator   = new Tower.Generator.ModelGenerator(["User", "email:string"], sourceRoot: sourceRoot, destinationRoot: destinationRoot)
    
    test 'create an app', ->
      generator.run()
  
  describe 'Tower.Generator.ViewGenerator', ->
    beforeEach ->
      sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/view"
      destinationRoot = process.cwd() + "/spec/tmp"
      generator   = new Tower.Generator.ViewGenerator(["User", "email:string"], sourceRoot: sourceRoot, destinationRoot: destinationRoot)

    test 'create an app', ->
      generator.run()
###