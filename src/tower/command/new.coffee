class Tower.Command.New  
  constructor: (argv) ->
    @program = program = require('commander')
    
    program
      .version(Tower.version)
      .option('-t, --template <template>', 'Path to an application template (can be a filesystem path or URL)')
      .option('--skip-procfile', "Don't create a Procfile (for Heroku)")
      .option('--skip-git', "Skip Git ignores and keeps")
      .option('-d, --database <database>', 'Preconfigure for selected database (options: mongodb)', "mongodb")
      .option('-e, --engine <engine>', 'Preconfigure for template engine (options: coffeekup/jade/eco/ejs)')
      .option('-T, --title <title>', 'Your project title (as opposed to its file name)')
      .option('-D, --description <description>', 'Your project tagline (one sentence)', "")
      .option('-K, --keywords <keywords>', 'Your project keywords (e.g. "node.js, file uploading, s3")', "")
      .option('-n, --namespace <namespace>', 'Global namespace for your app (defaults to YourProjectName)')
      .option('-v, --version', 'output version number')
      .option '-h, --help', '''
\ \ Usage:
\ \   tower new <app-name> [options]
\ \ 
\ \ Options:
\ \   -T, --title <title>               project title (as opposed to its file name)
\ \   -D, --description <description>   project tagline (one sentence)
\ \   -K, --keywords <keywords>         project keywords (e.g. "node.js, file uploading, s3")
\ \   -n, --namespace <namespace>       global namespace for your app (defaults to YourProjectName)
\ \   -h, --help                        output usage information
\ \   -v, --version                     output version number
\ \   --skip-procfile                   skip creating a Procfile (for deploying to Heroku)
\ \   --skip-git                        Skip Git ignores and keeps
\ \   
'''
    
    program.parse(argv)
    
    program.help ||= program.rawArgs.length == 3
    
    if program.help
      console.log program.options[program.options.length - 1].description
      process.exit()
  
  run: ->
    Tower.Generator.run("appGenerator", program: @program, appName: @program.args[1])

module.exports = Tower.Command.New
