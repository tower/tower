
Tower.Command.New = (function() {

  function New(argv) {
    this.program = require('commander');
    this.program.version(Tower.version).option('-t, --template <template>', 'Path to an application template (can be a filesystem path or URL)').option('--skip-procfile', "Don't create a Procfile (for Heroku)").option('--skip-git', "Skip Git ignores and keeps").option('-d, --database <database>', 'Preconfigure for selected database (options: mongodb)', "mongodb").option('-e, --engine <engine>', 'Preconfigure for template engine (options: coffeekup/jade/eco/ejs)').option('-D, --description <description>', 'Your project tagline (one sentence)', "").option('-K, --keywords <keywords>', 'Your project keywords (e.g. "node.js, file uploading, s3")', "").option('-T, --title <title>', 'Your project title (as opposed to its file name)').option('-n, --namespace <namespace>', 'Global namespace for your app (defaults to YourProjectName)').parse(argv);
  }

  New.prototype.run = function() {
    return Tower.Generator.run("appGenerator", {
      program: this.program,
      projectName: this.program.args[1]
    });
  };

  return New;

})();

module.exports = Tower.Command.New;
