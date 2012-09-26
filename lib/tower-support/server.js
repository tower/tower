var _path;

require('./shared');

_path = require('path');

Tower.Support.on_load = require('node-obj-watch').on_load;

require('pathfinder').File.glob = function() {
  var found, index, item, path, paths, result, _i, _j, _len, _len1;
  paths = Array.prototype.slice.call(arguments, 0, arguments.length);
  result = [];
  for (_i = 0, _len = paths.length; _i < _len; _i++) {
    path = paths[_i];
    if (this.exists(path)) {
      found = require('wrench').readdirSyncRecursive(path);
      for (index = _j = 0, _len1 = found.length; _j < _len1; index = ++_j) {
        item = found[index];
        result.push(path + _path.sep + item);
      }
    }
  }
  return result;
};
