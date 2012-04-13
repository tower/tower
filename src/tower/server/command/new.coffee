class Tower.Command.New
  constructor: (argv) ->
    @program  = program = new (require('commander').Command)
    
    array = (value) ->
      value.split(/,?\s+/)
    
    program
      .version(Tower.version)
      .option('--template <name>', 'Path to an application template (can be a filesystem path or URL)')
      .option('--skip-procfile [value]', "Don't create a Procfile (for Heroku)", false)
      .option('--skip-git [value]', "Skip Git ignores and keeps", false)
      .option('--skip-assets [value]', "Skip downloading javascripts, stylesheets, swfs, etc.", false)
      .option('-T, --title <name>', 'Your project title (as opposed to its file name)')
      .option('-D, --description <description>', 'Your project tagline (one sentence)', "")
      .option('-K, --keywords <keywords>', 'Your project keywords (e.g. "node.js, file uploading, s3")', "")
      .option('-n, --namespace <namespace>', 'Global namespace for your app (defaults to App)', "App")
      .option('-p, --persistence <name>', 'Preconfigure for selected database (options: mongodb)', array, ["mongodb"])
      .option('-e, --engine <engine>', 'Preconfigure for template engine (options: coffeekup/jade/eco/ejs)', "coffee")
      .option('-s, --stylesheets <names>', 'Stylesheets to use (defaults to twitter-bootstrap)', array, ["twitter-bootstrap"])
      .option('-t, --test <name>', 'Test framework (defaults to mocha)', "mocha")
      # heroku, nodejitsu, dotcloud, etc.
      .option('-d, --deployment <names>', 'Deployment options (defaults to heroku, only heroku works now)', array, ["heroku"])
      .option('-w, --worker <names>', 'Background worker (defaults to kue)', "kue")
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
    
    program

  run: ->
    Tower.Generator.run("app", program: @program, appName: @program.args[1])

module.exports = Tower.Command.New
