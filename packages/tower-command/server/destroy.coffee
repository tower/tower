require '../../tower-generator/server/actions'
fs = require 'fs'
class Tower.CommandDestroy
  constructor: (argv) ->
    @program = program = new (require('commander').Command)

    program
      .version(Tower.version)
      .usage('destroy <generator> <name>')
      .on '--help', ->
        console.log '''
   Destroy:

      tower destroy model <name>       destroy a model
      tower destroy controller <name>  destroy a controller
      tower destroy scaffold <name>    destroy a scaffold
                    '''
    program.parse(argv)

    program.helpIfNecessary(4)


  destroyModel: (modelName) ->
    modelName = _.camelize(modelName, true)
    namespace = Tower.namespace()
    className = _.camelize(modelName)
    namePlural = _.pluralize(modelName)

    # remove model file reference in server assets
    assetRefs = [
      ///\s*#?\s*\'app/models/shared/#{modelName}\'///g
      ///\s*#?\s*\'/test/cases/models/shared/#{modelName}Test\'///g
    ]

    appCtrlRef = ///\s*\(next\)\s*=>\s*#{namespace}\.#{className}\.all\s*\(error,\s*#{namePlural}\)\s*=>\s*data\.#{namePlural}\s*=\s*#{namePlural}\s*next\(\)///g

    bootstrapRef = ///\s*#?\s*App\.#{className}\.load\(data\.#{namePlural}\)\sif\sdata\.#{namePlural}///g

    seedRef = ///\s*#?\s*\(callback\)\s*=>\s*_\(\d*\)\.timesAsync\s*callback,\s*\(next\)\s*=>\s*Tower\.Factory\.create\s*\'#{modelName}\',\s*\(error,\s*record\)\s*=>\s*console\.log\s*_\.stringify\(record\)\s*next\(\)///g

    # Delete files and references
    Tower.GeneratorActions.removeFile "#{Tower.root}/app/models/shared/#{modelName}.coffee"

    Tower.GeneratorActions.removeFile "#{Tower.root}/test/factories/#{modelName}Factory.coffee"

    Tower.GeneratorActions.gsubFile("#{Tower.root}/app/config/server/assets.coffee", assetRefs, '')

    Tower.GeneratorActions.gsubFile("#{Tower.root}/app/config/client/bootstrap.coffee", bootstrapRef, '')

    Tower.GeneratorActions.gsubFile("#{Tower.root}/app/controllers/server/applicationController.coffee", appCtrlRef, '')

    Tower.GeneratorActions.gsubFile("#{Tower.root}/data/seeds.coffee", seedRef, '')

    Tower.GeneratorActions.removeFile "#{Tower.root}/test/cases/models/shared/#{modelName}Test.coffee"

  destroyController: (controllerName) ->
    controllerName = _.camelize(controllerName, true)

    # remove controller files
    Tower.GeneratorActions.removeFile "app/controllers/server/#{controllerName}Controller.coffee"
    Tower.GeneratorActions.removeFile "app/controllers/client/#{controllerName}Controller.coffee"

    Tower.GeneratorActions.removeFile "test/cases/controllers/server/#{controllerName}ControllerTest.coffee"

  run: ->

    if @program.args.length >= 3
      @destinationRoot  ||= process.cwd()


      switch @program.args[1]
        when 'model'
          @destroyModel @program.args[2]
        when 'controller'
          console.log 'controller fool'
        when 'scaffold'
          console.log 'scaffold dog'


module.exports = Tower.CommandDestroy
