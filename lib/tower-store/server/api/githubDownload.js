var __hasProp = {}.hasOwnProperty,
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

Tower.GithubDownloadStore = (function(_super) {
  var GithubDownloadStore;

  function GithubDownloadStore() {
    return GithubDownloadStore.__super__.constructor.apply(this, arguments);
  }

  GithubDownloadStore = __extends(GithubDownloadStore, _super);

  GithubDownloadStore.reopen({
    configure: function(options, callback) {
      var _this = this;
      if (this.isConfigured) {
        return;
      }
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});
      return this._extractCredentials(options, function(error, key, secret) {
        if (error) {
          throw error;
        }
        _this.config = {
          key: key,
          secret: secret
        };
        _this.isConfigured = true;
        if (callback) {
          return callback.call(_this);
        }
      });
    },
    create: function(criteria, callback) {
      var local,
        _this = this;
      local = criteria.from;
      return this._createGitHubResource(criteria, function(response) {
        var command, data;
        data = response.body;
        command = ("curl\n-F \"key=" + data.path + "\"\n-F \"acl=" + data.acl + "\"\n-F \"success_action_status=201\"\n-F \"Filename=" + data.name + "\"\n-F \"AWSAccessKeyId=" + data.accesskeyid + "\"\n-F \"Policy=" + data.policy + "\"\n-F \"Signature=" + data.signature + "\"\n-F \"Content-Type=" + data.mime_type + "\"\n-F \"file=@" + local + "\"\nhttps://github.s3.amazonaws.com/").replace(/\n/g, ' ');
        return _this._exec(command, function(error, data) {
          if (error) {
            if (callback) {
              return callback.call(_this, error);
            }
            throw error;
          }
          return process.nextTick(function() {
            if (callback) {
              return callback.call(_this, null, data);
            }
          });
        });
      });
    },
    find: function(criteria, callback) {
      var key, repo, secret,
        _this = this;
      this._normalizeCriteria(criteria);
      key = this.config.key;
      secret = this.config.secret;
      repo = criteria.repo;
      this._request('get', "https://api.github.com/repos/" + key + "/" + repo + "/downloads?access_token=" + secret).end(function(response) {
        var downloads;
        downloads = _.isArray(response.body) ? response.body : [];
        return callback.call(_this, null, downloads);
      });
      return void 0;
    },
    update: function(criteria, callback) {
      var key, name, repo, secret,
        _this = this;
      this._normalizeCriteria(criteria);
      key = this.config.key;
      secret = this.config.secret;
      repo = criteria.repo;
      name = criteria.name;
      return this.find(criteria, function(error, downloads) {
        var existing;
        existing = _.detect(downloads, function(download) {
          return download.name === name;
        });
        if (existing) {
          criteria.id = existing.id;
          return _this.destroy(criteria, function(response) {
            delete criteria.id;
            return process.nextTick(function() {
              return _this.create(criteria, callback);
            });
          });
        } else {
          return _this.create(criteria, callback);
        }
      });
    },
    destroy: function(criteria, callback) {
      var key, repo, request;
      this._normalizeCriteria(criteria, false);
      key = this.config.key;
      repo = criteria.repo;
      request = this._request('del', "https://api.github.com/repos/" + key + "/" + repo + "/downloads/" + criteria.id + "?access_token=" + this.config.secret);
      request.set('Content-Length', 0);
      return request.end(callback);
    },
    _createGitHubResource: function(criteria, callback) {
      var data, key, repo, request, secret;
      this._normalizeCriteria(criteria);
      data = this._buildGitHubResource(criteria);
      key = this.config.key;
      secret = this.config.secret;
      repo = criteria.repo;
      request = this._request('post', "https://api.github.com/repos/" + key + "/" + repo + "/downloads?access_token=" + secret);
      request.send(data);
      return request.end(callback);
    },
    _buildGitHubResource: function(criteria) {
      var contentType, data, local, remote, size;
      this._normalizeCriteria(criteria);
      local = criteria.from;
      remote = criteria.to;
      contentType = criteria.contentType || require('mime').lookup(local);
      size = criteria.size != null ? parseInt(criteria.size) : require('fs').statSync(local).size;
      data = {
        name: criteria.name,
        size: parseInt(size),
        content_type: contentType
      };
      if (criteria.description != null) {
        data.description = criteria.description;
      }
      return data;
    },
    _normalizeCriteria: function(criteria, upload) {
      var repo;
      if (upload == null) {
        upload = true;
      }
      if (upload && !(criteria.from != null)) {
        throw new Error('Must specify the `from:` key, the path to the local file');
      }
      if (criteria._normalized) {
        return criteria;
      }
      repo = this.config.repo || criteria.repo;
      if (repo == null) {
        throw new Error('Must specify a GitHub repo: `create({repo: "my-project"})`');
      }
      criteria.repo = repo;
      if (upload) {
        criteria.to || (criteria.to = require('path').basename(criteria.from));
      }
      criteria.name = criteria.name != null ? criteria.name : criteria.to;
      criteria._normalized = true;
      return criteria;
    },
    _extractCredentials: function(options, callback) {
      var key, secret,
        _this = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});
      key = options.key || options.username;
      secret = options.secret || options.token || options.password;
      if (!((key != null) && (secret != null))) {
        return this._exec('git config --global --get-regexp github', function(error, stdout) {
          if (error) {
            return callback(new Error("Make sure you have created a GitHub token.\ngit config --global github.token <hash>"));
          }
          stdout.split('\n').forEach(function(line) {
            return line.replace(/^github\.(\w+)\s+(.+)$/, function(__, configKey, configValue) {
              switch (configKey) {
                case 'user':
                case 'username':
                  return key = configValue.trim();
                case 'token':
                  return secret = configValue.trim();
              }
            });
          });
          options.key || (options.key = key);
          options.secret = secret;
          if (callback) {
            return callback.call(_this, null, key, secret);
          }
        });
      } else {
        options.key || (options.key = key);
        options.secret || (options.secret = secret);
        if (callback) {
          return callback.call(this, null, key, secret);
        }
      }
    },
    _request: function(method, path) {
      return Tower.module('superagent')[method.toLowerCase()](path);
    },
    _exec: function(command, callback) {
      return require('child_process').exec(command, callback);
    }
  });

  return GithubDownloadStore;

})(Tower.Store);
