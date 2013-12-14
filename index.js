
/**
 * Module dependencies.
 */

exports.resource = require('tower-resource');
exports.query = require('tower-query');
exports.adapter = require('tower-adapter');
exports.router = require('tower-router');
exports.validator = require('tower-validator');
exports.type = require('tower-type');
exports.memory = require('tower-memory-adapter');
exports.server = require('tower-server');
exports.view = require('tower-view');
exports.route = require('tower-server-route');

if ('undefined' !== typeof window) {
  exports.directive = require('tower-directive');
  exports.content = require('tower-content');
  exports.template = require('tower-template');

  // basic directives
  require('tower-list-directive');
  require('tower-interpolation-directive');
}

/**
 * Version 0.5.0!
 */

exports.version = '0.5.0';

/**
 * Initialize
 */

exports.initialize = function() {
  var program = require('commander')
    .usage('server [options]')
    .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)', 'development')
    .option('-p, --port <n>', 'port for the application')
    .option('-disable-watcher', 'Disable the file watcher.')
    //.option('--static', 'disable-watch')
    //.option('--single', 'Single page app')
    .option('-v, --version')
    .on('--help', function(){
      console.log([
          '    Examples:'
        , '      tower generate scaffold Post title:string body:text belongsTo:user'
        , '      tower generate model Post title:string body:text belongsTo:user'
      ].join("\n"));
    }).parse(process.argv);
  return require('tower-proxy')(program);
};
