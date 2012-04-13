
Tower.Command.New = (function() {

  function New(argv) {
    var program;
    this.program = program = require('commander');
    program.version(Tower.version).option('-t, --template <template>', 'Path to an application template (can be a filesystem path or URL)').option('--skip-procfile', "Don't create a Procfile (for Heroku)").option('--skip-git', "Skip Git ignores and keeps").option('-d, --database <database>', 'Preconfigure for selected database (options: mongodb)', "mongodb").option('-e, --engine <engine>', 'Preconfigure for template engine (options: coffeecup/jade/eco/ejs)').option('-T, --title <title>', 'Your project title (as opposed to its file name)').option('-D, --description <description>', 'Your project tagline (one sentence)', "").option('-K, --keywords <keywords>', 'Your project keywords (e.g. "node.js, file uploading, s3")', "").option('-n, --namespace <namespace>', 'Global namespace for your app (defaults to App)').option('-v, --version', 'output version number').option('-h, --help', '\ \ Usage:\n\ \   tower new <app-name> [options]\n\ \ \n\ \ Options:\n\ \   -T, --title <title>               project title (as opposed to its file name)\n\ \   -D, --description <description>   project tagline (one sentence)\n\ \   -K, --keywords <keywords>         project keywords (e.g. "node.js, file uploading, s3")\n\ \   -n, --namespace <namespace>       global namespace for your app (defaults to YourProjectName)\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \   --skip-procfile                   skip creating a Procfile (for deploying to Heroku)\n\ \   --skip-git                        Skip Git ignores and keeps\n\ \ ');
    program.parse(argv);
    program.help || (program.help = program.rawArgs.length === 3);
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
    program.namespace || (program.namespace = "App");
  }

  New.prototype.run = function() {
    return Tower.Generator.run("app", {
      program: this.program,
      appName: this.program.args[1]
    });
  };

  return New;

})();

module.exports = Tower.Command.New;
