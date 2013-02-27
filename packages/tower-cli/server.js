/**
 * Command aliases.
 * @see http://www.google.com/complete/search?output=toolbar&q=gnerate
 */

exports.aliases = {
  c: 'console',
  g: 'generate',
  s: 'server',
  'init': 'new'
};

/**
 * List of available commands.
 */

exports.commands = [
  'info', 'help', 'server', 'console', 'database', 'generate', 'install', 'generate', 'new', 'search', 'publish', 'test'];

/**
 * This is the entrance point to running tower commands.
 */
exports.run = function(argv) {
  var command = Tower.command.get();

  if (!command || command.match(/^-/)) command = 'info';

  if (exports.aliases.hasOwnProperty(command)) command = exports.aliases[command];

  if (command == 'select') command = 'database';
  //argv.splice(2, 1, 'database', 'list');

  if (!command.match(new RegExp('^' + exports.commands.join('|') + '$'))) unknownCommand(command);

  // require('./' + command)().run();
  exports[command](argv).run();
}

/**
 * Tower version.
 */

exports.version = function() {
  return '0.5.0'; //Tower.version
}

/**
 * tower info
 */

exports.info = function(argv) {
  var program = command();

  program.usage('[command] [options]')
    .on('--help', function() {
    console.log([
      'Commands:', 'tower new <app-name>          generate a new Tower application in folder "app-name"', 'tower console                 command line prompt to your application', 'tower generate <generator>    generate project files (models, views, controllers, scaffolds, etc.)'].join("\n"));
  });

  program.parse(argv);

  //program.helpIfNecessary(2);

  return program;
};

/**
 * tower new app
 */

exports['new'] = function(argv) {
  var program = command();

  program.usage('new <app-name> [options]')
    .option('--template <name>', 'Path to an application template (can be a filesystem path or URL)')
    .option('--skip-procfile [value]', "Don't create a Procfile (for Heroku)", false)
    .option('--skip-git [value]', "Skip Git ignores and keeps", false)
    .option('--skip-assets [value]', "Skip downloading javascripts, stylesheets, swfs, etc.", false)
    .option('-T, --title <name>', 'Your project title (as opposed to its file name)')
    .option('-D, --description <description>', 'Your project tagline (one sentence)', "")
    .option('-K, --keywords <keywords>', 'Your project keywords (e.g. "node.js, file uploading, s3")', "")
    .option('-n, --namespace <namespace>', 'Global namespace for your app (defaults to App)', "App")
    .option('-p, --persistence <name>', 'Preconfigure for selected database (options: mongodb)', array, ["mongodb"])
    .option('-E, --engine <engine>', 'Preconfigure for template engine (options: coffeekup/jade/eco/ejs)')
    .option('-s, --stylesheet-engine <ext>', 'Stylesheet framework', 'styl')
    .option('--include-stylesheets <names>', 'Stylesheets to use (defaults to twitter-bootstrap)', array, ["twitter-bootstrap"])
    .option('-t, --test <name>', 'Test framework (defaults to mocha)', "mocha")
    .option('-j, --use-javascript [value]', 'Use JavaScript instead of CoffeeScript', false)
    .option('-q, --quiet', 'Prevent logging any generator output to the console')
  // heroku, nodejitsu, dotcloud, etc.
  .option('-d, --deployment <names>', 'Deployment options (defaults to heroku, only heroku works now)', array, ["heroku"])
  // .option('-e, --executable', 'Include an executable file in ./bin/<name>')
  // TODO autodeploy to heroku: https://api-docs.heroku.com/apps
  // .option('--heroku [value]', 'Deploy to heroku', true)
  // .option('--mongohq [value]', 'Use mongohq in production', true)
  // .option('--redis2go [value]', 'Use redis2go in production', true)
  //.option('--nodejitsu', 'Deploy to nodejitsu')
  //.option('--ec2', 'Deploy to nodejitsu')
  .option('-w, --worker <names>', 'Background worker (defaults to kue)', "kue")
  // @todo Add ability to create github repo
  //   http://developer.github.com/v3/repos/#create

  program.parse(argv)

  /*
  program.helpIfNecessary(3)

  program.silent = program.quiet

  program.scriptType = if program.useJavascript then 'js' else 'coffee' #'coffee'
  program.stylesheetEngine ||= 'styl'
  program.templateEngine = program.engine ||= if program.useJavascript then 'ejs' else 'coffee'

  program.run = ->
    Tower.Generator.run('app', program: program, appName: program.args[1])

  program
  */
}

