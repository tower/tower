
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
