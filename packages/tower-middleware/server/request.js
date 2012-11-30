var request;

request = require('express').request;

request.__defineGetter__('version', function() {});
