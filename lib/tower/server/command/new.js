var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Command.New = (function() {

  function New(argv) {
    var array, program;
    this.program = program = new (require('commander').Command);
    array = function(value) {
      return value.split(/,?\s+/);
    };
    program.version(Tower.version).option('--template <name>', 'Path to an application template (can be a filesystem path or URL)').option('--skip-procfile [value]', "Don't create a Procfile (for Heroku)", false).option('--skip-git [value]', "Skip Git ignores and keeps", false).option('--skip-assets [value]', "Skip downloading javascripts, stylesheets, swfs, etc.", false).option('-T, --title <name>', 'Your project title (as opposed to its file name)').option('-D, --description <description>', 'Your project tagline (one sentence)', "").option('-K, --keywords <keywords>', 'Your project keywords (e.g. "node.js, file uploading, s3")', "").option('-n, --namespace <namespace>', 'Global namespace for your app (defaults to App)', "App").option('-p, --persistence <name>', 'Preconfigure for selected database (options: mongodb)', array, ["mongodb"]).option('-e, --engine <engine>', 'Preconfigure for template engine (options: coffeekup/jade/eco/ejs)', "coffee").option('-s, --stylesheets <names>', 'Stylesheets to use (defaults to twitter-bootstrap)', array, ["twitter-bootstrap"]).option('-t, --test <name>', 'Test framework (defaults to mocha)', "mocha").option('-d, --deployment <names>', 'Deployment options (defaults to heroku, only heroku works now)', array, ["heroku"]).option('-w, --worker <names>', 'Background worker (defaults to kue)', "kue").option('-v, --version', 'output version number').option('-h, --help', '\ \ Usage:\n\ \   tower new <app-name> [options]\n\ \ \n\ \ Options:\n\ \   -T, --title <title>               project title (as opposed to its file name)\n\ \   -D, --description <description>   project tagline (one sentence)\n\ \   -K, --keywords <keywords>         project keywords (e.g. "node.js, file uploading, s3")\n\ \   -n, --namespace <namespace>       global namespace for your app (defaults to YourProjectName)\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \   --skip-procfile                   skip creating a Procfile (for deploying to Heroku)\n\ \   --skip-git                        Skip Git ignores and keeps\n\ \ ');
    program.parse(argv);
    program.help || (program.help = program.rawArgs.length === 3);
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
    program;

  }

  __defineProperty(New,  "run", function() {
    return Tower.Generator.run("app", {
      program: this.program,
      appName: this.program.args[1]
    });
  });

  return New;

})();

module.exports = Tower.Command.New;