/**
 * tower server
 */

exports.server = function(argv) {
  var program = command();

  program.usage('server [options]')
    .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)', 'development')
    .option('-p, --port <n>', 'port for the application')
    .option('--static', 'disable-watch')
    .option('--single', 'Single page app')
    .option('-v, --version')
    .on('--help', function() {
    console.log([
      '    Examples:', '      tower generate scaffold Post title:string body:text belongsTo:user', '      tower generate model Post title:string body:text belongsTo:user'].join("\n"));
  });

  program.parse(argv)

  //program.helpIfNecessary()

  // TODO: move these onto {Tower.config}

  //Tower.isSinglePage = !!program.single

  program.run = function() {
    Tower.Packager.require('tower');
    /*
    Tower.env   = program.environment || process.env.NODE_ENV || "development"
    process.env.NODE_ENV = Tower.env

    if !!program.static # if true
      Tower.watch = false
    else if Tower.env != 'development'
      Tower.watch = false
    else
      Tower.watch = true

    Tower.lazyLoadApp  = Tower.env == 'development'

    # process.env.PORT == heroku, node community convention
    # process.env.port == azure
    # can't use parseInt b/c azure gives you crazy value.
    port = parseInt(program.port) || process.env.PORT || process.env.port || 3000

    Tower.port  = program.port = process.env.PORT = process.env.port = port

    # Tower.isDevelopment, etc.
    Tower["is#{_.camelize(Tower.env)}"] = true

    Tower.Application.instance().run()
    */
  }

  return program;
}

/**
 * tower generate
 */

exports.generate = function(argv) {
  var program = command();

  program.usage('generate <generator> <name> [attributes] [options]')
    .on('--help', function() {
    console.log([
      '    Generators:', '    ', '      tower generate scaffold <name> [attributes] [options]   generate model, views, and controller', '      tower generate model <name> [attributes] [options]      generate a model', '    ', '    Examples:', '    ', '      tower generate scaffold Post title:string body:text belongsTo:user', '      tower generate model Post title:string body:text belongsTo:user', '    '].join("\n"));
  });

  program.parse(argv);

  program.helpIfNecessary(4);

  program.run = function() {
    // Tower.Generator.run(@program.args[1], program: @program, modelName: @program.args[2])
  }

  return program;
}

exports.database = function() {

}

/**
 * Wrapper around bower install
 */

exports.install = function() {

}

/**
 * Search for components people might have created.
 * @see https://github.com/component/component/blob/master/lib/component.js
 *
 * TODO: One use case for this is to quickly download views/snippets.
 */

exports.search = function() {

}

/**
 * Notify towerjs.org of your component so other people can find it.
 */

exports.publish = function() {

}

exports.test = exports.tests = function(argv) {
  var program = command();
  program.usage('[command] [options]')
    .on('--help', function() {
    console.log([
      'ddd:', 'tower new <app-name>          generate a new Tower application in folder "app-name"', 'tower console                 command line prompt to your application', 'tower generate <generator>    generate project files (models, views, controllers, scaffolds, etc.)'].join("\n"));
  });

  program.parse(argv);

  program.run = function() {
    var TestCommand = require('./server/testCommand');
    TestCommand.create(argv);
  }

  return program;
}

/**
 * Constructs commander object.
 */

function command() {
  return (new(require('commander').Command)).version(exports.version());
}

function unknownCommand(name) {
  // TODO offer suggestions?
  console.log('The command "' + name + '" does not exist.');
  process.exit();
}


exports.run(Tower.command.argv);