var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.StoreS3 = (function(_super) {
  var StoreS3;

  function StoreS3() {
    return StoreS3.__super__.constructor.apply(this, arguments);
  }

  StoreS3 = __extends(StoreS3, _super);

  StoreS3.reopen({
    client: function() {
      var knox;
      if (this._client) {
        return this._client;
      }
      knox = require('knox');
      return this._client = knox.createClient(Tower.config.credentials.s3);
    },
    insert: function(cursor, callback) {
      var client, create, files, fs, mime,
        _this = this;
      files = [cursor];
      client = this.client();
      mime = require('mime');
      fs = require('fs');
      create = function(file, next) {
        delete file._data;
        if (file.to == null) {
          return next(new Error('Must specify the upload path, file.to, for ' + file.path));
        }
        return fs.stat(file.path, function(error, stats) {
          var headers, upload;
          file.length = stats.size;
          headers = {
            'Content-Length': file.length,
            'Content-Type': file.mime || mime.lookup(file.filename),
            'x-amz-acl': 'public-read'
          };
          upload = function() {
            var stream;
            stream = fs.createReadStream(file.path);
            return client.putStream(stream, file.to, headers, function(error, response) {
              stream.destroy();
              return next(error);
            });
          };
          return upload();
        });
      };
      return Tower.series(files, create, function(error) {
        if (callback) {
          return callback.call(_this, error);
        }
      });
    },
    create: function() {
      return this.insert.apply(this, arguments);
    },
    update: function(updates, cursor, callback) {},
    destroy: function(cursor, callback) {
      var client, destroy, paths,
        _this = this;
      paths = _.castArray(cursor);
      client = this.client();
      destroy = function(path, next) {
        if (path == null) {
          return next();
        }
        return client.deleteFile(path, next);
      };
      return Tower.series(paths, destroy, function(error) {
        if (callback) {
          return callback.call(_this, error);
        }
      });
    },
    createDatabase: function() {
      return this.createBucket.apply(this, arguments);
    },
    createBucket: function() {}
  });

  return StoreS3;

})(Tower.Store);

module.exports = Tower.StoreS3;
