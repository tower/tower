module.exports = command = (argv) ->
  program = require('commander')
  
  program
    .version(Tower.version)
    .usage('[command] [options]')
    .on '--help', ->
      console.log '''
\ \ Commands:
\ \ 
\ \   tower new <app-name>          generate a new Tower application in folder "app-name"
\ \   tower console                 command line prompt to your application
\ \   tower generate <generator>    generate project files (models, views, controllers, scaffolds, etc.)
\ \   tower destroy <generator>     destroy project files (models, views, controllers, scaffolds, etc.)
'''

  program.parse(argv)

  program.helpIfNecessary(2)
