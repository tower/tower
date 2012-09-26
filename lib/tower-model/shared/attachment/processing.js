var _;

_ = Tower._;

Tower.AttachmentProcessingMixin = {
  included: function() {
    this.field('fingerprint', {
      type: 'String'
    });
    this.field('processed', {
      type: 'Boolean',
      "default": false
    });
    this["protected"]('processed');
    this.before('save', 'prepareForDestroy');
    this.before('save', 'setAttachmentAttributes');
    this.after('save', 'destroyOldFiles');
    this.after('save', 'saveFiles');
    this.before('destroy', 'prepareForDestroy');
    this.after('destroy', 'destroyFiles');
    return this.defaults({
      defaultStyle: 'original',
      defaultUrl: '/uploads/:class-:style/missing.png',
      restrictedCharacters: /[&$+,\/:;=?@<>\[\]\{\}\|\\\^~%# ]/,
      onlyProcess: [],
      path: ':root/public:url',
      preserveFiles: false,
      processors: ['thumbnail'],
      storage: 'filesystem',
      styles: {},
      url: '/uploads/:class/:style/:name'
    });
  },
  ClassMethods: {
    DELAYED_POST_PROCESSING: false,
    parseDimensions: function(string) {
      string.match(/\b(\d*)x?(\d*)\b([\>\<\#\@\%^!])?/i);
      return {
        width: RegExp.$1,
        height: RegExp.$2,
        modifier: RegExp.$3
      };
    },
    postProcessAndSave: function(id, callback) {
      var _this = this;
      return this.where({
        id: {
          $in: [id]
        }
      }).first(function(error, record) {
        return record.postProcessAndSave(callback);
      });
    },
    styles: function(styles) {
      return this.reopen({
        styles: Ember.computed(function() {
          return _.extend({}, styles);
        }).cacheable()
      });
    }
  },
  isUploading: false,
  files: Ember.computed(function(key, value) {
    if (arguments.length === 2) {
      return {
        original: value[0]
      };
    } else {
      return {};
    }
  }).cacheable(),
  processors: [
    function(file, style, callback) {
      var createTempFile, ext, fs, height, im, newName, newPath, parts, temp, width, _ref,
        _this = this;
      im = require('gm').subClass({
        imageMagick: true
      });
      temp = require('temp');
      fs = require('fs');
      newPath = file.path + style[0];
      parts = file.filename.split('.');
      ext = parts.pop();
      newName = parts.join('.') + style[0] + '.' + ext;
      _ref = this.constructor.parseDimensions(style[0]), width = _ref.width, height = _ref.height;
      createTempFile = function(opts, callback) {
        return temp.open(opts, function(error, info) {
          return fs.close(info.fd, function(error) {
            return callback(error, info);
          });
        });
      };
      return createTempFile({
        suffix: "." + ext
      }, function(error, info) {
        var options;
        options = {
          srcPath: file.path,
          width: width,
          height: height,
          dstPath: info.path
        };
        return im(file.path).resize(width, height).write(info.path, function(error) {
          info.filename = newName;
          info.mime = file.mime;
          return callback.call(_this, error, info);
        });
      });
    }
  ],
  prepareForDestroy: function() {
    var path, paths, style, styles, _i, _len;
    if (this.constructor.defaults().preserveFiles || this.get('isNew')) {
      return;
    }
    paths = [];
    styles = _.keys(this.get('styles'));
    if (_.indexOf(styles, 'original') === -1) {
      styles.push('original');
    }
    for (_i = 0, _len = styles.length; _i < _len; _i++) {
      style = styles[_i];
      path = this.urlFor(style, true);
      if (path != null) {
        paths.push(path);
      }
    }
    Ember.set(this, '_queuedForDestroy', paths);
    return void 0;
  },
  destroyFiles: function() {},
  destroyOldFiles: function(callback) {
    var paths;
    paths = Ember.get(this, '_queuedForDestroy');
    delete this._queuedForDestroy;
    if (paths && paths.length) {
      return this.constructor.fileStore.destroy(paths, callback);
    } else {
      return callback();
    }
  },
  setAttachmentAttributes: function(callback) {
    var file,
      _this = this;
    file = this.get('files').original;
    if (file) {
      Ember.beginPropertyChanges();
      if (this.get('name') == null) {
        this.set('name', this._sanitizeFilename(file.name));
      }
      if (this.get('contentType') == null) {
        this.set('contentType', file.mime);
      }
      if (this.get('size') == null) {
        this.set('size', file.length);
      }
      if (!((this.get('width') != null) && (this.get('height') != null))) {
        require('gm').subClass({
          imageMagick: true
        })(file.path).identify(function(error, features) {
          _this.set('width', features.width);
          _this.set('height', features.height);
          try {
            _this.set('fingerprint', features.Properties.signature);
          } catch (_error) {}
          Ember.endPropertyChanges();
          return callback();
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
    return void 0;
  },
  _sanitizeFilename: function(string) {
    var restricted;
    restricted = this.constructor.defaults().restrictedCharacters;
    if (restricted) {
      return string.replace(restricted, '-');
    } else {
      return string;
    }
  },
  saveFiles: function(callback) {
    var _this = this;
    return this.saveFile('original', function(error) {
      if (_this.constructor.DELAYED_POST_PROCESSING) {
        return _this.enqueue('postProcessAndSave', _this.get('id'), callback);
      } else {
        return _this.postProcessAndSave(callback);
      }
    });
  },
  postProcessAndSave: function(callback) {
    var _this = this;
    return this.postProcess(function(error) {
      var saveFile, styleNames;
      styleNames = _.keys(_this.get('files'));
      saveFile = function(styleName, next) {
        if (styleName === 'original') {
          return next();
        }
        return _this.saveFile(styleName, next);
      };
      return Tower.series(styleNames, saveFile, callback);
    });
  },
  saveFile: function(styleName, callback) {
    var file, files,
      _this = this;
    this.set('isUploading', true);
    files = this.get('files');
    file = files[styleName];
    file.to || (file.to = this.urlFor(styleName));
    this.constructor.fileStore.create(file, function(error) {
      _this.set('isUploading', false);
      if (callback) {
        return callback.call(_this, error);
      }
    });
    return void 0;
  },
  postProcess: function(callback) {
    var file, files, postProcessIterator, styleNames, styles,
      _this = this;
    styles = this.get('styles');
    styleNames = _.keys(styles);
    files = this.get('files');
    file = files.original;
    file._data || (file._data = require('fs').readFileSync(file.path, 'binary'));
    postProcessIterator = function(styleName, styleComplete) {
      var processorIterator, processors, style;
      if (styleName === 'original') {
        return styleComplete();
      }
      style = styles[styleName];
      processors = style.processors;
      processors || (processors = _this.get('processors'));
      file = files.original;
      processorIterator = function(processor, processorComplete) {
        return processor.call(_this, file, style, function(error, resultFile) {
          files[styleName] = file = resultFile;
          return processorComplete(error);
        });
      };
      return Tower.series(processors, processorIterator, styleComplete);
    };
    return Tower.series(styleNames, postProcessIterator, callback);
  },
  urlFor: function(style, oldValue) {
    return this._parsePath(this.constructor.defaults().url, style, oldValue);
  },
  pathFor: function(style, oldValue) {
    return this._parsePath(this.constructor.defaults().path, style, oldValue);
  },
  _parsePath: function(path, style, oldValue) {
    var data,
      _this = this;
    data = this.get('styles')[style] || {};
    data.format || (data.format = 'png');
    return path.replace(/:(\w+)/g, function(__, attribute) {
      switch (attribute) {
        case 'bucket':
        case 'format':
          return data[attribute];
        case 'url':
          return _this.urlFor(style);
        case 'root':
          return Tower.root;
        case 'style':
          return style;
        case 'class':
          return _.parameterize(_this.constructor.className());
        case 'name':
        case 'filename':
          if (oldValue) {
            return _this.attributeWas('name');
          } else {
            return _this.get('name');
          }
          break;
        case 'geometry':
          return "" + (_this.get('width')) + "x" + (_this.get('height'));
        default:
          return _this.get(attribute);
      }
    });
  }
};
