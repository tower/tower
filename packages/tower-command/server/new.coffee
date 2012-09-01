class Tower.CommandNew
  constructor: (argv) ->
    @program = command(argv)

  run: ->
    @program.run()

module.exports = Tower.CommandNew

command = (argv) ->
  program = new (require('commander').Command)
  
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
    .option('-s, --stylesheet-engine <ext>', 'Stylesheet framework', 'styl')
    .option('--include-stylesheets <names>', 'Stylesheets to use (defaults to twitter-bootstrap)', array, ["twitter-bootstrap"])
    .option('-t, --test <name>', 'Test framework (defaults to mocha)', "mocha")
    .option('-j, --use-javascript [value]', 'Use JavaScript instead of CoffeeScript', false)
    # heroku, nodejitsu, dotcloud, etc.
    .option('-d, --deployment <names>', 'Deployment options (defaults to heroku, only heroku works now)', array, ["heroku"])
    # @todo autodeploy to heroku: https://api-docs.heroku.com/apps
    # .option('--heroku [value]', 'Deploy to heroku', true)
    # .option('--mongohq [value]', 'Use mongohq in production', true)
    # .option('--redis2go [value]', 'Use redis2go in production', true)
    #.option('--nodejitsu', 'Deploy to nodejitsu')
    #.option('--ec2', 'Deploy to nodejitsu')
    .option('-w, --worker <names>', 'Background worker (defaults to kue)', "kue")
    # @todo Add ability to create github repo
    #   http://developer.github.com/v3/repos/#create
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

  program.scriptType = if program.useJavascript then 'js' else 'coffee' #'coffee'
  program.stylesheetEngine ||= 'styl'
  program.templateEngine = program.engine

  program.run = ->
    Tower.Generator.run('app', program: program, appName: program.args[1])
  
  program

