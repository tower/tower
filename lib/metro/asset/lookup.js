var Lookup;
Lookup = (function() {
  function Lookup() {}
  Lookup.digests = function() {
    return this._digests || (this._digests = {});
  };
  Lookup.stylesheetLookup = function() {
    return this._stylesheetLookup || (this._stylesheetLookup = this._createLookup(this.config.stylesheetDirectory, this.config.stylesheetExtensions, this.config.stylesheetAliases));
  };
  Lookup.javascriptLookup = function() {
    return this._javascriptLookup || (this._javascriptLookup = this._createLookup(this.config.javascriptDirectory, this.config.javascriptExtensions, this.config.javascriptAliases));
  };
  Lookup.imageLookup = function() {
    return this._imageLookup || (this._imageLookup = this._createLookup(this.config.imageDirectory, this.config.imageExtensions, this.config.imageAliases));
  };
  Lookup.fontLookup = function() {
    return this._fontLookup || (this._fontLookup = this._createLookup(this.config.fontDirectory, this.config.fontExtensions, this.config.fontAliases));
  };
  Lookup._createLookup = function(directory, extensions, aliases) {
    var path, paths, root, _i, _len, _ref;
    paths = [];
    _ref = this.config.loadPaths;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      path = this.join(path, directory);
      paths.push(path);
      paths = paths.concat(this.directories(path));
    }
    root = Metro.root;
    return new Metro.Support.Lookup({
      root: root,
      paths: paths,
      extensions: extensions,
      aliases: aliases
    });
  };
  Lookup.pathsFor = function(extension) {
    return this.lookupFor(extension).paths;
  };
  Lookup.lookupFor = function(extension) {
    switch (extension) {
      case ".css":
        return this.stylesheetLookup();
      case ".js":
        return this.javascriptLookup();
      default:
        return [];
    }
  };
  Lookup.digestFor = function(source) {
    return this.digests[source] || source;
  };
  Lookup.computePublicPath = function(source, options) {
    var extension;
    if (options == null) {
      options = {};
    }
    if (this.isUrl(source)) {
      return source;
    }
    extension = options.extension;
    if (extension) {
      source = this.normalizeExtension(source, extension);
    }
    source = this.normalizeAssetPath(source, options);
    source = this.normalizeRelativeUrlRoot(source, this.relativeUrlRoot);
    source = this.normalizeHostAndProtocol(source, options.protocol);
    return source;
  };
  Lookup.computeAssetHost = function() {
    if (typeof this.config.host === "function") {
      return this.config.host.call(this);
    } else {
      return this.config.host;
    }
  };
  Lookup.normalizeExtension = function(source, extension) {
    return this.basename(source, extension) + extension;
  };
  Lookup.normalizeAssetPath = function(source, options) {
    if (options == null) {
      options = {};
    }
    if (this.isAbsolute(source)) {
      return source;
    } else {
      source = this.join(options.directory, source);
      if (options.digest !== false) {
        source = this.digestFor(source);
      }
      if (!source.match(/^\//)) {
        source = "/" + source;
      }
      return source;
    }
  };
  Lookup.normalizeRelativeUrlRoot = function(source, relativeUrlRoot) {
    if (relativeUrlRoot && !source.match(new RegExp("^" + relativeUrlRoot + "/"))) {
      return "" + relativeUrlRoot + source;
    } else {
      return source;
    }
  };
  Lookup.normalizeHostAndProtocol = function(source, protocol) {
    var host;
    host = this.computeAssetHost(source);
    if (host) {
      return "" + host + source;
    } else {
      return source;
    }
  };
  Lookup.find = function(source, options) {
    var paths;
    if (options == null) {
      options = {};
    }
    paths = this.lookup(source, options);
    if (!(paths && paths.length > 0)) {
      Metro.raise("errors.asset.notFound", source, paths);
    }
    return new Metro.Asset(paths[0], options.extension);
  };
  Lookup.lookup = function(source, options) {
    var lookup, pattern;
    if (options == null) {
      options = {};
    }
    source = this.normalizeSource(source);
    options.extension || (options.extension = this.extname(source));
    if (options.extension === "") {
      Metro.raise("errors.missingOption", "extension", "Asset#find");
    }
    pattern = "(?:" + Metro.Support.RegExp.escape(options.extension) + ")?$";
    source = source.replace(new RegExp(pattern), options.extension);
    lookup = this.lookupFor(options.extension);
    if (lookup) {
      return lookup.find(source);
    } else {
      return [];
    }
  };
  Lookup.match = function(path) {
    return !!path.match(this.pathPattern());
  };
  Lookup.normalizeSource = function(source) {
    return source.replace(this.pathPattern(), "");
  };
  Lookup.pathPattern = function() {
    return this._pathPattern || (this._pathPattern = new RegExp("^/(assets|" + this.config.stylesheetDirectory + "|" + this.config.javascriptDirectory + "|" + this.config.imageDirectory + "|" + this.config.fontDirectory + ")/"));
  };
  return Lookup;
})();
module.exports = Lookup;